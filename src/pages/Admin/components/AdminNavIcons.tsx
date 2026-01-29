type AdminNavIconProps = {
  className?: string
}

export const AdminCoursesIcon = ({ className }: AdminNavIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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
)

export const AdminLyceumsIcon = ({ className }: AdminNavIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 20h16" />
    <path d="M6 20V9l6-4 6 4v11" />
    <path d="M10 20v-5h4v5" />
  </svg>
)

export const AdminUsersIcon = ({ className }: AdminNavIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 12.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5z" />
    <path d="M6 20a6 6 0 0 1 12 0" />
  </svg>
)
