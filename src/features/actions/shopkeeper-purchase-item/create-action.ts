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
import { revalidatePath } from "next/cache"

export const createShopkeeperPurchaseItemAction = async (value: unknown) => {

    const [userId, clerkError] = await tryCatch(currentUserId())

    if (clerkError) return failureResponse(messageUtils.clerkErrorMessage(), clerkError)

    const validation = shopkeeperPurchaseItemFormSchema.safeParse(value)

    if (!validation.success) return failureResponse(messageUtils.invalidFieldsMessage(), validation.error)

    const {
        shopkeeperId,
        totalAmount,
        paidAmount,
        isIncludedItems,
        trxNameId,
        sourceBankId,
        description,
        purchaseDate,
        items
    } = validation.data

    const isOverPaid = paidAmount > totalAmount
    const isEqualPaid = paidAmount === totalAmount
    const isLessPaid = paidAmount < totalAmount
    const isPaidAvailable = paidAmount > 0

    const overPaid = isOverPaid ? paidAmount - totalAmount : 0
    const dueAmount = isLessPaid ? totalAmount - paidAmount : 0


    //! get exist shopkeeper
    const [existShopkeeper, getExistShopkeeperError] = await tryCatch(getShopkeeperByIdAndClerkUserId(shopkeeperId, userId))

    if (getExistShopkeeperError) return failureResponse(messageUtils.failedGetMessage('exist shopkeeper'), getExistShopkeeperError)

    if (!existShopkeeper) return failureResponse(messageUtils.notFoundMessage('shopkeeper'))

    if (existShopkeeper.isDeleted) return failureResponse(messageUtils.deletedRowMessage(`shopkeeper "${existShopkeeper.name}"`))

    if (existShopkeeper.isBlock) return failureResponse(`Shopkeeper is ban! Not allow to purchase from ${existShopkeeper.name} shopkeeper`)

    if (existShopkeeper.totalDue < overPaid) return failureResponse('You are trying to pay more that shopkeeper due after purchase!')



    if (items && isIncludedItems && items.length < 1) return failureResponse(messageUtils.itemsRequiredMessage())


    //! everything will run under db tx

    const [txResult, txError] = await tryCatch(
        db.transaction(
            async (tx) => {
                // !================================DB TRANSACTION START================================


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

                    //! get exist bank
                    const [existBank, getExistBankError] = await tryCatch(getBankByIdAndClerkUserId(sourceBankId, userId))
                    if (getExistBankError) {
                        return failureResponse(messageUtils.failedGetMessage('exist bank'), getExistBankError)
                    }
                    if (!existBank) {
                        return failureResponse(messageUtils.notFoundMessage('bank'))
                    }
                    if (!existBank.isActive) {
                        return failureResponse(messageUtils.notActiveMessage(`${existBank.name} bank`))
                    }
                    if (existBank.isDeleted) {
                        return failureResponse(messageUtils.deletedRowMessage(`bank ${existBank.name}`))
                    }
                    if (existBank.balance < paidAmount) {
                        return failureResponse(messageUtils.insufficientBalance())
                    }

                    existSourceBankId = existBank.id


                    //! get exist transaction name
                    const [existTrxName, getExistTrxNameError] = await tryCatch(getTrxNameByIdAndClerkUserId(trxNameId, userId))
                    if (getExistTrxNameError) {
                        tx.rollback()
                        return failureResponse(messageUtils.failedGetMessage('exist transaction name'), getExistBankError)
                    }
                    if (!existTrxName) {
                        tx.rollback()
                        return failureResponse(messageUtils.notFoundMessage('transaction name'))
                    }
                    if (!existTrxName.isActive) {
                        tx.rollback()
                        return failureResponse(messageUtils.notActiveMessage(`transaction name ${existBank.name}`))
                    }
                    if (existTrxName.isDeleted) {
                        tx.rollback()
                        return failureResponse(messageUtils.deletedRowMessage(`transaction name ${existBank.name}`))
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

                        for (const item of items) {
                            const [existItemUnit, getExistItemUnitError] = await tryCatch(getItemUnitByIdAndClerkUserId(item.itemUnitId, userId))
                            if (getExistItemUnitError) continue
                            if (!existItemUnit || existItemUnit.isDeleted) continue
                            trxItemPromises.push(createTrxItems({ ...item, trxId: newTrx.id }))
                        }

                        //! create transaction items transaction items promises available
                        if (trxItemPromises.length > 0) {
                            const [newTrxItems, newTrxItemsError] = await tryCatch(Promise.all(trxItemPromises))

                            if (newTrxItemsError || !newTrxItems || newTrxItems.length < 1) {
                                tx.rollback()
                                return failureResponse(messageUtils.failedCreateMessage('transaction items during purchase'))
                            }
                        }
                    }



                    //* update shopkeeper if total amount and paid amount not equal and paid amount must be grater than zero
                    if (!isEqualPaid) {
                        let shopkeeperTotalDue: number = existShopkeeper.totalDue

                        if (isOverPaid) {
                            shopkeeperTotalDue -= overPaid
                            //! Shopkeeper payment create
                            const [newShopkeeperPayment, newShopkeeperPaymentError] = await tryCatch(createShopkeeperPayment({
                                amount: overPaid,
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
                } else {


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


                //! create new purchase
                const [newPurchase, newPurchaseError] = await tryCatch(
                    createShopkeeperPurchase({
                        clerkUserId: userId,
                        dueAmount,
                        paidAmount,
                        totalAmount,
                        purchaseDate,
                        shopkeeperId: existShopkeeper.id,
                        description: generateDescription('Shopkeeper Purchase'),
                        isIncludedItems,
                        sourceBankId: existSourceBankId
                    })
                )

                if (newPurchaseError || !newPurchase) {
                    tx.rollback()
                    return failureResponse(messageUtils.failedCreateMessage('shopkeeper purchase'), newPurchaseError)
                }

                if (items && isIncludedItems && items.length > 0) {

                    const shopkeeperItemPromises: Promise<ShopkeeperItemInsertValue>[] = []

                    for (const item of items) {
                        const [existItemUnit, getExistItemUnitError] = await tryCatch(getItemUnitByIdAndClerkUserId(item.itemUnitId, userId))
                        if (getExistItemUnitError) continue
                        if (!existItemUnit || existItemUnit.isDeleted) continue
                        shopkeeperItemPromises.push(createShopkeeperItem({ ...item, shopkeeperPurchaseId: newPurchase.id }))
                    }

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
    )


    if (txError) return failureResponse(messageUtils.failedCreateMessage('shopkeeper items purchase'), txError)


    revalidatePath(`/shopkeepers/${existShopkeeper.id}/purchase-item`)

    return txResult
}