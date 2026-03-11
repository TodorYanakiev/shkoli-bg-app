export type LyceumRightsRequest = {
  lyceumName: string;
  town: string;
};

export type LyceumRightsVerificationRequest = {
  verificationCode: string;
};

export type LyceumLecturerInviteRequest = {
  email: string;
  lyceumId?: number;
};

export type LyceumRequest = {
  name: string;
  chitalishtaUrl?: string;
  status?: string;
  bulstat?: string;
  chairman?: string;
  secretary?: string;
  phone?: string;
  email?: string;
  region?: string;
  municipality?: string;
  town: string;
  address?: string;
  urlToLibrariesSite?: string;
  registrationNumber?: number;
  longitude?: number;
  latitude?: number;
};

export type LyceumFilterParams = {
  town?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
};

export type LyceumImageRole = "LOGO" | "MAIN" | "GALLERY";

export type LyceumImageResponse = {
  id?: number;
  lyceumId?: number;
  s3Key?: string;
  url?: string;
  role?: LyceumImageRole;
  altText?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  orderIndex?: number;
};

export type LyceumImageRequest = {
  s3Key?: string;
  url?: string;
  role: LyceumImageRole;
  altText?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  orderIndex?: number;
};

export type LyceumResponse = {
  id?: number;
  name?: string;
  chitalishtaUrl?: string;
  status?: string;
  bulstat?: string;
  chairman?: string;
  secretary?: string;
  phone?: string;
  email?: string;
  region?: string;
  municipality?: string;
  town?: string;
  address?: string;
  urlToLibrariesSite?: string;
  registrationNumber?: number;
  coursesCount?: number;
  longitude?: number;
  latitude?: number;
  mainImage?: LyceumImageResponse;
  verificationStatus?: "VERIFIED" | "NOT_VERIFIED" | "PENDING";
  averageRating?: number;
};
