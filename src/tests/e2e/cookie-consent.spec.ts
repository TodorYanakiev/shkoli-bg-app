import { expect, test, type Page } from '@playwright/test'

const COOKIE_CONSENT_STORAGE_KEY = 'education-nearby-cookie-consent'
const LANGUAGE_STORAGE_KEY = 'education-nearby-language'

const readStoredCookieConsentPreferences = async (page: Page) =>
  page.evaluate((storageKey) => {
    const storedValue = window.localStorage.getItem(storageKey)
    if (!storedValue) {
      return null
    }

    const parsedValue = JSON.parse(storedValue) as {
      preferences: {
        necessary: boolean
        analytics: boolean
        diagnostics: boolean
      }
    }

    return parsedValue.preferences
  }, COOKIE_CONSENT_STORAGE_KEY)

test.beforeEach(async ({ page }) => {
  await page.addInitScript((languageKey: string) => {
    window.localStorage.setItem(languageKey, 'en')
  }, LANGUAGE_STORAGE_KEY)
})

test('accept all stores consent and keeps settings hidden after reload', async ({
  page,
}) => {
  await page.goto('/')

  const consentDialog = page.getByRole('dialog', { name: 'Cookie settings' })

  await expect(consentDialog).toBeVisible()
  await consentDialog.getByRole('button', { name: 'Accept all' }).click()
  await expect(consentDialog).toBeHidden()

  await expect(await readStoredCookieConsentPreferences(page)).toEqual({
    necessary: true,
    analytics: true,
    diagnostics: true,
  })

  await page.reload()

  await expect(consentDialog).toBeHidden()
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  await expect(consentDialog).toBeVisible()
})

test('reject unnecessary keeps analytics and diagnostics disabled and sets opt-out cookie', async ({
  page,
}) => {
  await page.goto('/')

  const consentDialog = page.getByRole('dialog', { name: 'Cookie settings' })

  await expect(consentDialog).toBeVisible()
  await consentDialog.getByRole('button', { name: 'Reject unnecessary' }).click()
  await expect(consentDialog).toBeHidden()

  await expect(await readStoredCookieConsentPreferences(page)).toEqual({
    necessary: true,
    analytics: false,
    diagnostics: false,
  })

  const cookies = await page.context().cookies()
  expect(cookies.some(({ name }) => name === '_cs_optout')).toBe(true)
})
