import type { UserIdentity } from '../types/users'

const getUserNameParts = (user?: UserIdentity) => {
  const firstName = user?.firstname ?? user?.firstName ?? ''
  const lastName = user?.lastname ?? user?.lastName ?? ''
  return [firstName, lastName].filter(Boolean)
}

export const getUserFullName = (user?: UserIdentity) =>
  getUserNameParts(user).join(' ').trim()

export const getUserDisplayName = (user?: UserIdentity) =>
  getUserFullName(user) || user?.username || user?.email || ''
