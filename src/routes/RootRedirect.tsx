import { Navigate } from 'react-router-dom'

import { getPreferredLanguage } from '../utils/language'
import { toLocalizedPath } from '../utils/localizedPath'

const RootRedirect = () => {
  const preferredLanguage = getPreferredLanguage()
  const localizedPath = toLocalizedPath('/shkoli', preferredLanguage)

  return <Navigate to={localizedPath} replace />
}

export default RootRedirect

