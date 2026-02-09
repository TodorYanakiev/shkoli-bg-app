import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const CONTENTSQUARE_SCRIPT_ID = 'contentsquare-uxa-script'
const CONTENTSQUARE_SCRIPT_SRC =
  'https://t.contentsquare.net/uxa/d3c813633efbc.js'

type ContentsquareCommand = ['trackPageview', string]
type ContentsquareQueue = ContentsquareCommand[]

type WindowWithContentsquare = Window & {
  _uxa?: ContentsquareQueue
}

const getContentsquareQueue = (): ContentsquareQueue => {
  const contentsquareWindow = window as WindowWithContentsquare

  if (!Array.isArray(contentsquareWindow._uxa)) {
    contentsquareWindow._uxa = []
  }

  return contentsquareWindow._uxa
}

export const useContentsquareTracking = () => {
  const location = useLocation()

  useEffect(() => {
    getContentsquareQueue()

    if (document.getElementById(CONTENTSQUARE_SCRIPT_ID)) {
      return
    }

    const scriptElement = document.createElement('script')
    scriptElement.id = CONTENTSQUARE_SCRIPT_ID
    scriptElement.src = CONTENTSQUARE_SCRIPT_SRC
    scriptElement.async = true

    document.head.append(scriptElement)
  }, [])

  useEffect(() => {
    const queue = getContentsquareQueue()
    const pagePath = `${location.pathname}${location.search}${location.hash}`

    queue.push(['trackPageview', pagePath])
  }, [location.pathname, location.search, location.hash])
}
