import { Button, Card, CardBody, CardHeader, H1, H1Description, H2 } from '@/components/gmac.ui';
import { Page } from '@/components/layout';
import { useVariantState } from '@/components/VariantToggle';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/coinflip/')({
  component: RouteComponent
});

type VALUE = 'HEADS' | 'TAILS';

function RouteComponent() {
  const { variant } = useVariantState();
  const [result, setResult] = useState<VALUE>();
  const [isFlipping, setIsFlipping] = useState(false);

  function flipCoin() {
    const random = Math.random();
    setIsFlipping(true);
    setTimeout(() => {
      setResult(random < 0.5 ? 'HEADS' : 'TAILS');
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
