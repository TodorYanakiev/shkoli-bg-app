import { createLyceum, getAllLyceums } from '../../../../services/lyceums'
import type { LyceumRequest, LyceumResponse } from '../../../../types/lyceums'

export const fetchAdminLyceums = async (): Promise<LyceumResponse[]> =>
  getAllLyceums()

export const createAdminLyceum = async (
  payload: LyceumRequest,
): Promise<LyceumResponse> => createLyceum(payload)
