import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { User } from '@supabase/supabase-js';

export function SaveButton({
  isLiked,
  onLike,
  onUnlike,
  user,
  likesCount,
}: {
  isLiked?: boolean;
  onLike?: () => void;
  onUnlike?: () => void;
  user: User | null;
  likesCount?: number;
}) {
  const handleSaveClick = () => {
    if (!user) return;
    if (isLiked) {
      onUnlike?.();
    } else {
      onLike?.();
    }
  };

  return (
    <>
      {likesCount !== undefined && likesCount > 0 && (
        <span className='text-sm text-muted-foreground'>{likesCount}</span>
      )}
      <motion.button
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          'transition-all duration-200 ease-in-out',
          'hover:scale-110 active:scale-95',
          isLiked ? 'bg-primary/10' : 'bg-background/80 backdrop-blur-sm',
          !user && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleSaveClick}
        disabled={!user}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          className={cn(
            'w-4 h-4 transition-all duration-200',
            isLiked ? 'fill-primary stroke-primary' : 'stroke-muted-foreground',
            'group-hover:stroke-primary'
          )}
        />
      </motion.button>
    </>
  );
}
