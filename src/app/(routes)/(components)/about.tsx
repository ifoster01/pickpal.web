'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import aboutImage from '~/assets/media/about-img.png';

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id='about' className='py-24 bg-secondary/30'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl font-bold mb-4'>Our Story</h2>
          <p className='text-xl text-muted-foreground'>
            Building the future of casual sports betting
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className='space-y-6'
          >
            <h3 className='text-2xl font-semibold'>Our Mission</h3>
            <p className='text-muted-foreground'>
              Founded in 2024, we set out to revolutionize the way people make
              sports bets. Our team of experts combines advanced machine
              learning with deep industry knowledge to provide unparalleled
              insights.
            </p>
            <h3 className='text-2xl font-semibold'>Our Vision</h3>
            <p className='text-muted-foreground'>
              We&apos;re building a future where advanced analytics are
              accessible to everyone. Through continuous innovation and
              dedication to our users, we&apos;re making that vision a reality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className='relative h-[400px] rounded-lg overflow-hidden'
          >
            <Image
              src={aboutImage}
              alt='Team collaboration'
              fill
              className='object-cover grayscale'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
