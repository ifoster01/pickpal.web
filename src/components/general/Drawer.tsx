import { XIcon } from "lucide-react";
import { Drawer as PDrawer } from "../ui/drawer";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";
import { ComponentProps, ReactNode } from "react";

export function Drawer({
    trigger,
    headerTitle,
    children,
    footer,
    ...props
}:{
    trigger: ReactNode
    headerTitle: string
    children: ReactNode
    footer: ReactNode
} & ComponentProps<typeof PDrawer.Root>) {
    return (
        <PDrawer.Root {...props}>
            <PDrawer.Trigger asChild>
                {trigger}
            </PDrawer.Trigger>
            <PDrawer.Backdrop />
            <PDrawer.Positioner>
                <PDrawer.Content>
                    <PDrawer.Header>
                        <PDrawer.Title>{headerTitle}</PDrawer.Title>
                        <PDrawer.CloseTrigger asChild position="absolute" top="3" right="4">
                            <IconButton variant="ghost">
                                <XIcon />
                            </IconButton>
                        </PDrawer.CloseTrigger>
                    </PDrawer.Header>
                    <PDrawer.Body>
                        {children}
                    </PDrawer.Body>
                    <PDrawer.Footer gap="3">
                        {footer}
                    </PDrawer.Footer>
                </PDrawer.Content>
            </PDrawer.Positioner>
        </PDrawer.Root>
    )
}