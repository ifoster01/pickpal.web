'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useFilter } from '@/providers/FilterProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TimeFilter component that displays a horizontal scrolling tab selector for week ranges
 */
export function TimeFilter() {
  const { selectedWeek, setSelectedWeek, availableWeeks } = useFilter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected week when component mounts or selection changes
  useEffect(() => {
    if (scrollContainerRef.current && selectedWeek) {
      const selectedButton = scrollContainerRef.current.querySelector(
        `[data-week-key="${selectedWeek.key}"]`
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedWeek, selectedWeek?.key]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='relative w-full'>
      {/* Left scroll button */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 backdrop-blur-sm hover:bg-background/90'
        onClick={scrollLeft}
        aria-label='Scroll weeks left'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className='flex gap-2 overflow-x-auto px-8 py-2 scrollbar-hide'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {availableWeeks.map((week) => {
          const isSelected = selectedWeek.key === week.key;
          const isCurrentWeek = week.label === 'This Week';

          return (
            <Button
              key={week.key}
              data-week-key={week.key}
              variant={isSelected ? 'default' : 'ghost'}
              size='sm'
              className={cn(
                'flex-shrink-0 whitespace-nowrap transition-all duration-200',
                isSelected && 'shadow-md',
                isCurrentWeek && !isSelected && 'ring-1 ring-primary/30',
                'hover:scale-105'
              )}
              onClick={() => setSelectedWeek(week)}
            >
              {week.label}
            </Button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm hover:bg-background/90'
        onClick={scrollRight}
        aria-label='Scroll weeks right'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>

      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
