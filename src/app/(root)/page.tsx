'use client'

import { MODAL_TYPE } from "@/constant";
import { useAppDispatch } from "@/hooks/redux";
import { useModal } from "@/hooks/redux";
import { onOpen } from "@/lib/redux/slice/modal-slice";
import { useEffect } from "react";

export default function Home() {

  const dispatch = useAppDispatch()
  const { isOpen, type } = useModal()

  const open = isOpen && type === MODAL_TYPE.BANK_ACCOUNT

  useEffect(() => {
    if (!open) {
      dispatch(onOpen(MODAL_TYPE.BANK_ACCOUNT))
    }

  }, [open, dispatch])

  return null
}
