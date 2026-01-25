import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import {
  getInviteLecturerErrorKey,
  getLecturersLoadErrorKey,
  getRemoveLecturerErrorKey,
} from '../services/lyceumLecturerErrors'
import { useLyceumLecturers } from '../../hooks/useLyceumLecturers'
import { useUsers } from '../../hooks/useUsers'
import { useLyceumLecturerActions } from '../hooks/useLyceumLecturerActions'
import { useLyceumLecturerForm } from '../hooks/useLyceumLecturerForm'
import { useLyceumLecturerSuggestions } from '../hooks/useLyceumLecturerSuggestions'
import LyceumLecturerInviteForm from './LyceumLecturerInviteForm'
import LyceumLecturerList from './LyceumLecturerList'
import LyceumLecturerManagerHeader from './LyceumLecturerManagerHeader'

type LyceumLecturerManagerProps = {
  lyceumId: number
}

const LyceumLecturerManager = ({ lyceumId }: LyceumLecturerManagerProps) => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const { form, trimmedEmailValue } = useLyceumLecturerForm(t)
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId, { enabled: Number.isFinite(lyceumId) })
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useUsers({ enabled: Number.isFinite(lyceumId) })
  const {
    inviteMutation,
    removeMutation,
    removingId,
    handleAddSubmit,
    handleRemove,
  } = useLyceumLecturerActions({
    lyceumId,
    resetForm: form.reset,
    showToast,
    t,
  })
  const { suggestionEmails, suggestionMessageKey, suggestionMessageTone } =
    useLyceumLecturerSuggestions({
      users,
      trimmedEmailValue,
      isUsersLoading,
      usersError: usersError ?? null,
    })
  const inviteErrorKey = getInviteLecturerErrorKey(inviteMutation.error ?? null)
  const removeErrorKey = getRemoveLecturerErrorKey(removeMutation.error ?? null)
  const lecturersLoadErrorKey = getLecturersLoadErrorKey(
    lecturersError ?? null,
  )
  const lecturersCount = lecturers?.length ?? 0

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="pointer-events-none absolute -top-10 right-6 h-24 w-24 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="relative z-10 space-y-4">
        <LyceumLecturerManagerHeader count={lecturersCount} />
        <div className="space-y-4">
          <LyceumLecturerInviteForm
            form={form}
            onSubmit={handleAddSubmit}
            suggestionEmails={suggestionEmails}
            suggestionMessageKey={suggestionMessageKey}
            suggestionMessageTone={suggestionMessageTone}
            inviteErrorKey={inviteErrorKey}
            isSubmitting={inviteMutation.isPending}
          />
          <LyceumLecturerList
            lecturers={lecturers}
            isLoading={isLecturersLoading}
            loadErrorKey={lecturersLoadErrorKey}
            removeErrorKey={removeErrorKey}
            isRemoving={removeMutation.isPending}
            removingId={removingId}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  )
}

export default LyceumLecturerManager
