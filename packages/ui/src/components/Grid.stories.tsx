import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid";
import { Box } from "./Box";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: { type: "number", min: 1, max: 12 }
    },
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const DefaultGrid: Story = {
  args: {
    columns: 3,
    gap: "md",
    children: (
      <>
        <Box className="bg-primary text-primary-foreground p-md rounded-md text-center">
          العمود 1 | Col 1
        </Box>
        <Box className="bg-secondary text-secondary-foreground p-md rounded-md border text-center">
          العمود 2 | Col 2
        </Box>
        <Box className="bg-muted text-muted-foreground p-md rounded-md text-center">
          العمود 3 | Col 3
        </Box>
        <Box className="bg-accent text-accent-foreground p-md rounded-md text-center">
          العمود 4 | Col 4
        </Box>
        <Box className="bg-success text-success-foreground p-md rounded-md text-center">
          العمود 5 | Col 5
        </Box>
        <Box className="bg-destructive text-destructive-foreground p-md rounded-md text-center">
          العمود 6 | Col 6
        </Box>
      </>
    )
  }
};
