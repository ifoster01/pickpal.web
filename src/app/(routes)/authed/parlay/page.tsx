"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeague } from "@/providers/LeagueProvider";

type League = 'UFC' | 'NFL';

export default function ParlayPage() {
    const { league, setLeague } = useLeague();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <div className="flex justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Parlay Builder</h1>
                <Select value={league} onValueChange={(value: League) => setLeague(value)}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue placeholder="Select League" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="UFC">UFC</SelectItem>
                        <SelectItem value="NFL">NFL</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card className="w-full p-6">
                <p className="text-muted-foreground">Build your parlay by adding picks from the Picks page.</p>
            </Card>
        </motion.div>
    );
}