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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';

type Filter = 'upcoming' | 'past' | 'all';

export function EventFilter({ className }: { className?: string }) {
  const { filter, setFilter, showPicksOnly, setShowPicksOnly } = useFilter();
  const isMobile = useIsMobile();

  const filterOptions = [
    {
      value: 'upcoming',
      label: 'Upcoming',
      description: 'Show future events',
    },
    { value: 'past', label: 'Completed', description: 'Show past events' },
    { value: 'all', label: 'All Events', description: 'Show all events' },
  ];

  if (isMobile) {
    return (
      <div className={cn('block md:hidden', className)}>
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
            <div className='py-6 space-y-6'>
              <div>
                <h4 className='text-sm font-medium mb-3'>Event Status</h4>
                <RadioGroup
                  value={filter}
                  onValueChange={(value: Filter) => setFilter(value)}
                  className='grid grid-cols-1 gap-4'
                >
                  {filterOptions.map((option) => (
                    <RadioGroupCard
                      key={option.value}
                      value={option.value}
                      className='flex items-center justify-between'
                    >
                      <div className='flex flex-col items-start'>
                        <span className='text-base font-semibold'>
                          {option.label}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                          {option.description}
                        </span>
                      </div>
                      {filter === option.value && (
                        <Check className='h-4 w-4 text-primary' />
                      )}
                    </RadioGroupCard>
                  ))}
                </RadioGroup>
              </div>

              <div className='space-y-3'>
                <h4 className='text-sm font-medium'>Content Filter</h4>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='picks-only'
                    checked={showPicksOnly}
                    onCheckedChange={setShowPicksOnly}
                  />
                  <label
                    htmlFor='picks-only'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Show only events with picks
                  </label>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Filter to show only events where our model has a pick
                  recommendation
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={cn('hidden sm:block', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>
            <Filter className='h-4 w-4 mr-2' />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64'>
          <DropdownMenuRadioGroup
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
          >
            {filterOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <div className='p-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='picks-only-desktop'
                checked={showPicksOnly}
                onCheckedChange={setShowPicksOnly}
              />
              <label
                htmlFor='picks-only-desktop'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Show only picks
              </label>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
