import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

const Path = (props: React.ComponentProps<typeof motion.path>) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="#FFF"
        strokeLinecap="round"
        {...props}
    />
);

export const MenuToggle = ({ toggle }: { toggle: any }) => (
    <Button
        position="fixed"
        top={"26px"}
        right={"14px"}
        variant="ghost"
        onClick={toggle}
        borderRadius="full"
        zIndex={101}>
        <svg
            width="23"
            height="23"
            viewBox="0 0 23 23">
            <Path
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                }}
            />
        </svg>
    </Button>
);
