import { Button, Card, CardBody, CardHeader, H1, H1Description, H2 } from '@/components/gmac.ui';
import { Page } from '@/components/layout';
import { useVariantState } from '@/components/VariantToggle';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/coinflip/')({
  component: RouteComponent
});

type VALUE = 'HEADS' | 'TAILS' | 'FELL OFF TABLE' | 'LANDED ON SIDE';

const SIDE_CHANCE = 0.002;
const FELL_OFF_CHANCE = 0.06;
// Heads and tails split the rest evenly (46.9% each)
const HEADS_CHANCE = (1 - SIDE_CHANCE - FELL_OFF_CHANCE) / 2;

function getFlipResult(random: number): VALUE {
  if (random < SIDE_CHANCE) return 'LANDED ON SIDE';
  if (random < SIDE_CHANCE + FELL_OFF_CHANCE) return 'FELL OFF TABLE';
  if (random < SIDE_CHANCE + FELL_OFF_CHANCE + HEADS_CHANCE) return 'HEADS';
  return 'TAILS';
}

function RouteComponent() {
  const { variant } = useVariantState();
  const [result, setResult] = useState<VALUE>();
  const [isFlipping, setIsFlipping] = useState(false);

  function flipCoin() {
    const random = Math.random();
    setIsFlipping(true);
    setTimeout(() => {
      setResult(getFlipResult(random));
      setIsFlipping(false);
    }, 800);
  }

  return (
    <Page>
      <Card as="header" variant={variant}>
        <CardHeader column>
          <H1>CoinFlip</H1>
          <H1Description>Flip the coin....</H1Description>
        </CardHeader>
      </Card>

      <Card variant={variant}>
        <CardBody>
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
            <Button onClick={flipCoin}>Heads or Tails?</Button>

            {isFlipping && <H2>Flipping...</H2>}

            {result && !isFlipping && <H2>{result}</H2>}
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}
