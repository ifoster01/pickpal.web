import { ComponentProps } from "react"
import { Select as PSelect } from "../ui/select"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

export function Select({
    items,
    groupLabels,
    _placeholder,
    ...props
}:{
    items: { label: string, value: string }[]
    groupLabels?: string[]
    _placeholder?: string
} & ComponentProps<typeof PSelect.Root>) {
    return (
        <PSelect.Root
            items={items}
            {...props}
        >
            <PSelect.Control>
                <PSelect.Trigger>
                    <PSelect.ValueText placeholder={_placeholder ?? 'Select'} />
                    <ChevronsUpDownIcon />
                </PSelect.Trigger>
            </PSelect.Control>
            <PSelect.Positioner>
                <PSelect.Content>
                    <PSelect.ItemGroup>
                        <PSelect.ItemGroupLabel>{groupLabels ? groupLabels[0] : 'Select'}</PSelect.ItemGroupLabel>
                        {items.map((item) => (
                            <PSelect.Item key={item.value} item={item}>
                                <PSelect.ItemText>{item.label}</PSelect.ItemText>
                                <PSelect.ItemIndicator>
                                    <CheckIcon />
                                </PSelect.ItemIndicator>
                            </PSelect.Item>
                        ))}
                    </PSelect.ItemGroup>
                </PSelect.Content>
            </PSelect.Positioner>
        </PSelect.Root>
    )
}