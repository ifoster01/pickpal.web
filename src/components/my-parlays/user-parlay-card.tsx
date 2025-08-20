'use client';

import { useState } from 'react';
import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/utils/cn';

type UserParlay = Database['public']['Tables']['user_parlays']['Row'];

interface UserParlayWithLegCount extends UserParlay {
  parlay_leg: Array<{ count: number }>;
}

interface UserParlayCardProps {
  parlay: UserParlayWithLegCount;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function UserParlayCard({
  parlay,
  onDelete,
  isDeleting,
}: UserParlayCardProps) {
  const [showActions, setShowActions] = useState(false);

  // Get leg count from the aggregated data
  const legCount = parlay.parlay_leg?.[0]?.count || 0;

  // Format creation date
  const createdDate = new Date(parlay.created_at).toLocaleDateString();
  const createdTime = new Date(parlay.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group hover:shadow-md transition-all duration-200',
          isDeleting && 'opacity-50 pointer-events-none'
        )}
      >
        <div className='p-4 sm:p-6'>
          {/* Header Section - Responsive Layout */}
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
            {/* Parlay Info */}
            <div className='flex-1 min-w-0'>
              {/* Title and Badge Row */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3'>
                <h3 className='font-semibold text-lg sm:text-xl truncate'>
                  {parlay.name || 'Untitled Parlay'}
                </h3>
                <Badge variant='secondary' className='flex-shrink-0 w-fit'>
                  {legCount} leg{legCount === 1 ? '' : 's'}
                </Badge>
              </div>

              {/* Meta Information - Stack on mobile, row on desktop */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4 flex-shrink-0' />
                  <span>Created {createdDate}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Target className='h-4 w-4 flex-shrink-0' />
                  <span>
                    {legCount === 0
                      ? 'No events'
                      : `${legCount} events selected`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions - Always visible on mobile, hover on desktop */}
            <div className='flex items-center gap-2 sm:flex-shrink-0'>
              {/* Quick View Button - Hidden on mobile, visible on desktop hover */}
              <Link
                href={`/authed/my-parlays/${parlay.id}`}
                className='hidden sm:block'
              >
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <Eye className='h-4 w-4' />
                  View
                </Button>
              </Link>

              {/* Mobile View Button - Visible on mobile */}
              <Link
                href={`/authed/my-parlays/${parlay.id}`}
                className='sm:hidden'
              >
                <Button variant='outline' size='sm' className='gap-2'>
                  <Eye className='h-4 w-4' />
                  View
                </Button>
              </Link>

              {/* More Actions */}
              <DropdownMenu open={showActions} onOpenChange={setShowActions}>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/authed/my-parlays/${parlay.id}`}
                      className='flex items-center gap-2'
                    >
                      <Eye className='h-4 w-4' />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/authed/my-parlays/${parlay.id}/edit`}
                      className='flex items-center gap-2'
                    >
                      <Edit className='h-4 w-4' />
                      Edit Parlay
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className='flex items-center gap-2 text-destructive focus:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete Parlay
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status and Stats - Responsive Layout */}
          <div className='mt-4 pt-4 border-t'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                {legCount === 0 ? (
                  <Badge
                    variant='outline'
                    className='text-muted-foreground w-fit'
                  >
                    Empty
                  </Badge>
                ) : legCount < 2 ? (
                  <Badge variant='outline' className='text-yellow-600 w-fit'>
                    Incomplete
                  </Badge>
                ) : (
                  <Badge variant='default' className='bg-green-600 w-fit'>
                    Ready
                  </Badge>
                )}

                <span className='text-sm text-muted-foreground'>
                  {legCount < 2
                    ? `Add ${2 - legCount} more event${2 - legCount === 1 ? '' : 's'} to complete`
                    : 'Ready to track'}
                </span>
              </div>

              <div className='text-sm text-muted-foreground sm:text-right'>
                {createdTime}
              </div>
            </div>
          </div>

          {/* Preview - Responsive */}
          {legCount > 0 && (
            <div className='mt-4 p-3 bg-accent/30 rounded-lg'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm'>
                <span className='font-medium'>
                  {legCount} event{legCount === 1 ? '' : 's'} selected
                </span>
                <Link
                  href={`/authed/my-parlays/${parlay.id}`}
                  className='text-primary hover:underline w-fit'
                >
                  View details →
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
