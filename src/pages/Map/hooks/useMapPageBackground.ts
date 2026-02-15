import { useEffect } from 'react'

const MAP_PAGE_BACKGROUND_CLASS = 'map-page-background'

export const useMapPageBackground = () => {
  useEffect(() => {
    document.body.classList.add(MAP_PAGE_BACKGROUND_CLASS)

    return () => {
      document.body.classList.remove(MAP_PAGE_BACKGROUND_CLASS)
    }
  }, [])
}