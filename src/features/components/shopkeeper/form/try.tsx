import { InputField, SelectInput } from '@/components/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ItemUnitSelectValue } from '@/drizzle/type';
import { ShopkeeperPurchaseItemFormValue } from '@/features/schemas/shopkeeper/purchase-item';
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form';


type Props = {
    form: UseFormReturn<ShopkeeperPurchaseItemFormValue>
    index: number;
    itemUnits: ItemUnitSelectValue[];
    pending: boolean;
}

export const Try = ({ index, form, itemUnits, pending }: Props) => {
    const { getValues, setValue, watch } = form

    const [isDisablePriceSwitch, setIsDisablePriceSwitch] = useState(false)
    const [isDisableQuantitySwitch, setIsDisableQuantitySwitch] = useState(false)
    const [isDisableTotalSwitch, setIsDisableTotalSwitch] = useState(false)


    const isKnowPriceId = `items.${index}.isKnowPrice` as const
    const isKnowPrice = watch(isKnowPriceId)
    const priceInputId = `items.${index}.price` as const


    const isKnowQuantityId = `items.${index}.isKnowQuantity` as const
    const isKnowQuantity = watch(isKnowQuantityId)
    const quantityInputId = `items.${index}.quantity` as const


    const isKnowTotalId = `items.${index}.isKnowTotal` as const
    const isKnowTotal = watch(isKnowTotalId)
    const totalInputId = `items.${index}.total` as const



    const bothHasPositive = (firstNum: number, secondNum: number) => firstNum > 0 && secondNum > 0

    // const bothHasPositiveWithZero = (firstNum: number, secondNum: number) => firstNum >= 0 && secondNum >= 0
    // const oneOfHasPositive = (firstNum: number, secondNum: number) => firstNum > 0 || secondNum > 0
    // const oneOfHasPositiveWithZero = (firstNum: number, secondNum: number) => firstNum >= 0 || secondNum >= 0
    const hasPositive = (num: number) => num > 0
    // const hasPositiveWithZero = (num: number) => num >= 0
    // const bothIsZero = (firstNum: number, secondNum: number) => firstNum === 0 && secondNum === 0
    const oneOfIsZero = (firstNum: number, secondNum: number) => firstNum === 0 || secondNum === 0


    const recalculateValue = () => {

        const priceInputValue = getValues(priceInputId)
        const quantityInputValue = getValues(quantityInputId)
        const totalInputValue = getValues(totalInputId)

        const isPriceSwitchOn = getValues(isKnowPriceId)
        const isQuantitySwitchOn = getValues(isKnowQuantityId)
        const isTotalSwitchOn = getValues(isKnowTotalId)

        const isQuantityAndTotalKnowSwitchOn = isQuantitySwitchOn && isTotalSwitchOn
        const isPriceAndTotalKnowSwitchOn = isPriceSwitchOn && isTotalSwitchOn
        const isQuantityAndPriceKnowSwitchOn = isQuantitySwitchOn && isPriceSwitchOn

        if (!isFinite(priceInputValue)) setValue(priceInputId, 0)
        if (!isFinite(quantityInputValue)) setValue(quantityInputId, 0)
        if (!isFinite(totalInputValue)) setValue(totalInputId, 0)

        if (hasPositive(priceInputValue)) setIsDisablePriceSwitch(true)
        if (hasPositive(quantityInputValue)) setIsDisableQuantitySwitch(true)
        if (hasPositive(totalInputValue)) setIsDisableTotalSwitch(true)


        //! price
        if ((!isKnowPrice && isQuantityAndTotalKnowSwitchOn)
            || (isKnowPrice &&
                isQuantityAndTotalKnowSwitchOn &&
                bothHasPositive(quantityInputValue, totalInputValue)
            )) {
            setValue(isKnowPriceId, false)

            if (oneOfIsZero(quantityInputValue, totalInputValue)) {
                setValue(priceInputId, 0)
                setValue(isKnowPriceId, true)
                setIsDisablePriceSwitch(false)
                return
            }
            setIsDisablePriceSwitch(true)
            const calculatedPrice = Number((totalInputValue / quantityInputValue).toFixed(2))

            setValue(priceInputId, calculatedPrice)
            return
        }


        //! quantity

        if ((!isKnowQuantity && isPriceAndTotalKnowSwitchOn)
            || (isKnowQuantity &&
                isPriceAndTotalKnowSwitchOn &&
                bothHasPositive(priceInputValue, totalInputValue)
            )) {
            setValue(isKnowQuantityId, false)

            if (oneOfIsZero(priceInputValue, totalInputValue)) {
                setValue(quantityInputId, 0)
                setValue(isKnowQuantityId, true)
                setIsDisableQuantitySwitch(false)
                return
            }
            setIsDisableQuantitySwitch(true)
            const calculatedQuantity = Number((totalInputValue / priceInputValue).toFixed(2))

            setValue(quantityInputId, calculatedQuantity)
            return
        }

        //! total



        if ((!isKnowTotal && isQuantityAndPriceKnowSwitchOn)
            || (isKnowTotal &&
                isQuantityAndPriceKnowSwitchOn &&
                bothHasPositive(priceInputValue, quantityInputValue)
            )) {
            setValue(isKnowTotalId, false)

            if (oneOfIsZero(priceInputValue, quantityInputValue)) {
                setValue(totalInputId, 0)
                setValue(isKnowTotalId, true)
                setIsDisableTotalSwitch(false)
                return
            }
            setIsDisableTotalSwitch(true)
            const calculatedTotal = Number((quantityInputValue * priceInputValue).toFixed(2))

            setValue(totalInputId, calculatedTotal)
            return
        }




        // if (!isKnowQuantity || (isKnowQuantity && bothHasPositive(priceInputValue, totalInputValue))) {
        //     setValue(isKnowQuantityId, false)

        //     if (oneOfIsZero(priceInputValue, totalInputValue)) {
        //         setValue(quantityInputId, 0)
        //         setValue(isKnowQuantityId, true)
        //         setIsDisableQuantitySwitch(false)
        //     }
        //     setIsDisableQuantitySwitch(true)
        //     const calculatedPrice = Number((totalInputValue / priceInputValue).toFixed(2))

        //     setValue(quantityInputId, calculatedPrice)
        //     return
        // }


    }


    return (
        <div className="flex flex-col items-center gap-2">
            <div className="space-y-2 w-full">
                <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                        <InputField
                            {...field}
                            label="Item name"
                            type="text"
                            placeholder="e.g Tomato"
                            onChange={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name={`items.${index}.itemUnitId`}
                    render={({ field }) => (
                        <SelectInput
                            label="Item Unit"
                            placeholder="Unit"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            items={itemUnits.map(({ id, unit }) => {

                                return {
                                    label: unit,
                                    value: id
                                }
                            })}
                        />
                    )}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                        <div className="relative">
                            <InputField
                                label="Price"
                                type="number"
                                placeholder="e.g. 30"
                                value={field.value}
                                onChange={(e) => {
                                    const newPrice = Number(e.target.valueAsNumber);
                                    field.onChange(isFinite(newPrice) ? newPrice : 0);
                                    setIsDisablePriceSwitch(newPrice > 0);
                                    recalculateValue()
                                }}
                                disabled={pending || !isKnowPrice}
                            />
                            <div className="absolute right-0 -top-1">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.isKnowPrice`}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mr-1"
                                            disabled={pending || isDisablePriceSwitch}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    )
                    }
                />

                <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => {

                        return (
                            <FormItem>
                                <FormLabel className="flex items-center justify-between">
                                    <span>Quantity</span>
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.isKnowQuantity`}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={pending || isDisableQuantitySwitch}
                                            />
                                        )}
                                    />
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value}
                                        onChange={(e) => {
                                            const newQuantity = e.target.valueAsNumber
                                            field.onChange(isFinite(newQuantity) ? newQuantity : 0)
                                            setIsDisableQuantitySwitch(newQuantity > 0)
                                            recalculateValue()
                                        }}
                                        placeholder="e.g. 15"
                                        type="number"
                                        disabled={pending || !isKnowQuantity} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
            </div>


            <FormField
                control={form.control}
                name={`items.${index}.total`}
                render={({ field }) => {

                    return (
                        <FormItem className="w-full">
                            <FormLabel className="flex items-center justify-between">
                                <span>Total</span>
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.isKnowTotal`}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={pending || isDisableTotalSwitch}
                                        />
                                    )}
                                />
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        const newTotal = Number(e.target.value);
                                        field.onChange(isFinite(newTotal) ? newTotal : 0); // ✅ correct update
                                        setIsDisableTotalSwitch(newTotal > 0); // ✅ correct update
                                        recalculateValue()
                                    }}
                                    placeholder="e.g. 15"
                                    type="number"
                                    disabled={pending || !isKnowTotal} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }}
            />
        </div>
    )
}
