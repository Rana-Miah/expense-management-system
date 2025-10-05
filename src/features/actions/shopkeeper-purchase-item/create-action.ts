'use server'

import { db } from "@/drizzle/db"
import { bankAccountTable, itemTable, shopKeeperItemTable, shopkeeperPaymentTable, shopkeeperPurchaseTable, shopkeeperTable, trxTable } from "@/drizzle/schema"
import { BankSelectValue, ShopkeeperItemInsertValue, ShopkeeperPaymentInsertValue, ShopkeeperPurchaseInsertValue, ShopkeeperSelectValue, TrxInsertValue, TrxItemInsertValue } from "@/drizzle/type"
import { shopkeeperPurchaseItemFormSchema } from "@/features/schemas/shopkeeper/purchase-item"
import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, messageUtils, successResponse, tryCatch } from "@/lib/helpers"
import { getBankByIdAndClerkUserId } from "@/services/bank"
import { getShopkeeperByIdAndClerkUserId } from "@/services/shopkeeper"
import { getTrxNameByIdAndClerkUserId } from "@/services/trx-name"
import { and, eq } from "drizzle-orm"

export const createShopkeeperPurchaseItemAction = async (value: unknown) => {

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperPurchaseItemFormSchema.safeParse(value)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const {
        isIncludedItems,
        trxNameId,
        shopkeeperId,
        sourceBankId,
        totalAmount,
        paidAmount,
        description,
        purchaseDate,
        items
    } = validation.data

    if (totalAmount < 1) return failureResponse('Total amount must be grater than 0!')

    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))

    if (existShopkeeper.totalDue < paidAmount) return failureResponse(`Paid amount exceeds the shopkeeper total due!`)

    if (!existShopkeeper.isBan) return failureResponse(`Shopkeeper is ban! Not allow to purchase from ${existShopkeeper.name} shopkeeper`)


    if (items && isIncludedItems && items.length < 1) return failureResponse(messageUtils.itemsRequiredMessage())


    //! everything will run under db tx

    const res = await db.transaction(
        async (tx) => {
            // !================================DB TRANSACTION START================================
            const isOverPaid = paidAmount > totalAmount
            const isEqualPaid = paidAmount === totalAmount
            const isLessPaid = paidAmount < totalAmount
            const isPaidAvailable = paidAmount > 0

            const overPaid = isOverPaid ? paidAmount - totalAmount : 0
            const dueAmount = isLessPaid ? totalAmount - paidAmount : 0

            const generateDescription = (descriptionFor: string) => {
                const customDescription = `1. Total bill is ${totalAmount}, 2. Total paid amount is ${paidAmount}, 3. Over payment is ${overPaid}, 4. Total due amount is ${dueAmount}`
                return description && description.length > 0 ? `Shopkeeper purchase description:${description}, ${descriptionFor} description: ${customDescription}` : customDescription
            }


            // ! Functions Start
            const getItemUnitByIdAndClerkUserId = async (itemUnitId: string, clerkUserId: string) => {
                const existItemUnit = await tx.query.itemUnitTable.findFirst({
                    where: (table, { and, eq }) => (and(
                        eq(table.id, itemUnitId),
                        eq(table.clerkUserId, clerkUserId)
                    ))
                })

                return existItemUnit
            }

            const createTrxItems = async (value: TrxItemInsertValue) => {
                const [newTrxItem] = await tx.insert(itemTable).values(value).returning()
                return newTrxItem
            }

            const createShopkeeperItem = async (value: ShopkeeperItemInsertValue) => {
                const [newShopkeeperItem] = await tx.insert(shopKeeperItemTable).values(value).returning()
                return newShopkeeperItem
            }

            const createShopkeeperPurchase = async (value: ShopkeeperPurchaseInsertValue) => {
                const [newShopkeeperPurchase] = await tx.insert(shopkeeperPurchaseTable).values(value).returning()
                return newShopkeeperPurchase
            }

            const createShopkeeperPayment = async (value: ShopkeeperPaymentInsertValue) => {
                const [newShopkeeperPayment] = await tx.insert(shopkeeperPaymentTable).values(value).returning()
                return newShopkeeperPayment
            }

            const createTrx = async (value: TrxInsertValue) => {
                const [newTrx] = await tx.insert(trxTable).values(value).returning()
                return newTrx
            }

            const updateBank = async (bankId: string, clerkUserId: string, value: Pick<BankSelectValue, 'balance'>) => {
                const [updatedBank] = await tx.update(bankAccountTable).set(value).where(and(
                    eq(bankAccountTable.id, bankId),
                    eq(bankAccountTable.clerkUserId, clerkUserId)
                )).returning()
                return updatedBank
            }

            const updateShopkeeper = async (shopkeeperId: string, clerkUserId: string, value: Pick<ShopkeeperSelectValue, 'totalDue'>) => {
                const [updatedShopkeeper] = await tx.update(shopkeeperTable).set(value).where(and(
                    eq(shopkeeperTable.id, shopkeeperId),
                    eq(shopkeeperTable.clerkUserId, clerkUserId)
                )).returning()
                return updatedShopkeeper
            }


            // ! Functions End


            let existSourceBankId: string | undefined = sourceBankId
            if (sourceBankId) {

                // update bank balance deduct paid amount
                // create trx -> amount->paid
                // create update shopkeeper total due if over pay deduct total due if less pay add due balance

                if (!trxNameId) return failureResponse(messageUtils.missingFieldValue('transaction name'))
                if (!isPaidAvailable) return failureResponse(`Paid amount must be grater than 0!`)

                const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))

                if (getExistBankError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedGetMessage('exist bank'), getExistBankError)
                }
                if (!existBank) {
                    tx.rollback()
                    return failureResponse(messageUtils.notFoundMessage('bank'), getExistBankError)
                }

                if (!existBank.isActive) {
                    tx.rollback()
                    return failureResponse(messageUtils.notActiveMessage(`${existBank.name} bank`), getExistBankError)
                }

                if (existBank.balance < paidAmount) {
                    tx.rollback()
                    return failureResponse(messageUtils.insufficientBalance(), getExistBankError)
                }
                existSourceBankId = existBank.id

                const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))

                if (getExistTrxNameError) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistBankError)
                }
                if (!existTrxName) {
                    tx.rollback()
                    return failureResponse(messageUtils.notFoundMessage('transaction name'), getExistBankError)
                }

                if (!existTrxName.isActive) {
                    tx.rollback()
                    return failureResponse(messageUtils.notActiveMessage(`transaction name ${existBank.name}`), getExistBankError)
                }



                // update bank 

                const [updatedBank, updateBankError] = await tryCatch(updateBank(existBank.id, userId, {
                    balance: existBank.balance - paidAmount
                }))

                if (updateBankError || !updatedBank) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedUpdateMessage('deduct bank balance'), updateBankError)
                }


                //! Transaction create

                const [newTrx, newTrxError] = await tryCatch(createTrx({
                    amount: paidAmount,
                    clerkUserId: userId,
                    trxDate: purchaseDate,
                    trxNameId: existTrxName.id,
                    trxVariant: 'Internal',
                    type: 'Debit',
                    isIncludedItems,
                    sourceBankId: existBank.id,
                    trxDescription: generateDescription('Transaction')
                }))

                if (newTrxError || !newTrx) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('transaction during shopkeeper purchase'))
                }

                if (items && isIncludedItems && items.length > 0) {

                    const trxItemPromises: Promise<TrxItemInsertValue>[] = []

                    items.forEach(
                        async item => {
                            const [existItemUnit, getExistItemUnitError] = await tryCatch(getItemUnitByIdAndClerkUserId(item.itemUnitId, userId))

                            if (!existItemUnit || getExistItemUnitError) return

                            const newTrxItemPromise = createTrxItems({
                                ...item,
                                trxId: newTrx.id
                            })

                            trxItemPromises.push(newTrxItemPromise)
                        })

                    if (trxItemPromises.length > 0) {
                        const [newTrxItems, newTrxItemsError] = await tryCatch(Promise.all(trxItemPromises))

                        if (newTrxItemsError || !newTrxItems || newTrxItems.length < 1) {
                            tx.rollback()
                            return failureResponse(messageUtils.failedCreateMessage('transaction items during purchase'))
                        }
                    }

                }


                //! Shopkeeper payment create
                const [newShopkeeperPayment, newShopkeeperPaymentError] = await tryCatch(createShopkeeperPayment({
                    amount: paidAmount,
                    clerkUserId: userId,
                    paymentDate: purchaseDate,
                    shopkeeperId: existShopkeeper.id,
                    sourceBankId: existBank.id,
                    description: generateDescription('Shopkeeper payment'),
                }))

                if (newShopkeeperPaymentError || !newShopkeeperPayment) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('shopkeeper payment during purchasing'), newShopkeeperPaymentError)
                }


                //* update shopkeeper if total amount and paid amount not equal and paid amount must be grater than zero
                if (!isEqualPaid) {
                    let shopkeeperTotalDue: number = existShopkeeper.totalDue

                    if (isOverPaid) {
                        shopkeeperTotalDue -= overPaid
                    }

                    if (isLessPaid) {
                        shopkeeperTotalDue += dueAmount
                    }
                    const [updatedShopkeeper, updateShopkeeperError] = await tryCatch(
                        updateShopkeeper(existShopkeeper.id, userId, {
                            totalDue: shopkeeperTotalDue
                        })
                    )

                    if (!updatedShopkeeper || updateShopkeeperError) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedUpdateMessage('shopkeeper total due during purchase'))
                    }

                }
            }

            const [newPurchase, newPurchaseError] = await tryCatch(
                createShopkeeperPurchase({
                    clerkUserId: userId,
                    dueAmount,
                    paidAmount,
                    totalAmount,
                    purchaseDate,
                    shopkeeperId: existShopkeeper.id,
                    description: `${description} => Additional Description:`,
                    isIncludedItems,
                    sourceBankId: existSourceBankId
                })
            )

            if (newPurchaseError || !newPurchase) {
                tx.rollback()
                return failureResponse(messageUtils.failedCreateMessage('shopkeeper purchase'), newPurchaseError)
            }

            if (items && isIncludedItems && items.length > 0) {

                const shopkeeperItemPromises: Promise<TrxItemInsertValue>[] = []

                items.forEach(
                    async item => {
                        const [existItemUnit, getExistItemUnitError] = await tryCatch(getItemUnitByIdAndClerkUserId(item.itemUnitId, userId))

                        if (!existItemUnit || getExistItemUnitError) return

                        const newTrxItemPromise = createShopkeeperItem({
                            ...item,
                            shopkeeperPurchaseId: newPurchase.id,
                        })

                        shopkeeperItemPromises.push(newTrxItemPromise)
                    })

                if (shopkeeperItemPromises.length > 0) {
                    const [newTrxItems, newTrxItemsError] = await tryCatch(Promise.all(shopkeeperItemPromises))

                    if (newTrxItemsError || !newTrxItems || newTrxItems.length < 1) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedCreateMessage('transaction items during purchase'))
                    }
                }

            }




            return successResponse(messageUtils.createMessage('shopkeeper purchase'), newPurchase)

            // !================================DB TRANSACTION END================================
        }
    )




}