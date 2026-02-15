import type { TFunction } from 'i18next'

type MapExplorerMapControlsProps = {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocateMe: () => void
  onResetView: () => void
  isLocating: boolean
  t: TFunction
}

const controlButtonClassName =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-md transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300'

const MapExplorerMapControls = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetView,
  isLocating,
  t,
}: MapExplorerMapControlsProps) => (
  <div className="absolute right-3 top-3 z-[450] flex flex-col gap-2">
    <button
      type="button"
      onClick={onZoomIn}
      className={controlButtonClassName}
      aria-label={t('pages.map.controls.zoomIn')}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M10 4v12M4 10h12" strokeLinecap="round" />
      </svg>
    </button>
    <button
      type="button"
      onClick={onZoomOut}
      className={controlButtonClassName}
      aria-label={t('pages.map.controls.zoomOut')}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 10h12" strokeLinecap="round" />
      </svg>
    </button>
    <button
      type="button"
      onClick={onLocateMe}
      disabled={isLocating}
      className={`${controlButtonClassName} disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label={t('pages.map.controls.locate')}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="10" cy="10" r="2.4" />
        <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3" strokeLinecap="round" />
      </svg>
    </button>
    <button
      type="button"
      onClick={onResetView}
      className={controlButtonClassName}
      aria-label={t('pages.map.controls.reset')}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          d="M16 10a6 6 0 10-1.4 3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 5.5V10h-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
)

export default MapExplorerMapControls