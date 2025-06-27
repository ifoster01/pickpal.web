'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PickpocktLogo from '~/assets/logos/pickpockt long.svg';

const useScrollNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (id: string) => {
    if (pathname !== '/') {
      // Store the target section in sessionStorage
      sessionStorage.setItem('scrollTarget', id);
      router.push('/');
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return handleNavigation;
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const handleNavigation = useScrollNavigation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section */}
          <div className='w-[200px]'>
            <Link href='/' className='items-center w-fit'>
              <Image
                src={PickpocktLogo}
                alt='Pickpockt'
                width={200}
                height={50}
              />
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className='hidden md:flex flex-1 items-center justify-center space-x-8'>
            <button
              onClick={() => handleNavigation('features')}
              className='text-foreground/80 hover:text-foreground transition-colors'
            >
              Features
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className='text-foreground/80 hover:text-foreground transition-colors'
            >
              About
            </button>
            <button
              onClick={() => handleNavigation('mobile-app')}
              className='text-foreground/80 hover:text-foreground transition-colors'
            >
              Mobile App
            </button>
            <button
              onClick={() => handleNavigation('faq')}
              className='text-foreground/80 hover:text-foreground transition-colors'
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className='text-foreground/80 hover:text-foreground transition-colors'
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons Section */}
          <div className='hidden md:flex items-center space-x-4 w-[200px] justify-end'>
            {user ? (
              <>
                <Button
                  variant='ghost'
                  onClick={() => router.push('/authed/picks')}
                >
                  Return to App
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <User className='h-5 w-5' />
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
              </>
            ) : (
              <>
                <Button
                  variant='ghost'
                  onClick={() => router.push('/auth/login')}
                >
                  Sign In
                </Button>
                <Button onClick={() => router.push('/auth/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-background border-t'
          >
            <div className='container mx-auto px-4 py-4 space-y-4'>
              <button
                onClick={() => handleNavigation('features')}
                className='block w-full text-left py-2'
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className='block w-full text-left py-2'
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('mobile-app')}
                className='block w-full text-left py-2'
              >
                Mobile App
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className='block w-full text-left py-2'
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavigation('contact')}
                className='block w-full text-left py-2'
              >
                Contact
              </button>
              {user ? (
                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => router.push('/authed/picks')}
                  >
                    Return to App
                  </Button>
                  <Button onClick={signOut}>Sign Out</Button>
                </div>
              ) : (
                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/auth/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
