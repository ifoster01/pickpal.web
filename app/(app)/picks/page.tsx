"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Fight {
  id: string;
  fighter1: {
    name: string;
    odds: number;
    probability: number;
    bookOdds: number;
    bookProbability: number;
    image: string;
  };
  fighter2: {
    name: string;
    odds: number;
    probability: number;
    bookOdds: number;
    bookProbability: number;
    image: string;
  };
  discrepancy: "low" | "medium" | "high";
}

const fights: Fight[] = [
  {
    id: "1",
    fighter1: {
      name: "Shavkat Rakhmonov",
      odds: -154,
      probability: 0.61,
      bookOdds: -375,
      bookProbability: 0.79,
      image: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?auto=format&fit=crop&q=80&w=200&h=200"
    },
    fighter2: {
      name: "Ian Machado Garry",
      odds: 154,
      probability: 0.39,
      bookOdds: 295,
      bookProbability: 0.21,
      image: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?auto=format&fit=crop&q=80&w=200&h=200"
    },
    discrepancy: "medium"
  }
];

export default function PicksPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Model Picks</h1>
        <Select defaultValue="UFC">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select League" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UFC">UFC</SelectItem>
            <SelectItem value="Bellator">Bellator</SelectItem>
            <SelectItem value="PFL">PFL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {fights.map((fight) => (
          <motion.div
            key={fight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fighter 1 */}
                <div className="flex items-center space-x-4">
                  <img
                    src={fight.fighter1.image}
                    alt={fight.fighter1.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{fight.fighter1.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {fight.fighter1.odds}
                    </p>
                  </div>
                </div>

                {/* VS and Predictions */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold text-muted-foreground mb-4">
                    vs
                  </span>
                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Model Prediction</span>
                        <span>{Math.round(fight.fighter1.probability * 100)}% - {Math.round(fight.fighter2.probability * 100)}%</span>
                      </div>
                      <Progress value={fight.fighter1.probability * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sports Book</span>
                        <span>{Math.round(fight.fighter1.bookProbability * 100)}% - {Math.round(fight.fighter2.bookProbability * 100)}%</span>
                      </div>
                      <Progress value={fight.fighter1.bookProbability * 100} />
                    </div>
                  </div>
                </div>

                {/* Fighter 2 */}
                <div className="flex items-center justify-end space-x-4">
                  <div className="text-right">
                    <h3 className="font-semibold">{fight.fighter2.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      +{fight.fighter2.odds}
                    </p>
                  </div>
                  <img
                    src={fight.fighter2.image}
                    alt={fight.fighter2.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Discrepancy Indicator */}
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-muted px-4 py-2 rounded-full flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {fight.fighter2.name}&apos;s odds have a {fight.discrepancy} discrepancy from the book
                  </span>
                  <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        fight.discrepancy === "low"
                          ? "bg-green-500 w-1/3"
                          : fight.discrepancy === "medium"
                          ? "bg-yellow-500 w-2/3"
                          : "bg-red-500 w-full"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Add to Parlay
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}