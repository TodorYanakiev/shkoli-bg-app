import { useMemo } from "react";

import { useAuthStatus } from "../../../../hooks/useAuthStatus";
import { useUsersByIds } from "../../../../hooks/useUsersByIds";
import type { AppError } from "../../../../types/appError";
import type { CourseResponse } from "../../../../types/courses";
import type {
  LyceumImageResponse,
  LyceumResponse,
} from "../../../../types/lyceums";
import type { UserResponse } from "../../../../types/users";
import { getUserDisplayName } from "../../../../utils/user";
import { useUserProfile } from "../../../Profile/hooks/useUserProfile";
import { useLyceum } from "../../hooks/useLyceum";
import { useLyceumCourses } from "../../hooks/useLyceumCourses";
import { useLyceumImages } from "../../hooks/useLyceumImages";
import { useLyceumLecturers } from "../../hooks/useLyceumLecturers";
import {
  getLyceumLoadError,
  getSectionError,
} from "../services/lyceumDetailErrors";

type UseLyceumDetailDataOptions = {
  lyceumId: number;
  isValidId: boolean;
};

type LyceumDetailData = {
  lyceum?: LyceumResponse;
  courses?: CourseResponse[];
  lecturers?: UserResponse[];
  lyceumImages: LyceumImageResponse[];
  courseLecturersById: Map<number, string>;
  lyceumError: AppError | null;
  coursesError: AppError | null;
  lecturersError: AppError | null;
  lyceumImagesError: AppError | null;
  isLoading: boolean;
  isCoursesLoading: boolean;
  isLecturersLoading: boolean;
  isLyceumImagesLoading: boolean;
  canEditLyceum: boolean;
  canAddCourse: boolean;
  canInviteLecturer: boolean;
};

export const useLyceumDetailData = ({
  lyceumId,
  isValidId,
}: UseLyceumDetailDataOptions): LyceumDetailData => {
  const { isAuthenticated } = useAuthStatus();
  const { data: user } = useUserProfile({ enabled: isAuthenticated });
  const {
    data: lyceum,
    isLoading,
    error: lyceumErrorRaw,
  } = useLyceum(lyceumId, { enabled: isValidId });
  const {
    data: courses,
    isLoading: isCoursesLoading,
    error: coursesErrorRaw,
  } = useLyceumCourses(lyceumId, { enabled: isValidId });
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersErrorRaw,
  } = useLyceumLecturers(lyceumId, { enabled: isValidId });
  const {
    data: lyceumImagesRaw,
    isLoading: isLyceumImagesLoadingRaw,
    error: lyceumImagesErrorRaw,
  } = useLyceumImages(lyceumId, { enabled: isValidId });

  const lecturersById = useMemo(() => {
    if (!lecturers) return new Map<number, string>();
    return new Map(
      lecturers
        .filter((lecturer) => lecturer.id != null)
        .map((lecturer) => [
          lecturer.id as number,
          getUserDisplayName(lecturer),
        ]),
    );
  }, [lecturers]);

  const courseLecturerIds = useMemo(() => {
    if (!courses) return [];
    const ids = courses.flatMap((course) => course.lecturerIds ?? []);
    const validIds = ids.filter((id): id is number => Number.isFinite(id));
    return Array.from(new Set(validIds));
  }, [courses]);

  const missingLecturerIds = useMemo(() => {
    if (courseLecturerIds.length === 0) return [];
    return courseLecturerIds.filter((id) => !lecturersById.has(id));
  }, [courseLecturerIds, lecturersById]);

  const { data: extraLecturers } = useUsersByIds(missingLecturerIds, {
    enabled: isValidId && missingLecturerIds.length > 0,
  });

  const extraLecturersById = useMemo(() => {
    if (!extraLecturers) return new Map<number, string>();
    return new Map(
      extraLecturers
        .filter((lecturer) => lecturer.id != null)
        .map((lecturer) => [
          lecturer.id as number,
          getUserDisplayName(lecturer),
        ]),
    );
  }, [extraLecturers]);

  const courseLecturersById = useMemo(() => {
    const merged = new Map(lecturersById);
    extraLecturersById.forEach((name, id) => {
      if (!merged.has(id)) {
        merged.set(id, name);
      }
    });
    return merged;
  }, [lecturersById, extraLecturersById]);

  const lyceumError = getLyceumLoadError(lyceumErrorRaw ?? null);
  const coursesError = getSectionError(
    coursesErrorRaw ?? null,
    "pages.lyceums.detail.coursesError",
  );
  const lecturersError = getSectionError(
    lecturersErrorRaw ?? null,
    "pages.lyceums.detail.lecturersError",
  );
  const fallbackLyceumImages = lyceum?.images ?? [];
  const lyceumImages = lyceumImagesRaw ?? fallbackLyceumImages;
  const lyceumImagesError =
    lyceumImages.length > 0
      ? null
      : getSectionError(
          lyceumImagesErrorRaw ?? null,
          "pages.lyceums.detail.imagesError",
        );
  const isLyceumImagesLoading =
    isLyceumImagesLoadingRaw && lyceumImages.length === 0;

  const canEditLyceum =
    isValidId &&
    (user?.role === "ADMIN" || user?.administratedLyceumId === lyceumId);
  const isLyceumLecturer = Boolean(
    user?.id != null && lecturers?.some((lecturer) => lecturer.id === user.id),
  );
  const canAddCourse =
    isValidId &&
    (user?.role === "ADMIN" ||
      user?.administratedLyceumId === lyceumId ||
      isLyceumLecturer);
  const canInviteLecturer = canEditLyceum;

  return {
    lyceum,
    courses,
    lecturers,
    lyceumImages,
    courseLecturersById,
    lyceumError,
    coursesError,
    lecturersError,
    lyceumImagesError,
    isLoading,
    isCoursesLoading,
    isLecturersLoading,
    isLyceumImagesLoading,
    canEditLyceum,
    canAddCourse,
    canInviteLecturer,
  };
};
