import { createFileRoute } from "@tanstack/react-router";
import {
  Page,
  PageHeader,
  PageHeading,
  PageSection,
} from "@/components/layout";
import { H1, H1Description, H2 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { useState } from "react";

export const Route = createFileRoute("/coinflip/")({
  component: RouteComponent,
});

type VALUE = "HEADS" | "TAILS";

function RouteComponent() {
  const [result, setResult] = useState<VALUE>();
  const [isFlipping, setIsFlipping] = useState(false);

  function flipCoin() {
    const random = Math.random();
    setIsFlipping(true);
    setTimeout(() => {
      setResult(random < 0.5 ? "HEADS" : "TAILS");
      setIsFlipping(false);
    }, 800);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Coin Flip</H1>
          <H1Description>flip the coin</H1Description>
        </PageHeading>
      </PageHeader>

      <PageSection>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
          <Button onClick={flipCoin}>Heads or Tails?</Button>

          {isFlipping && <H2>Flipping...</H2>}

          {result && !isFlipping && <H2>{result}</H2>}
        </div>
      </PageSection>
    </Page>
  );
}
