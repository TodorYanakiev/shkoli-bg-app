import { existsSync, readdirSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'

const DIST_ASSETS_DIR = resolve(process.cwd(), 'dist', 'assets')

type BudgetResult = {
  label: string
  actual: number
  budget: number
}

const formatBytes = (value: number) => {
  if (value < 1024) {
    return `${value} B`
  }

  return `${(value / 1024).toFixed(1)} KB`
}

const run = () => {
  if (!existsSync(DIST_ASSETS_DIR)) {
    throw new Error('dist/assets does not exist. Run build before perf:budget.')
  }

  const assetFiles = readdirSync(DIST_ASSETS_DIR)

  const jsSizes: number[] = []
  const cssSizes: number[] = []
  const imageSizes: number[] = []

  for (const assetFile of assetFiles) {
    const fullPath = resolve(DIST_ASSETS_DIR, assetFile)
    const fileStats = statSync(fullPath)

    if (!fileStats.isFile()) {
      continue
    }

    const extension = extname(assetFile).toLowerCase()

    if (extension === '.js') {
      jsSizes.push(fileStats.size)
      continue
    }

    if (extension === '.css') {
      cssSizes.push(fileStats.size)
      continue
    }

    if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg'].includes(extension)) {
      imageSizes.push(fileStats.size)
    }
  }

  const totalJsBytes = jsSizes.reduce((sum, value) => sum + value, 0)
  const largestJsBytes = jsSizes.length > 0 ? Math.max(...jsSizes) : 0
  const totalCssBytes = cssSizes.reduce((sum, value) => sum + value, 0)
  const totalImageBytes = imageSizes.reduce((sum, value) => sum + value, 0)
  const largestImageBytes = imageSizes.length > 0 ? Math.max(...imageSizes) : 0

  const budgets: BudgetResult[] = [
    {
      label: 'Largest JS chunk',
      actual: largestJsBytes,
      budget: 900 * 1024,
    },
    {
      label: 'Total JS bytes',
      actual: totalJsBytes,
      budget: 2400 * 1024,
    },
    {
      label: 'Total CSS bytes',
      actual: totalCssBytes,
      budget: 220 * 1024,
    },
    {
      label: 'Total image bytes',
      actual: totalImageBytes,
      budget: 900 * 1024,
    },
    {
      label: 'Largest image asset',
      actual: largestImageBytes,
      budget: 300 * 1024,
    },
  ]

  const failures = budgets.filter((result) => result.actual > result.budget)

  console.log('[perf:budget] Asset size summary:')
  for (const result of budgets) {
    const status = result.actual > result.budget ? 'FAIL' : 'PASS'
    console.log(
      `- ${status} ${result.label}: ${formatBytes(result.actual)} (budget ${formatBytes(result.budget)})`,
    )
  }

  if (failures.length > 0) {
    throw new Error(
      `[perf:budget] ${failures.length} budget(s) exceeded.`,
    )
  }
}

run()
