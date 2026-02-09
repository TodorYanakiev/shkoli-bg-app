import { useEffect } from 'react'

const SHKOLI_PAGE_BACKGROUND_CLASS = 'shkoli-page-background'

export const useShkoliPageBackground = () => {
  useEffect(() => {
    document.body.classList.add(SHKOLI_PAGE_BACKGROUND_CLASS)

    return () => {
      document.body.classList.remove(SHKOLI_PAGE_BACKGROUND_CLASS)
    }
  }, [])
}
