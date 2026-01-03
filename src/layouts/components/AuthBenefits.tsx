import { useTranslation } from 'react-i18next'

const AuthBenefits = () => {
  const { t } = useTranslation()

  return (
    <aside className="hidden lg:block">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">
          {t('layouts.auth.benefits.kicker')}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          {t('layouts.auth.benefits.title')}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {t('layouts.auth.benefits.subtitle')}
        </p>
        <div className="mt-5 space-y-4">
          <div className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand/80" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t('layouts.auth.benefits.items.save.title')}
              </p>
              <p className="text-xs text-slate-600">
                {t('layouts.auth.benefits.items.save.description')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand/80" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t('layouts.auth.benefits.items.compare.title')}
              </p>
              <p className="text-xs text-slate-600">
                {t('layouts.auth.benefits.items.compare.description')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand/80" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t('layouts.auth.benefits.items.manage.title')}
              </p>
              <p className="text-xs text-slate-600">
                {t('layouts.auth.benefits.items.manage.description')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
            {t('layouts.auth.benefits.badges.secure')}
          </span>
          <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
            {t('layouts.auth.benefits.badges.noSpam')}
          </span>
          <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
            {t('layouts.auth.benefits.badges.local')}
          </span>
        </div>
      </div>
    </aside>
  )
}

export default AuthBenefits
