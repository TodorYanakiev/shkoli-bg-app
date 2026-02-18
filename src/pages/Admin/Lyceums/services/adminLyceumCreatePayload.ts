import type { LyceumRequest } from '../../../../types/lyceums'
import type { AdminLyceumCreateFormValues } from '../validations/adminLyceumCreateSchema'

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const normalizeOptionalNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const buildAdminLyceumCreatePayload = (
  values: AdminLyceumCreateFormValues,
): LyceumRequest => ({
  name: values.name.trim(),
  chitalishtaUrl: normalizeOptionalText(values.chitalishtaUrl),
  status: normalizeOptionalText(values.status),
  bulstat: normalizeOptionalText(values.bulstat),
  chairman: normalizeOptionalText(values.chairman),
  secretary: normalizeOptionalText(values.secretary),
  phone: normalizeOptionalText(values.phone),
  email: normalizeOptionalText(values.email),
  region: normalizeOptionalText(values.region),
  municipality: normalizeOptionalText(values.municipality),
  town: values.town.trim(),
  address: normalizeOptionalText(values.address),
  urlToLibrariesSite: normalizeOptionalText(values.urlToLibrariesSite),
  registrationNumber: normalizeOptionalNumber(values.registrationNumber),
  longitude: normalizeOptionalNumber(values.longitude),
  latitude: normalizeOptionalNumber(values.latitude),
})
