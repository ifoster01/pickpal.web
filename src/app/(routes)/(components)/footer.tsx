'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const useScrollNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (id: string) => {
    if (pathname !== '/') {
      // Store the target section in sessionStorage
      sessionStorage.setItem('scrollTarget', id);
      router.push('/');
    } else {
      scrollToSection(id);
    }
  };

  return handleNavigation;
};

export function Footer() {
  const handleNavigation = useScrollNavigation();

  return (
    <footer className='bg-background border-t'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => handleNavigation('about')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('features')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('historical')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Historical
                </button>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Product</h3>
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => handleNavigation('mobile-app')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Mobile App
                </button>
              </li>
              <li>
                <Link
                  href='/pricing'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => handleNavigation('contact')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('faq')}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/privacy-policy'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-of-service'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>
            If you or someone you know is struggling with gambling, help is
            available. Contact the{' '}
            <span className='font-bold'>
              National Problem Gambling Helpline at 1-800-522-4700
            </span>{' '}
            for confidential support, available 24/7. Talking to a professional
            can provide guidance, resources, and support tailored to your needs.
            Remember, help is just a call away.
          </p>
        </div>

        <div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} Pickpockt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
