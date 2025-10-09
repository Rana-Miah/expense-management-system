"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./card";
import { Badge } from "./badge";
import { CardWrapper } from "../card-wrapper";
import Link from "next/link";
import { Button } from "./button";
import { BankSelectValue } from "@/drizzle/type";
import { ModalTriggerButton } from "../modal-trigger-button";
import { MODAL_TYPE } from "@/constant";



type Card = BankSelectValue & {
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
    <CardWrapper
      title="Banks"
      description="banks"
      headerElement={
        <ModalTriggerButton
          label="Bank"
          modalType={MODAL_TYPE.BANK_ACCOUNT}
        />
      }
    >
      <div className="relative h-60 w-full md:h-60 md:w-96">
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
                  if (!selected) return newCards;
                  newCards.unshift(selected); // put it at the front
                  return newCards;
                });
              }}
            >
              <CardWrapper
                title={card.name}
                description={card.balance.toString()}
                headerElement={<Badge variant={card.isActive ? 'success' : 'destructive'} className="">{card.isActive ? 'Active' : 'Deactivated'}</Badge>}
              >
                <div className="flex items-center justify-between">
                  <div>{card.lban}</div>
                  <Link href={`/accounts/${card.id}`}>
                    <Button variant={'secondary'} className="rounded-full border px-4 w-full">
                      Let&#39;s go
                    </Button>
                  </Link>
                </div>
              </CardWrapper>
            </motion.div>
          );
        })}
      </div>
    </CardWrapper>
  );
};
