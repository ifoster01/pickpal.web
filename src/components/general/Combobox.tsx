import type { ComboboxInputValueChangeDetails } from '@ark-ui/react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { Combobox as PCombobox } from '../ui/combobox'
import { IconButton } from '~/components/ui/icon-button'
import { Input } from '~/components/ui/input'

export function Combobox ({
  items,
  placeholder,
  label,
  ...props
}:{
  label: string,
  placeholder?: string
  items: { label: string, value: string }[]
} & ComponentProps<typeof PCombobox.Root>) {
  const [data, setData] = useState(items)

  const handleChange = (e: ComboboxInputValueChangeDetails) => {
    const filtered = items.filter((item) => item.label.toLowerCase().includes(e.inputValue.toLowerCase()))
    setData(filtered.length > 0 ? filtered : items)
  }

  return (
    <PCombobox.Root width="2xs" onInputValueChange={handleChange} items={data} {...props}>
      <PCombobox.Label>{label}</PCombobox.Label>
      <PCombobox.Control>
        <PCombobox.Input placeholder={placeholder ?? 'Select'} asChild>
          <Input />
        </PCombobox.Input>
        <PCombobox.Trigger asChild>
          <IconButton variant="link" aria-label="open" size="xs">
            <ChevronsUpDownIcon />
          </IconButton>
        </PCombobox.Trigger>
      </PCombobox.Control>
      <PCombobox.Positioner>
        <PCombobox.Content overflowY='auto' maxH='50vh'>
            {data.map((item) => (
              <PCombobox.Item key={item.value} item={item} p={4}>
                <PCombobox.ItemText>{item.label}</PCombobox.ItemText>
                <PCombobox.ItemIndicator>
                  <CheckIcon />
                </PCombobox.ItemIndicator>
              </PCombobox.Item>
            ))}
        </PCombobox.Content>
      </PCombobox.Positioner>
    </PCombobox.Root>
  )
}
