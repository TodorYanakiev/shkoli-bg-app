import { useCallback, useMemo, useState } from 'react'

import type { UserResponse } from '../../../../types/users'

type LyceumLecturerReviewsModalState = {
  isOpen: boolean
  selectedLecturer: UserResponse | null
  openModal: (lecturer: UserResponse) => void
  closeModal: () => void
}

export const useLyceumLecturerReviewsModal = (): LyceumLecturerReviewsModalState => {
  const [selectedLecturer, setSelectedLecturer] = useState<UserResponse | null>(
    null,
  )

  const openModal = useCallback((lecturer: UserResponse) => {
    setSelectedLecturer(lecturer)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedLecturer(null)
  }, [])

  return useMemo(
    () => ({
      isOpen: selectedLecturer != null,
      selectedLecturer,
      openModal,
      closeModal,
    }),
    [closeModal, openModal, selectedLecturer],
  )
}
