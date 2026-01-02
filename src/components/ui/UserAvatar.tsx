import avatarPlaceholder from '../../assets/avatar-placeholder.svg'

type UserAvatarSize = 'sm' | 'md' | 'lg'

type UserAvatarProps = {
  alt: string
  size?: UserAvatarSize
  className?: string
}

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
}

const UserAvatar = ({ alt, size = 'md', className }: UserAvatarProps) => {
  const classes = [
    'rounded-full border border-slate-200 bg-slate-100 object-cover shadow-sm',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <img src={avatarPlaceholder} alt={alt} className={classes} />
}

export default UserAvatar
