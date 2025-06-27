import { Check, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { RadioGroup, RadioGroupCard } from '../ui/radio-group';
import { useFilter } from '@/providers/FilterProvider';
import { cn } from '@/utils/cn';

type Filter = 'upcoming' | 'past' | 'all';

export function EventFilter({ className }: { className?: string }) {
  const { filter, setFilter } = useFilter();

  return (
    <div className={cn('block sm:hidden', className)}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon'>
            <Filter className='h-4 w-4' />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter events by status</SheetDescription>
          </SheetHeader>
          <div className='py-6'>
            <RadioGroup
              value={filter}
              onValueChange={(value: Filter) => setFilter(value)}
              className='grid grid-cols-1 gap-4'
            >
              <RadioGroupCard
                value='upcoming'
                className='flex items-center justify-between'
              >
                <div className='flex flex-col items-start'>
                  <span className='text-base font-semibold'>Upcoming</span>
                  <span className='text-sm text-muted-foreground'>
                    Show future events
                  </span>
                </div>
                {filter === 'upcoming' && (
                  <Check className='h-4 w-4 text-primary' />
                )}
              </RadioGroupCard>
              <RadioGroupCard
                value='past'
                className='flex items-center justify-between'
              >
                <div className='flex flex-col items-start'>
                  <span className='text-base font-semibold'>Completed</span>
                  <span className='text-sm text-muted-foreground'>
                    Show past events
                  </span>
                </div>
                {filter === 'past' && (
                  <Check className='h-4 w-4 text-primary' />
                )}
              </RadioGroupCard>
              <RadioGroupCard
                value='all'
                className='flex items-center justify-between'
              >
                <div className='flex flex-col items-start'>
                  <span className='text-base font-semibold'>All Events</span>
                  <span className='text-sm text-muted-foreground'>
                    Show all events
                  </span>
                </div>
                {filter === 'all' && <Check className='h-4 w-4 text-primary' />}
              </RadioGroupCard>
            </RadioGroup>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
