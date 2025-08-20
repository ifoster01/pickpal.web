'use client';

import { useAuth } from '@/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Trophy,
  Heart,
  UserCircle,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { SubNavbar } from '@/components/general/sub-navbar';

const navItems = [
  { href: '/authed/picks', label: 'Picks', icon: Trophy },
  { href: '/authed/saved', label: 'Saved', icon: Heart },
  // { href: '/authed/parlay', label: 'Auto Parlay', icon: Rocket },
  { href: '/authed/my-parlays', label: 'My Parlays', icon: ListChecks },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='md:hidden'>
        <SubNavbar />
      </div>
      <header className='hidden md:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex h-14 items-center px-4 md:px-6'>
          <nav className='hidden md:flex items-center space-x-6 text-sm font-medium'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-4 transition-colors hover:text-foreground/80 flex items-center space-x-1',
                  pathname === item.href ||
                    (item.href === '/authed/my-parlays' &&
                      pathname.startsWith('/authed/my-parlays'))
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                <item.icon className='h-4 w-4' />
                <span>{item.label}</span>
                {(pathname === item.href ||
                  (item.href === '/authed/my-parlays' &&
                    pathname.startsWith('/authed/my-parlays'))) && (
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-foreground'
                    layoutId='navbar-indicator'
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className='ml-auto flex items-center space-x-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <User className='h-5 w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href='/authed/profile'
                    className='flex items-center cursor-pointer'
                  >
                    <UserCircle className='mr-2 h-4 w-4' />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className='text-red-600'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className='flex-1 w-full px-4 md:px-6 py-6 mx-auto max-w-7xl'>
        {children}
      </main>
    </div>
  );
}
