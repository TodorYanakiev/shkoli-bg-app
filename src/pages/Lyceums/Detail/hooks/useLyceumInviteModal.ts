import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type UseLyceumInviteModalOptions = {
  canInviteLecturer: boolean
}

type LyceumInviteModalState = {
  inviteModalId: string
  isInviteModalOpen: boolean
  openInviteModal: () => void
  closeInviteModal: () => void
}

const INVITE_MODAL_ID = 'lyceum-invite-lecturer-modal'

export const useLyceumInviteModal = ({
  canInviteLecturer,
}: UseLyceumInviteModalOptions): LyceumInviteModalState => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const shouldOpenInviteModal = searchParams.get('inviteLecturer') === '1'

  useEffect(() => {
    if (shouldOpenInviteModal && canInviteLecturer) {
      setIsInviteModalOpen(true)
    }
  }, [shouldOpenInviteModal, canInviteLecturer])

  const clearInviteParam = useCallback(() => {
    if (!searchParams.has('inviteLecturer')) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('inviteLecturer')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const closeInviteModal = useCallback(() => {
    setIsInviteModalOpen(false)
    clearInviteParam()
  }, [clearInviteParam])

  const openInviteModal = useCallback(() => {
    setIsInviteModalOpen(true)
  }, [])

  return {
    inviteModalId: INVITE_MODAL_ID,
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
  }
}
