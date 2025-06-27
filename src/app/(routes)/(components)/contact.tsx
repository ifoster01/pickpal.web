'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof schema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      const { error } = await supabase.from('contact_messages').insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='contact' className='py-24 bg-background'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='max-w-2xl mx-auto'
        >
          <h2 className='text-4xl font-bold text-center mb-4'>Get in Touch</h2>
          <p className='text-muted-foreground text-center mb-12'>
            Have questions? We&apos;d love to hear from you.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label className='block text-sm font-medium mb-2'>Name</label>
                <input
                  {...register('name')}
                  type='text'
                  className='w-full px-4 py-2 rounded-lg border bg-background hover:bg-accent/50 focus:bg-accent/50 transition-colors'
                  placeholder='John Doe'
                />
                {errors.name && (
                  <p className='text-destructive text-sm mt-1'>
                    {errors.name.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label className='block text-sm font-medium mb-2'>Email</label>
                <input
                  {...register('email')}
                  type='email'
                  className='w-full px-4 py-2 rounded-lg border bg-background hover:bg-accent/50 focus:bg-accent/50 transition-colors'
                  placeholder='john@example.com'
                />
                {errors.email && (
                  <p className='text-destructive text-sm mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <label className='block text-sm font-medium mb-2'>Message</label>
              <textarea
                {...register('message')}
                className='w-full px-4 py-2 rounded-lg border bg-background hover:bg-accent/50 focus:bg-accent/50 transition-colors min-h-[150px]'
                placeholder='Your message here...'
              />
              {errors.message && (
                <p className='text-destructive text-sm mt-1'>
                  {errors.message.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className='flex justify-center'
            >
              <Button
                type='submit'
                size='lg'
                className='min-w-[200px]'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
