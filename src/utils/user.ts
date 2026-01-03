import type { CurrentUser } from '../types/users'

const getUserNameParts = (user?: CurrentUser) => {
  const firstName = user?.firstname ?? user?.firstName ?? ''
  const lastName = user?.lastname ?? user?.lastName ?? ''
  return [firstName, lastName].filter(Boolean)
}

export const getUserFullName = (user?: CurrentUser) =>
  getUserNameParts(user).join(' ').trim()

export const getUserDisplayName = (user?: CurrentUser) =>
  getUserFullName(user) || user?.username || user?.email || ''
