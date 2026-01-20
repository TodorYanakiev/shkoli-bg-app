import { useMutation } from '@tanstack/react-query'

import { inviteLyceumLecturer } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumLecturerInviteRequest } from '../../../types/lyceums'

type InviteLyceumLecturerPayload = LyceumLecturerInviteRequest

export const inviteLyceumLecturerMutationKey = [
  'lyceums',
  'lecturers',
  'invite',
] as const

export const useInviteLyceumLecturerMutation = () =>
  useMutation<void, ApiError, InviteLyceumLecturerPayload>({
    mutationKey: inviteLyceumLecturerMutationKey,
    mutationFn: (payload) => inviteLyceumLecturer(payload),
    retry: false,
  })
