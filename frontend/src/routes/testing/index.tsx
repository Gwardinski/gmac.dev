import { createFileRoute } from "@tanstack/react-router";
import {
  Page,
  PageHeader,
  PageHeading,
  PageSection,
} from "@/components/layout";
import { H1, H1Description } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/testing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Testing</H1>
          <H1Description>bla bla bla</H1Description>
        </PageHeading>
      </PageHeader>

      <PageSection>
        <div className="flex flex-col gap-4">
          <form>
            <Input
              type="text"
              placeholder="Name"
              className="text-sm sm:text-sm md:text-sm"
            />
          </form>
        </div>
      </PageSection>
    </Page>
  );
}
