import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Input, PasswordInput, NumberInput } from "./Input";
import { Checkbox } from "./Checkbox";
import { Switch } from "./Switch";
import { Select } from "./Select";
import { Stack } from "./Stack";
import { Label } from "./Form";

const meta: Meta = {
  title: "Inputs/Controls",
  tags: ["autodocs"]
};

export default meta;

export const AllControls: StoryObj = {
  render: () => {
    const [num, setNum] = React.useState(5);
    return (
      <Stack gap="lg" className="max-w-sm border p-md rounded-md">
        <Stack gap="xs">
          <Label>Base Input</Label>
          <Input placeholder="Enter username..." />
        </Stack>

        <Stack gap="xs">
          <Label>Password Input</Label>
          <PasswordInput placeholder="Enter password..." />
        </Stack>

        <Stack gap="xs">
          <Label>Number Stepper</Label>
          <NumberInput value={num} onChange={setNum} min={0} max={10} />
        </Stack>

        <Stack gap="xs">
          <Label>Dropdown Selector</Label>
          <Select
            options={[
              { label: "Option A", value: "a" },
              { label: "Option B", value: "b" }
            ]}
          />
        </Stack>

        <div className="flex items-center gap-sm">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>

        <div className="flex items-center gap-sm">
          <Switch id="dark-mode" />
          <Label htmlFor="dark-mode">Enable Dark Mode</Label>
        </div>

        <Button variant="primary">Submit Form</Button>
      </Stack>
    );
  }
};
