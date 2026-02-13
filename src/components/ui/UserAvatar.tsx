import { useEffect, useRef, useState } from 'react'

import avatarPlaceholder from '../../assets/avatar-placeholder.svg'

type UserAvatarSize = 'sm' | 'md' | 'lg' | 'full'
type UserAvatarShape = 'circle' | 'rounded' | 'square'

type UserAvatarProps = {
  alt: string
  src?: string | null
  size?: UserAvatarSize
  shape?: UserAvatarShape
  className?: string
}

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  full: 'h-full w-full',
}

const shapeClasses: Record<UserAvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
  square: 'rounded-md',
}

const normalizeSource = (value?: string | null) => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const withRetryQueryParam = (source: string, retryAttempt: number) => {
  if (retryAttempt <= 0) return source

  try {
    const url = new URL(source)
    url.searchParams.set('avatarRetry', String(retryAttempt))
    return url.toString()
  } catch {
    const separator = source.includes('?') ? '&' : '?'
    return `${source}${separator}avatarRetry=${retryAttempt}`
  }
}

const UserAvatar = ({
  alt,
  src,
  size = 'md',
  shape = 'circle',
  className,
}: UserAvatarProps) => {
  const normalizedSource = normalizeSource(src)
  const retryTimeoutRef = useRef<number | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    if (retryTimeoutRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(retryTimeoutRef.current)
    }
    retryTimeoutRef.current = null
    setRetryAttempt(0)
    setHasLoadError(false)
  }, [normalizedSource])

  useEffect(
    () => () => {
      if (retryTimeoutRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(retryTimeoutRef.current)
      }
    },
    [],
  )

  const classes = [
    'border border-slate-200 bg-slate-100 object-cover shadow-sm',
    sizeClasses[size],
    shapeClasses[shape],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const canUseSource = normalizedSource && !hasLoadError
  const imageSrc = canUseSource
    ? withRetryQueryParam(normalizedSource, retryAttempt)
    : avatarPlaceholder

  const handleError = () => {
    if (!normalizedSource) {
      setHasLoadError(true)
      return
    }

    if (retryAttempt < 2) {
      if (typeof window !== 'undefined') {
        if (retryTimeoutRef.current !== null) {
          window.clearTimeout(retryTimeoutRef.current)
        }
        retryTimeoutRef.current = window.setTimeout(() => {
          setRetryAttempt((previous) => previous + 1)
        }, 800)
        return
      }
      setRetryAttempt((previous) => previous + 1)
      return
    }

    setHasLoadError(true)
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={classes}
      onError={handleError}
    />
  )
}

export default UserAvatar
