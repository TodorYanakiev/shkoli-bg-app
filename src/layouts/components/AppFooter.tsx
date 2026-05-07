import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'
import CookieConsentBanner from '../../components/feedback/CookieConsentBanner'
import { CONTACT_EMAIL } from '../../constants/contact'
import { useLocalizedPath } from '../../hooks/useLocalizedPath'

const footerLinkClassName =
  'inline-flex items-center justify-start text-left text-sm font-medium leading-6 text-slate-700 transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:text-brand-dark'
const footerSectionClassName = 'border-l border-slate-200/80 pl-5 sm:pl-6'
const footerSectionHeadingClassName =
  'mb-3 text-sm font-semibold leading-5 text-slate-900'
const footerSocialLinkClassName =
  'inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand/70 transition-colors hover:bg-brand/25 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2'

const socialLinks = [
  {
    href: 'https://www.youtube.com/@shkolibg',
    labelKey: 'youtube',
    path: 'M22 12c0 2.2-.1 3.7-.3 4.6-.2 1-.9 1.8-1.8 2-1.5.4-7.9.4-7.9.4s-6.4 0-7.9-.4c-.9-.2-1.6-1-1.8-2C2.1 15.7 2 14.2 2 12s.1-3.7.3-4.6c.2-1 .9-1.8 1.8-2C5.6 5 12 5 12 5s6.4 0 7.9.4c.9.2 1.6 1 1.8 2 .2.9.3 2.4.3 4.6Zm-7.2 0-5.3-3.1v6.2L14.8 12Z',
  },
  {
    href: 'https://www.facebook.com/shkoli.bg',
    labelKey: 'facebook',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
  {
    href: 'https://www.instagram.com/shkoli_bg?igsh=bzR3Zm56ODhhcHlx',
    labelKey: 'instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.8.5.8.3 1.5.7 2.1 1.4.7.6 1.1 1.3 1.4 2.1.3.8.4 1.6.5 2.8.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.5 2.8-.3.8-.7 1.5-1.4 2.1-.6.7-1.3 1.1-2.1 1.4-.8.3-1.6.4-2.8.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.8-.5a5.8 5.8 0 0 1-2.1-1.4 5.8 5.8 0 0 1-1.4-2.1c-.3-.8-.4-1.6-.5-2.8C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .5-2.8.3-.8.7-1.5 1.4-2.1.6-.7 1.3-1.1 2.1-1.4.8-.3 1.6-.4 2.8-.5 1.3-.1 1.7-.1 4.9-.1Zm0 2.2c-3.1 0-3.5 0-4.8.1-1 .1-1.5.2-1.9.3-.6.2-1 .4-1.4.8-.4.4-.6.8-.8 1.4-.1.4-.2.9-.3 1.9-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1 .2 1.5.3 1.9.2.6.4 1 .8 1.4.4.4.8.6 1.4.8.4.1.9.2 1.9.3 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1-.1 1.5-.2 1.9-.3.6-.2 1-.4 1.4-.8.4-.4.6-.8.8-1.4.1-.4.2-.9.3-1.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1-.2-1.5-.3-1.9-.2-.6-.4-1-.8-1.4-.4-.4-.8-.6-1.4-.8-.4-.1-.9-.2-1.9-.3-1.3-.1-1.7-.1-4.8-.1Zm0 3.7a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Zm0 5.6a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm5-5.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  },
  {
    href: 'https://www.tiktok.com/@shkoli.bg?is_from_webapp=1&sender_device=pc',
    labelKey: 'tiktok',
    path: 'M14.7 3c.2 1 .7 1.8 1.4 2.4.7.6 1.7 1 2.6 1.1v2.8a7.4 7.4 0 0 1-4-1.1v6.1a5.3 5.3 0 1 1-4.5-5.2v2.9a2.4 2.4 0 1 0 1.6 2.3V3h2.9Z',
  },
] as const

const AppFooter = () => {
  const { t } = useTranslation()
  const localizedPath = useLocalizedPath()
  const currentYear = new Date().getFullYear()
  const scrollToPageTop = () => {
    if (typeof window === 'undefined') {
      return
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }

  return (
    <footer
      className="mt-auto border-t border-slate-200 bg-[radial-gradient(120%_80%_at_10%_0%,rgba(214,236,226,0.42),rgba(255,255,255,0)_58%),radial-gradient(120%_90%_at_90%_0%,rgba(224,241,232,0.36),rgba(255,255,255,0)_60%),linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(247,251,249,1)_100%)]"
    >
      <div className="w-full px-4 py-7 sm:px-6 sm:py-8 lg:pr-12 lg:pl-[calc(3rem+var(--page-sidebar-offset,0px))]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
          <div className="space-y-4">
            <Link
              to={localizedPath('/shkoli')}
              className="inline-flex items-center gap-3"
              aria-label={t('app.title')}
              onClick={scrollToPageTop}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20">
                <img
                  src={logo}
                  alt={t('app.logoAlt')}
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                  decoding="async"
                  width={28}
                  height={28}
                />
              </span>
              <span className="text-xl font-semibold leading-none text-brand sm:text-2xl">
                {t('app.title')}
              </span>
            </Link>
            <p className="max-w-2xl text-sm font-medium leading-6 text-slate-700 sm:text-base">
              {t('layouts.app.footer.description')}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            <nav
              aria-label={t('layouts.app.footer.linksLabel')}
              className={footerSectionClassName}
            >
              <p className={footerSectionHeadingClassName}>
                {t('layouts.app.footer.exploreTitle')}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to={localizedPath('/shkoli')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('nav.shkoli')}
                </Link>
                <Link
                  to={localizedPath('/lyceums')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('nav.lyceums')}
                </Link>
                <Link
                  to={localizedPath('/map')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('nav.map')}
                </Link>
              </div>
            </nav>
            <nav
              aria-label={t('layouts.app.footer.legalLabel')}
              className={footerSectionClassName}
            >
              <p className={footerSectionHeadingClassName}>
                {t('layouts.app.footer.legalTitle')}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to={localizedPath('/privacy-policy')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('layouts.app.footer.privacyPolicy')}
                </Link>
                <Link
                  to={localizedPath('/cookies')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('layouts.app.footer.cookiesPolicy')}
                </Link>
                <Link
                  to={localizedPath('/terms-and-conditions')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('layouts.app.footer.termsAndConditions')}
                </Link>
                <CookieConsentBanner triggerClassName={footerLinkClassName} />
              </div>
            </nav>
            <section
              aria-labelledby="footer-contacts-title"
              className={footerSectionClassName}
            >
              <p
                id="footer-contacts-title"
                className={footerSectionHeadingClassName}
              >
                {t('layouts.app.footer.contactsTitle')}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={footerLinkClassName}
                >
                  {t('layouts.app.footer.contact', { email: CONTACT_EMAIL })}
                </a>
                <Link
                  to={localizedPath('/help')}
                  className={footerLinkClassName}
                  onClick={scrollToPageTop}
                >
                  {t('layouts.app.footer.contactHelp')}
                </Link>
                <div
                  role="group"
                  className="flex items-center gap-2 pt-1"
                  aria-label={t('layouts.app.footer.socialsLabel')}
                >
                  {socialLinks.map(({ href, labelKey, path }) => (
                    <a
                      key={labelKey}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`layouts.app.footer.socials.${labelKey}`)}
                      className={footerSocialLinkClassName}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                        <path d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="mt-7 border-t border-slate-200/80 pt-4 sm:pt-5">
          <p className="text-xs text-slate-500 sm:text-sm">
            {`\u00A9 ${currentYear} ${t('app.title')}. ${t('layouts.app.footer.notice')}`}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter
