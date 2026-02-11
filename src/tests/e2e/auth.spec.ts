import { expect, test, type Page, type Route } from '@playwright/test'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
}

const COOKIE_CONSENT_STORAGE_KEY = 'education-nearby-cookie-consent'

const mockCookieConsentSelection = async (page: Page) => {
  await page.addInitScript((storageKey: string) => {
    const consentRecord = {
      version: 1,
      updatedAt: new Date().toISOString(),
      source: 'rejectOptional',
      preferences: {
        necessary: true,
        analytics: false,
        diagnostics: false,
      },
    }

    window.localStorage.setItem(storageKey, JSON.stringify(consentRecord))
  }, COOKIE_CONSENT_STORAGE_KEY)
}

const mockJsonEndpoint = async (
  page: Page,
  url: string,
  body: unknown,
  status = 200,
) => {
  await page.route(url, async (route: Route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders })
      return
    }

    await route.fulfill({
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  })
}

test('user can log in and reach the profile page', async ({ page }) => {
  await mockCookieConsentSelection(page)
  await mockJsonEndpoint(page, '**/api/v1/auth/authenticate', {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
  })
  await mockJsonEndpoint(page, '**/api/v1/users/me', {
    firstname: 'Tina',
    lastname: 'Petrova',
    username: 'tpetrova',
    email: 'tina@example.com',
    role: 'USER',
  })

  await page.goto('/auth/login')

  await page.getByTestId('login-email').fill('tina@example.com')
  await page.getByTestId('login-password').fill('password123')
  await page.getByTestId('login-submit').click()

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const tokens = await page.evaluate(() => ({
    access: window.localStorage.getItem('auth.accessToken'),
    refresh: window.localStorage.getItem('auth.refreshToken'),
  }))

  expect(tokens.access).toBe('access-token')
  expect(tokens.refresh).toBe('refresh-token')
})

test('user can register and reach the profile page', async ({ page }) => {
  await mockCookieConsentSelection(page)
  await mockJsonEndpoint(page, '**/api/v1/auth/register', {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
  })
  await mockJsonEndpoint(page, '**/api/v1/users/me', {
    firstname: 'Mila',
    lastname: 'Ivanova',
    username: 'mivanova',
    email: 'mila@example.com',
    role: 'USER',
  })

  await page.goto('/auth/register')

  await page.getByTestId('register-firstname').fill('Mila')
  await page.getByTestId('register-lastname').fill('Ivanova')
  await page.getByTestId('register-username').fill('mivanova')
  await page.getByTestId('register-email').fill('mila@example.com')
  await page.getByTestId('register-password').fill('password123')
  await page.getByTestId('register-password-repeat').fill('password123')
  await page.getByTestId('register-accept-legal-documents').check()
  await page.getByTestId('register-submit').click()

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const tokens = await page.evaluate(() => ({
    access: window.localStorage.getItem('auth.accessToken'),
    refresh: window.localStorage.getItem('auth.refreshToken'),
  }))

  expect(tokens.access).toBe('access-token')
  expect(tokens.refresh).toBe('refresh-token')
})
