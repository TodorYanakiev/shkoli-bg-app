import type { LyceumRequest } from "../../../../types/lyceums";
import type { LyceumUpdateFormValues } from "../validations/lyceumUpdateSchema";

export const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const buildLyceumUpdatePayload = (
  values: LyceumUpdateFormValues,
): LyceumRequest => ({
  name: values.name.trim(),
  town: values.town.trim(),
  status: normalizeOptionalText(values.status),
  bulstat: normalizeOptionalText(values.bulstat),
  registrationNumber: normalizeOptionalNumber(values.registrationNumber),
  address: normalizeOptionalText(values.address),
  region: normalizeOptionalText(values.region),
  municipality: normalizeOptionalText(values.municipality),
  latitude: normalizeOptionalNumber(values.latitude),
  longitude: normalizeOptionalNumber(values.longitude),
  phone: normalizeOptionalText(values.phone),
  email: normalizeOptionalText(values.email),
  urlToLibrariesSite: normalizeOptionalText(values.urlToLibrariesSite),
  chitalishtaUrl: normalizeOptionalText(values.chitalishtaUrl),
  chairman: normalizeOptionalText(values.chairman),
  secretary: normalizeOptionalText(values.secretary),
});
