'use client'

import { Button } from "./ui/button";
import { TextShimmerWave } from "./ui/text-shimmer-wave";

type SubmitButtonProps = {
    pending: boolean;
    pendingStateLabel: string;
    buttonLabel: string;
}
export const SubmitButton = ({
    pending,
    pendingStateLabel,
    buttonLabel
}:SubmitButtonProps) => {
    return (
        <>
            {
                pending ? (
                    <div className="flex items-center justify-center w-full" >
                        <TextShimmerWave className="w-full">{pendingStateLabel}</TextShimmerWave>
                    </div >
                ) :
                    <Button
                        type="submit"
                        className="w-full"
                    >
                       {buttonLabel}
                    </Button>

            }
        </>
    )
}
