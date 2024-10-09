import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
    open: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

export const Navigation = () => {
    return (
        <motion.ul
            variants={variants}
            style={{
                position: "fixed", // Fixed position to cover the viewport
                top: "5%",
                left: "40%", // Center horizontally
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // Center items in the flex container
                listStyleType: "none",
                padding: 0,
            }}>
            {navItems.map((item, i) => (
                <MenuItem
                    label={item.label}
                    link={item.href}
                    key={i}
                />
            ))}
        </motion.ul>
    );
};

const navItems = [
    {
        label: "Model's Picks",
        href: "/authed",
    },
    {
        label: "Parlay Generator",
        href: "/authed/parlays",
    },
    {
        label: "Bet Calculator",
        href: "/authed/bets",
    },
    {
        label: "Log Out",
        href: "/auth/login",
    },
];
