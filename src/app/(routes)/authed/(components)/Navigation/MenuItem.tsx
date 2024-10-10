import { useRouter } from "next/navigation";
import * as React from "react";
import { motion } from "framer-motion";
import { Text } from "~/components/ui/text";
import { VStack } from "@/styled-system/jsx";
import { Button } from "~/components/ui/button";
import { WandSparklesIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const variants = {
    open: {
        x: 0,
        opacity: 1,
        display: "block",
        transition: {
            x: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        x: 50,
        opacity: 0,
        display: "none",
        transition: {
            x: { stiffness: 1000 },
        },
    },
};

export const MenuItem = ({ label, link }: { label: string; link: string }) => {
    const router = useRouter();
    return (
        <motion.li
            variants={variants}
            style={{
                width: "100%",
            }}
        >
            <VStack
                w="screen"
                pr={["80vw", "50vw"]}
                py="1vh"
            >
                {label === "Log Out" && (
                    <Button
                        size="xl"
                        fontWeight="semibold"
                        variant="solid"
                        borderRadius="full"
                        bg="linear-gradient(145deg, #1A1A1A, #000000)"
                        color="white"
                        border="1px solid #aaa"
                        _hover={{
                            bg: "linear-gradient(145deg, #000000, #1A1A1A)",
                            boxShadow: "0 0 10px #aaa",
                        }}
                        _active={{
                            bg: "linear-gradient(145deg, #1A1A1A, #000000)",
                        }}
                        onClick={() => {
                            const supabase = createClient();
                            supabase.auth.signOut();
                        }}>
                        {label}
                    </Button>
                )}
                {label !== "Log Out" && (
                    <Button
                        variant="outline"
                        cursor="pointer"
                        color="white"
                        border='1px solid #aaa'
                        w='full'
                        onClick={() => router.push(link)}
                    >
                        <VStack w="full" justify="center" alignItems="center">
                            <Text>{label}</Text>
                        </VStack>
                    </Button>
                )}
            </VStack>
        </motion.li>
    );
};
