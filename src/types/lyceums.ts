export type LyceumRightsRequest = {
  lyceumName: string
  town: string
}

export type LyceumRightsVerificationRequest = {
  verificationCode: string
}

export type LyceumLecturerRequest = {
  userId: number
  lyceumId?: number
}

export type LyceumRequest = {
  name: string
  chitalishtaUrl?: string
  status?: string
  bulstat?: string
  chairman?: string
  secretary?: string
  phone?: string
  email?: string
  region?: string
  municipality?: string
  town: string
  address?: string
  urlToLibrariesSite?: string
  registrationNumber?: number
  longitude?: number
  latitude?: number
}

export type LyceumFilterParams = {
  town?: string
  latitude?: number
  longitude?: number
  limit?: number
}

export type LyceumResponse = {
  id?: number
  name?: string
  chitalishtaUrl?: string
  status?: string
  bulstat?: string
  chairman?: string
  secretary?: string
  phone?: string
  email?: string
  region?: string
  municipality?: string
  town?: string
  address?: string
  urlToLibrariesSite?: string
  registrationNumber?: number
  longitude?: number
  latitude?: number
  verificationStatus?: 'VERIFIED' | 'NOT_VERIFIED' | 'PENDING'
}
