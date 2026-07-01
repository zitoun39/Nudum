import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./Stack";
import { Box } from "./Box";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "col", "row-reverse", "col-reverse"]
    },
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"]
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"]
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    direction: "col",
    gap: "md",
    children: (
      <>
        <Box className="bg-primary text-primary-foreground p-md rounded-md">العنصر 1 | Item 1</Box>
        <Box className="bg-secondary text-secondary-foreground p-md rounded-md border">
          العنصر 2 | Item 2
        </Box>
        <Box className="bg-muted text-muted-foreground p-md rounded-md">العنصر 3 | Item 3</Box>
      </>
    )
  }
};

export const Horizontal: Story = {
  args: {
    direction: "row",
    gap: "sm",
    children: (
      <>
        <Box className="bg-primary text-primary-foreground p-md rounded-md">1</Box>
        <Box className="bg-secondary text-secondary-foreground p-md rounded-md border">2</Box>
        <Box className="bg-muted text-muted-foreground p-md rounded-md">3</Box>
      </>
    )
  }
};
