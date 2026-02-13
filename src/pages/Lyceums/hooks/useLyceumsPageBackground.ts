import { useEffect } from 'react'

const LYCEUMS_PAGE_BACKGROUND_CLASS = 'shkoli-page-background'

export const useLyceumsPageBackground = () => {
  useEffect(() => {
    document.body.classList.add(LYCEUMS_PAGE_BACKGROUND_CLASS)

    return () => {
      document.body.classList.remove(LYCEUMS_PAGE_BACKGROUND_CLASS)
    }
  }, [])
}
