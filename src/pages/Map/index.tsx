import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MapExplorerLayout from './components/MapExplorerLayout'
import MapExplorerMap from './components/MapExplorerMap'
import MapExplorerPanel from './components/MapExplorerPanel'
import { useMapExplorerData } from './hooks/useMapExplorerData'
import { useMapExplorerFilters } from './hooks/useMapExplorerFilters'
import { useMapPageBackground } from './hooks/useMapPageBackground'
import { useCourseFilterForm } from '../Shkoli/hooks/useCourseFilterForm'

const MapPage = () => {
  const { t, i18n } = useTranslation()
  const {
    state,
    search,
    courseFormDefaults,
    lyceumQuery,
    courseQuery,
    applyFilters,
    clearFilters,
  } = useMapExplorerFilters()

  const form = useCourseFilterForm({
    t,
    defaultValues: courseFormDefaults,
  })
  const [searchValue, setSearchValue] = useState(search)
  const [selectedLyceumId, setSelectedLyceumId] = useState<number | null>(null)
  const [hoveredLyceumId, setHoveredLyceumId] = useState<number | null>(null)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  useMapPageBackground()

  const { items, summary, isLoading, isFetching, error } = useMapExplorerData({
    state,
    lyceumQuery,
    courseQuery,
    locale: i18n.language,
  })

  useEffect(() => {
    if (!selectedLyceumId) return

    const exists = items.some((item) => item.lyceumId === selectedLyceumId)
    if (!exists) {
      setSelectedLyceumId(null)
    }
  }, [items, selectedLyceumId])

  useEffect(() => {
    if (!hoveredLyceumId) return

    const exists = items.some((item) => item.lyceumId === hoveredLyceumId)
    if (!exists) {
      setHoveredLyceumId(null)
    }
  }, [items, hoveredLyceumId])

  useEffect(() => {
    setSearchValue(search)
  }, [search])

  const onSubmit = form.handleSubmit((values) => {
    applyFilters(values, searchValue)
    setIsMobilePanelOpen(false)
  })

  const applyCurrentFilters = () => {
    void onSubmit()
  }

  const handleClearFilters = () => {
    clearFilters()
    setSearchValue('')
    setSelectedLyceumId(null)
    setHoveredLyceumId(null)
  }

  const panel = (
    <MapExplorerPanel
      form={form}
      onSubmit={onSubmit}
      onClearFilters={handleClearFilters}
      isFetching={isFetching}
      isLoading={isLoading}
      error={error}
      items={items}
      summary={summary}
      selectedLyceumId={selectedLyceumId}
      hoveredLyceumId={hoveredLyceumId}
      onHoverLyceum={setHoveredLyceumId}
      onSelectLyceum={setSelectedLyceumId}
      locale={i18n.language}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      onApplySearch={applyCurrentFilters}
      filtersState={state}
      t={t}
    />
  )

  const map = (
    <MapExplorerMap
      items={items}
      selectedLyceumId={selectedLyceumId}
      hoveredLyceumId={hoveredLyceumId}
      onSelectLyceum={setSelectedLyceumId}
      onHoverLyceum={setHoveredLyceumId}
      t={t}
    />
  )

  return (
    <>
      <Helmet>
        <title>{`${t('pages.map.title')} | ${t('app.title')}`}</title>
      </Helmet>

      <MapExplorerLayout
        panel={panel}
        map={map}
        isPanelOpen={isMobilePanelOpen}
        onTogglePanel={() =>
          setIsMobilePanelOpen((previousState) => !previousState)
        }
        onClosePanel={() => setIsMobilePanelOpen(false)}
        t={t}
      />
    </>
  )
}

export default MapPage
