'use client'
import { Modal } from "./modal";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { TextShimmerWave } from "./ui/text-shimmer-wave";

type AlertModalProps = {
    title: string;
    description: string;
    open: boolean;
    disabled?: boolean
    onCancel: () => void;
    onConfirm: () => void;
    cancelBtnLabel?: string;
    confirmBtnLabel?: string;
    pending?: boolean
}

export const AlertModal = ({
    open,
    title,
    description,
    onCancel,
    onConfirm,
    disabled,
    cancelBtnLabel,
    confirmBtnLabel,
    pending
}: AlertModalProps
) => {

    return (
        <Modal
            title={title}
            description={description}
            open={open}
            onClose={onCancel}

        >
            <DialogFooter className="flex flex-row items-center justify-end gap-4">

                {
                    pending ? (
                        <div className="flex items-center justify-center w-full">
                            <TextShimmerWave className="w-full">
                                Processing...
                            </TextShimmerWave>
                        </div>
                    ) : (
                        <>
                            <Button
                                type="button"
                                onClick={onCancel}
                                variant={'secondary'}
                                disabled={disabled}
                            >
                                {cancelBtnLabel || 'Cancel'}
                            </Button>
                            <Button
                                type="button"
                                onClick={onConfirm}
                                variant={'destructive'}
                                disabled={disabled}
                            >
                                {confirmBtnLabel || "Continue"}
                            </Button>
                        </>
                    )
                }
            </DialogFooter>
        </Modal>
    )
}