import httpClient from "./httpClient";
import type { CourseResponse } from "../types/courses";
import type {
  LyceumFilterParams,
  LyceumImageRequest,
  LyceumImageResponse,
  LyceumLecturerInviteRequest,
  LyceumRequest,
  LyceumRightsRequest,
  LyceumRightsVerificationRequest,
  LyceumResponse,
} from "../types/lyceums";
import type { UserResponse } from "../types/users";

export const requestLyceumRights = async (payload: LyceumRightsRequest) => {
  const response = await httpClient.post<string>(
    "/api/v1/lyceums/request-rights",
    payload,
  );
  return response.data;
};

export const verifyLyceumRights = async (
  payload: LyceumRightsVerificationRequest,
) => {
  const response = await httpClient.post<string>(
    "/api/v1/lyceums/verify-rights",
    payload,
  );
  return response.data;
};

export const getAllLyceums = async () => {
  const response = await httpClient.get<LyceumResponse[]>("/api/v1/lyceums");
  return response.data;
};

export const createLyceum = async (payload: LyceumRequest) => {
  const response = await httpClient.post<LyceumResponse>(
    "/api/v1/lyceums",
    payload,
  );
  return response.data;
};

export const getLyceumById = async (id: number) => {
  const response = await httpClient.get<LyceumResponse>(
    `/api/v1/lyceums/${id}`,
  );
  return response.data;
};

export const updateLyceum = async (id: number, payload: LyceumRequest) => {
  const response = await httpClient.put<LyceumResponse>(
    `/api/v1/lyceums/${id}`,
    payload,
  );
  return response.data;
};

export const deleteLyceum = async (id: number) => {
  await httpClient.delete(`/api/v1/lyceums/${id}`);
};

export const getLyceumAdmins = async (lyceumId: number) => {
  const response = await httpClient.get<UserResponse[]>(
    `/api/v1/lyceums/${lyceumId}/admins`,
  );
  return response.data;
};

export const assignLyceumAdministrator = async (
  lyceumId: number,
  userId: number,
) => {
  await httpClient.put(`/api/v1/lyceums/${lyceumId}/administrators/${userId}`);
};

export const removeLyceumAdministrator = async (
  lyceumId: number,
  userId: number,
) => {
  await httpClient.delete(
    `/api/v1/lyceums/${lyceumId}/administrators/${userId}`,
  );
};

export const filterLyceums = async (params: LyceumFilterParams) => {
  const response = await httpClient.get<LyceumResponse[]>(
    "/api/v1/lyceums/filter",
    { params },
  );
  return response.data;
};

export const getLyceumsByTown = async (town: string) => {
  const response = await httpClient.get<LyceumResponse[]>(
    "/api/v1/lyceums/by-town",
    { params: { town } },
  );
  return response.data;
};

export const getLyceumCourses = async (lyceumId: number) => {
  const response = await httpClient.get<CourseResponse[]>(
    `/api/v1/lyceums/${lyceumId}/courses`,
  );
  return response.data;
};

export const getLyceumLecturers = async (lyceumId: number) => {
  const response = await httpClient.get<UserResponse[]>(
    `/api/v1/lyceums/${lyceumId}/lecturers`,
  );
  return response.data;
};

export const registerLyceumImage = async (
  lyceumId: number,
  payload: LyceumImageRequest,
) => {
  const response = await httpClient.post<LyceumImageResponse>(
    `/api/v1/lyceums/${lyceumId}/images`,
    payload,
  );
  return response.data;
};

export const getLyceumImages = async (lyceumId: number) => {
  const response = await httpClient.get<LyceumImageResponse[]>(
    `/api/v1/lyceums/${lyceumId}/images`,
  );
  return response.data;
};

export const deleteLyceumImage = async (lyceumId: number, imageId: number) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/images/${imageId}`);
};

export const inviteLyceumLecturer = async (
  payload: LyceumLecturerInviteRequest,
) => {
  await httpClient.post("/api/v1/lyceums/lecturers/invite", payload);
};

export const removeLyceumLecturer = async (
  lyceumId: number,
  userId: number,
) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/lecturers/${userId}`);
};
