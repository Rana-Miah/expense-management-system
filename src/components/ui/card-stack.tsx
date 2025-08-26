"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { CardWrapper } from "../card-wrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";


let interval: any;

type Card = typeof dummyBanks[0] & {
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 35;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute w-full"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            onClick={() => {
              setCards((prev) => {
                const newCards = [...prev];
                const [selected] = newCards.splice(index, 1); // remove clicked card
                newCards.unshift(selected); // put it at the front
                return newCards;
              });
            }}
          >
            <CardWrapper
              title={card.name}
              description={card.balance.toString()}
              headerElement={<Badge variant={card.isActive ? 'success' : 'destructive'} className="">{card.isActive ? 'Active' : 'Deactived'}</Badge>}
            >
              <div className="flex items-center justify-between">
                <div>{card.lban}</div>
                <Link href={`/${card.id}`}>
                  <Button variant={'secondary'} className="rounded-full border px-4 w-full">
                    Let's go
                  </Button>
                </Link>
              </div>
            </CardWrapper>
          </motion.div>
        );
      })}
    </div>
  );
};
