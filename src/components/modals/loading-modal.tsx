'use client'
import { Modal } from '../modal'
import { TextShimmerWave, TextShimmerWaveProps } from '../ui/text-shimmer-wave'


type LoadingModalProp = {
    open:boolean
}&TextShimmerWaveProps

export const LoadingModal = (prop:LoadingModalProp) => {

    return (
        <Modal
            open={prop.open}
            onClose={() => {}}
            title=""
            description=''
        >
            <div className="flex items-center justify-center">
                <TextShimmerWave
                    {...prop}
                />
            </div>
        </Modal>
    )
}
