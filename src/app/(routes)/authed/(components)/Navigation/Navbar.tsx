"use client";
import Image from "next/image";
import { HStack, VStack } from "styled-system/jsx";
import { Button } from "~/components/ui/button"; 
import Logo from "public/logos/pickpockt long.svg";
import { useRouter } from "next/navigation";
import { motion, useCycle } from "framer-motion";
import { useEffect, useState } from "react";
import { MenuToggle } from "./NavToggle";
import { useDimensions } from "./use-dimension";
import { css } from "@/styled-system/css";
import { Navigation } from "./Navigation";
import { createClient } from "~/utils/supabase/client";

export function Navbar() {
    const router = useRouter();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [isOpen, toggleOpen] = useCycle(false, true);
    const { height } = useDimensions(containerRef);

    useEffect(() => {
        // if the navigation is open, disable scrolling
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
        document.body.style.overflowX = "hidden";
    }, [isOpen]);

    const sidebar = {
        open: (height = 1000) => ({
            clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 44px)`,
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2,
            },
        }),
        closed: {
            clipPath: "circle(30px at calc(100% - 40px) 44px)",
            transition: {
                delay: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        },
    };

    return (
        <HStack
            h="80px"
            w="full"
            p="24px"
            pr="50px"
            pt="30px"
            justifyContent="space-between"
        >
            <HStack
                w="full"
                justify={[
                    "start",
                    "start",
                    "start",
                    "center",
                    "center",
                    "center",
                ]}>
                <Image
                    src={Logo}
                    alt="Pickpockt"
                    width={175}
                    height={50}
                    onClick={() => router.push("/")}
                />
            </HStack>
            <HStack display={["none", "none", "none", "flex", "flex", "flex"]}>
                <Button
                    size="xl"
                    variant="ghost"
                    color="#333"
                    mr={["8vw", "8vw", "8vw", "0", "0", "0"]}
                    onClick={() => router.push("/authed")}
                >
                    Picks
                </Button>
                <Button
                    size="xl"
                    variant="ghost"
                    color="#333"
                    mr={["8vw", "8vw", "8vw", "0", "0", "0"]}
                    onClick={() => router.push("/authed/parlays")}
                >
                    Parlays
                </Button>
                <Button
                    size="xl"
                    variant="ghost"
                    color="#333"
                    mr={["8vw", "8vw", "8vw", "0", "0", "0"]}
                    onClick={() => router.push("/authed/bets")}
                >
                    Bet Sizing
                </Button>
            </HStack>
            <HStack
                w="fit-content"
                justify="end"
                display={["flex", "flex", "flex", "none", "none", "none"]}>
                <motion.nav
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    custom={height}
                    ref={setContainerRef}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "160vh",
                    }}>
                    <motion.div
                        variants={sidebar}
                        className={css({
                            position: "fixed",
                            top: 0,
                            right: 0,
                            width: "100%",
                            height: "160vh",
                            background: "#000",
                        })}
                    />
                    <Navigation />
                    <MenuToggle toggle={toggleOpen} />
                </motion.nav>
            </HStack>

            <HStack
                w="full"
                justify="center"
                display={["none", "none", "none", "flex", "flex", "flex"]}
            >
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
                    Log Out
                </Button>
            </HStack>
        </HStack>
    );
}
