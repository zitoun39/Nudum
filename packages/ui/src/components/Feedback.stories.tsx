import type { Meta, StoryObj } from "@storybook/react";
import { Alert, Progress, Spinner, Skeleton, EmptyState } from "./Feedback";
import { Button } from "./Button";
import { Stack } from "./Stack";

const meta: Meta = {
  title: "Feedback/Notifications",
  tags: ["autodocs"]
};

export default meta;

export const AllFeedback: StoryObj = {
  render: () => {
    return (
      <Stack gap="lg" className="max-w-md">
        <Alert variant="success" title="Success Alert">
          Action completed successfully.
        </Alert>

        <Alert variant="warning" title="Warning Alert">
          Please check the connection configuration.
        </Alert>

        <Stack gap="xs">
          <span className="text-xs font-medium">Operation Progress</span>
          <Progress value={65} />
        </Stack>

        <div className="flex items-center gap-sm">
          <Spinner />
          <span className="text-sm">Loading process details...</span>
        </div>

        <Stack gap="xs" className="border p-md rounded-md">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </Stack>

        <EmptyState
          title="No samples found"
          description="There are no lab specimens registered for this day."
          action={<Button size="sm">Register Sample</Button>}
        />
      </Stack>
    );
  }
};
