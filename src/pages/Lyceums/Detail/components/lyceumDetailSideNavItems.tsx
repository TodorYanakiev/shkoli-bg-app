import type { TFunction } from "i18next";

import type { SideNavItem } from "../types";

type LyceumDetailSideNavItemsOptions = {
  t: TFunction;
  lyceumId: number;
  canAddCourse: boolean;
  canInviteLecturer: boolean;
  canEditLyceum: boolean;
  canViewSubscribers: boolean;
  navIconClassName: string;
  inviteModalId: string;
  subscribersModalId: string;
  onInviteLecturer: () => void;
  onOpenSubscribers: () => void;
};

export const getLyceumDetailSideNavItems = ({
  t,
  lyceumId,
  canAddCourse,
  canInviteLecturer,
  canEditLyceum,
  canViewSubscribers,
  navIconClassName,
  inviteModalId,
  subscribersModalId,
  onInviteLecturer,
  onOpenSubscribers,
}: LyceumDetailSideNavItemsOptions): SideNavItem[] => {
  const baseSideNavItems: SideNavItem[] = [
    {
      key: "lyceum-overview",
      label: t("pages.lyceums.detail.sideNav.info"),
      href: "#lyceum-overview",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10.5v5" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: "lyceum-courses",
      label: t("pages.lyceums.detail.sideNav.courses"),
      href: "#lyceum-courses",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 6.5h11" />
          <path d="M8 12h11" />
          <path d="M8 17.5h11" />
          <circle cx="5" cy="6.5" r="1.2" />
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="5" cy="17.5" r="1.2" />
        </svg>
      ),
    },
    {
      key: "lyceum-gallery",
      label: t("pages.lyceums.detail.sideNav.gallery"),
      href: "#lyceum-gallery",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M7 16l4-4 2.5 2.5 3-3L20 15" />
        </svg>
      ),
    },
    {
      key: "lyceum-lecturers",
      label: t("pages.lyceums.detail.sideNav.lecturers"),
      href: "#lyceum-lecturers",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 12.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 12.5z" />
          <path d="M4 19.5a4 4 0 0 1 8 0" />
          <path d="M17 12a3 3 0 1 0-2.6-4.5" />
          <path d="M14.5 18.5a3.5 3.5 0 0 1 5.5 1" />
        </svg>
      ),
    },
    {
      key: "lyceum-reviews",
      label: t("pages.lyceums.detail.sideNav.reviews"),
      href: "#lyceum-reviews",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5.5h16v10H8l-4 4v-14z" />
          <path d="M9 9.5h6" />
          <path d="M9 12.5h4" />
        </svg>
      ),
    },
  ];

  return [
    ...baseSideNavItems,
    ...(canAddCourse
      ? [
          {
            key: "lyceum-add-course",
            label: t("pages.lyceums.detail.sideNav.addCourse"),
            to: `/shkoli/new?lyceumId=${lyceumId}`,
            icon: (
              <svg
                viewBox="0 0 24 24"
                className={navIconClassName}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            ),
          },
        ]
      : []),
    ...(canInviteLecturer
      ? [
          {
            key: "lyceum-add-lecturer",
            label: t("pages.lyceums.detail.sideNav.addLecturer"),
            onClick: onInviteLecturer,
            controlsId: inviteModalId,
            icon: (
              <svg
                viewBox="0 0 24 24"
                className={navIconClassName}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 12.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 12.5z" />
                <path d="M4 19.5a4 4 0 0 1 8 0" />
                <path d="M18 8v6" />
                <path d="M15 11h6" />
              </svg>
            ),
          },
        ]
      : []),
    ...(canViewSubscribers
      ? [
          {
            key: "lyceum-subscribers",
            label: t("pages.lyceums.detail.actions.viewSubscribers"),
            onClick: onOpenSubscribers,
            controlsId: subscribersModalId,
            icon: (
              <svg
                viewBox="0 0 24 24"
                className={navIconClassName}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 12.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 12.5z" />
                <path d="M4 19.5a4 4 0 0 1 8 0" />
                <path d="M17 12a3 3 0 1 0-2.6-4.5" />
                <path d="M14.5 18.5a3.5 3.5 0 0 1 5.5 1" />
              </svg>
            ),
          },
        ]
      : []),
    ...(canEditLyceum
      ? [
          {
            key: "lyceum-edit",
            label: t("pages.lyceums.detail.editCta"),
            to: `/lyceums/${lyceumId}/edit`,
            icon: (
              <svg
                viewBox="0 0 24 24"
                className={navIconClassName}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 16.5V20h3.5L19 8.5l-3.5-3.5L4 16.5z" />
                <path d="M13.5 6.5L17 10" />
              </svg>
            ),
          },
        ]
      : []),
  ];
};
