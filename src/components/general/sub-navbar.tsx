'use client';

import {
  Heart,
  Trophy,
  User,
  LogOut,
  ChevronLeft,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/utils/cn';

const authedRoutes = [
  {
    name: 'Picks',
    path: '/authed/picks',
    icon: <Trophy className='w-5 h-5' />,
  },
  {
    name: 'Saved',
    path: '/authed/saved',
    icon: <Heart className='w-5 h-5' />,
  },
  {
    name: 'My Parlays',
    path: '/authed/my-parlays',
    icon: <ListChecks className='w-5 h-5' />,
  },
];

export function SubNavbar() {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className='flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b'>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='lg:hidden'
        >
          <ChevronLeft className='w-5 h-5' />
        </Button>
      </div>
      <div className='flex-1 overflow-x-auto'>
        <div className='flex items-center justify-center gap-8'>
          {authedRoutes.map((route) => (
            <Link
              href={route.path}
              key={route.path}
              className={cn(
                'flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap',
                {
                  'text-foreground': pathname === route.path,
                }
              )}
            >
              {route.icon}
              <span className='hidden sm:block'>{route.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <User className='w-5 h-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href='/authed/profile'>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
