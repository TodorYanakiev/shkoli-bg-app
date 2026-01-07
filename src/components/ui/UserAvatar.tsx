import avatarPlaceholder from '../../assets/avatar-placeholder.svg'

type UserAvatarSize = 'sm' | 'md' | 'lg' | 'full'
type UserAvatarShape = 'circle' | 'rounded' | 'square'

type UserAvatarProps = {
  alt: string
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

const UserAvatar = ({
  alt,
  size = 'md',
  shape = 'circle',
  className,
}: UserAvatarProps) => {
  const classes = [
    'border border-slate-200 bg-slate-100 object-cover shadow-sm',
    sizeClasses[size],
    shapeClasses[shape],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <img src={avatarPlaceholder} alt={alt} className={classes} />
}

export default UserAvatar
