import { expect, test, type Page, type Route } from '@playwright/test'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
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

test('user can log in and reach the courses page', async ({ page }) => {
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

  await page.getByLabel('Email address').fill('tina@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByRole('button', { name: 'Log in' }).click()

  await expect(page).toHaveURL(/\/shkoli$/)
  await expect(
    page.getByRole('heading', { name: 'Courses', level: 1 }),
  ).toBeVisible()

  const tokens = await page.evaluate(() => ({
    access: window.localStorage.getItem('auth.accessToken'),
    refresh: window.localStorage.getItem('auth.refreshToken'),
  }))

  expect(tokens.access).toBe('access-token')
  expect(tokens.refresh).toBe('refresh-token')
})

test('user can register and reach the courses page', async ({ page }) => {
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

  await page.getByLabel('First name').fill('Mila')
  await page.getByLabel('Last name').fill('Ivanova')
  await page.getByLabel('Username').fill('mivanova')
  await page.getByLabel('Email address').fill('mila@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByLabel('Confirm password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/shkoli$/)
  await expect(
    page.getByRole('heading', { name: 'Courses', level: 1 }),
  ).toBeVisible()

  const tokens = await page.evaluate(() => ({
    access: window.localStorage.getItem('auth.accessToken'),
    refresh: window.localStorage.getItem('auth.refreshToken'),
  }))

  expect(tokens.access).toBe('access-token')
  expect(tokens.refresh).toBe('refresh-token')
})
