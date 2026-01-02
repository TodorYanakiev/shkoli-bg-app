import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Courses', level: 1 })
  ).toBeVisible()
})

test('home page has no detectable a11y violations', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()

  expect(results.violations).toEqual([])
})
