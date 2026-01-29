import { getAllLyceums } from '../../../../services/lyceums'
import type { LyceumResponse } from '../../../../types/lyceums'

export const fetchAdminLyceums = async (): Promise<LyceumResponse[]> =>
  getAllLyceums()
