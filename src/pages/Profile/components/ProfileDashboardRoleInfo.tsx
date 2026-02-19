export type ProfileRoleChip = {
  key: 'admin' | 'lecturer'
  label: string
}

type ProfileDashboardRoleInfoProps = {
  roleChips: ProfileRoleChip[]
  subtitleText: string
}

const roleChipClassByKey: Record<ProfileRoleChip['key'], string> = {
  lecturer: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  admin: 'border border-emerald-700/20 bg-emerald-700 text-white',
}

const ProfileDashboardRoleInfo = ({
  roleChips,
  subtitleText,
}: ProfileDashboardRoleInfoProps) => (
  <>
    {roleChips.length > 0 ? (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {roleChips.map((chip) => (
          <span
            key={chip.key}
            className={[
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
              roleChipClassByKey[chip.key],
            ].join(' ')}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M5.5 10.5l2.6 2.6 6.4-6.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {chip.label}
          </span>
        ))}
      </div>
    ) : null}
    <p className="mt-2 break-words text-sm text-slate-500">{subtitleText}</p>
  </>
)

export default ProfileDashboardRoleInfo
