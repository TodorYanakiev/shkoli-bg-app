type SubscriptionEntityType = 'course' | 'lyceum'

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const getStorageKey = (
  userId: number,
  entityType: SubscriptionEntityType,
  entityId: number,
) => `subscription-state:${userId}:${entityType}:${entityId}`

export const getStoredSubscriptionState = (
  userId: number | undefined,
  entityType: SubscriptionEntityType,
  entityId: number | undefined,
): boolean | null => {
  if (
    !isBrowser() ||
    typeof userId !== 'number' ||
    !Number.isFinite(userId) ||
    typeof entityId !== 'number' ||
    !Number.isFinite(entityId)
  ) {
    return null
  }

  const rawValue = window.localStorage.getItem(
    getStorageKey(userId, entityType, entityId),
  )

  if (rawValue === 'true') {
    return true
  }

  if (rawValue === 'false') {
    return false
  }

  return null
}

export const setStoredSubscriptionState = (
  userId: number | undefined,
  entityType: SubscriptionEntityType,
  entityId: number | undefined,
  isSubscribed: boolean,
) => {
  if (
    !isBrowser() ||
    typeof userId !== 'number' ||
    !Number.isFinite(userId) ||
    typeof entityId !== 'number' ||
    !Number.isFinite(entityId)
  ) {
    return
  }

  window.localStorage.setItem(
    getStorageKey(userId, entityType, entityId),
    String(isSubscribed),
  )
}
