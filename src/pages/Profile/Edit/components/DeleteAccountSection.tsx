import { useTranslation } from 'react-i18next'

type DeleteAccountSectionProps = {
  deleteErrorKey: string | null
  isDeleting: boolean
  onOpenModal: () => void
}

const DeleteAccountSection = ({
  deleteErrorKey,
  isDeleting,
  onOpenModal,
}: DeleteAccountSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-rose-800">
        {t('pages.profile.edit.delete.title')}
      </h2>
      <p className="mt-2 text-sm text-rose-700">
        {t('pages.profile.edit.delete.description')}
      </p>
      {deleteErrorKey ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {t(deleteErrorKey)}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onOpenModal}
        disabled={isDeleting}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:text-rose-800 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
      >
        {t('pages.profile.edit.delete.action')}
      </button>
    </div>
  )
}

export default DeleteAccountSection
