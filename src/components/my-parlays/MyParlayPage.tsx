'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Components
import { UserParlayCard } from '@/components/my-parlays/user-parlay-card';
import { ParlayStats } from '@/components/my-parlays/parlay-stats';

// Hooks
import { useParlays, useDeleteParlay } from '@/hooks/api/use-parlays';

export function MyParlaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const { data: parlays, isLoading } = useParlays();
  const deleteParlay = useDeleteParlay();

  // Filter and sort parlays
  const filteredParlays =
    parlays?.filter((parlay) =>
      parlay.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const sortedParlays = [...filteredParlays].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      default:
        return 0;
    }
  });

  const handleDeleteParlay = async (parlayId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this parlay? This action cannot be undone.'
      )
    ) {
      try {
        await deleteParlay.mutateAsync(parlayId);
      } catch (error) {
        console.error('Failed to delete parlay:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='h-9 w-48 bg-muted animate-pulse rounded' />
          <div className='h-10 w-32 bg-muted animate-pulse rounded' />
        </div>
        <div className='grid gap-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='p-6'>
              <div className='h-32 bg-muted animate-pulse rounded' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>My Parlays</h1>
          <p className='text-muted-foreground'>
            Manage your custom parlays and track their performance
          </p>
        </div>
        <Link href='/authed/create-parlay'>
          <Button className='gap-2'>
            <Plus className='h-4 w-4' />
            Create New Parlay
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {parlays && parlays.length > 0 && <ParlayStats parlays={parlays} />}

      {/* Search and Filter Controls */}
      <Card className='p-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search parlays by name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='flex gap-2'>
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSortBy('newest')}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSortBy('oldest')}
            >
              Oldest
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSortBy('name')}
            >
              Name
            </Button>
          </div>
        </div>
      </Card>

      {/* Parlays List */}
      <div className='space-y-4'>
        {sortedParlays.length > 0 ? (
          sortedParlays.map((parlay) => (
            <UserParlayCard
              key={parlay.id}
              parlay={parlay}
              onDelete={() => handleDeleteParlay(parlay.id)}
              isDeleting={deleteParlay.isPending}
            />
          ))
        ) : (
          <Card className='p-12 text-center'>
            <div className='max-w-md mx-auto space-y-4'>
              <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto'>
                <TrendingUp className='h-8 w-8 text-muted-foreground' />
              </div>

              {parlays?.length === 0 ? (
                <>
                  <h3 className='text-lg font-semibold'>No parlays yet</h3>
                  <p className='text-muted-foreground'>
                    Create your first parlay by selecting multiple events and
                    combining them for bigger payouts.
                  </p>
                  <Link href='/authed/create-parlay'>
                    <Button className='gap-2 mt-4'>
                      <Plus className='h-4 w-4' />
                      Create Your First Parlay
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className='text-lg font-semibold'>No matching parlays</h3>
                  <p className='text-muted-foreground'>
                    No parlays match your search criteria. Try adjusting your
                    search or create a new parlay.
                  </p>
                  <div className='flex gap-2 justify-center'>
                    <Button variant='outline' onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                    <Link href='/authed/create-parlay'>
                      <Button className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Create New Parlay
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Footer Info */}
      {parlays && parlays.length > 0 && (
        <Card className='p-4'>
          <div className='flex items-center justify-center text-sm text-muted-foreground'>
            <span>
              Showing {sortedParlays.length} of {parlays.length} parlay
              {parlays.length === 1 ? '' : 's'}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
