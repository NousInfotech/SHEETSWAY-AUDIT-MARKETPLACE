import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'firebase/auth';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: User | null ;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage
          src={user?.photoURL ? user.photoURL : ''}
          alt={user?.displayName || user?.email || ''}
        />
        <AvatarFallback className='rounded-lg'>
          {user?.displayName?.slice(0, 2)?.toUpperCase() ||
            user?.email?.slice(0, 2)?.toUpperCase() ||
            'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>
            {user?.displayName || user?.email || ''}
          </span>
          <span className='truncate text-xs'>{user?.email || ''}</span>
        </div>
      )}
    </div>
  );
}
