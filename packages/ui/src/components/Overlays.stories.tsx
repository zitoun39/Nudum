import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  AlertDialog
} from "./Dialog";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { Button } from "./Button";
import { Stack } from "./Stack";

const meta: Meta = {
  title: "Overlays/Floating",
  tags: ["autodocs"]
};

export default meta;

export const DialogDemo: StoryObj = {
  render: () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your user account profile details here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-md text-sm">[Profile Configuration Input Fields Go Here]</div>
          <DialogFooter>
            <Button variant="primary">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
};

export const AlertDialogDemo: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          Delete Account
        </Button>
        <AlertDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your database records."
          confirmText="Yes, delete"
          variant="destructive"
          onConfirm={() => console.log("Account deleted")}
        />
      </>
    );
  }
};

export const PopoverDemo: StoryObj = {
  render: () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">View Settings</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Stack gap="xs">
            <h5 className="font-semibold text-sm">Overlay Settings</h5>
            <p className="text-xs text-muted-foreground">Modify floating container bounds.</p>
          </Stack>
        </PopoverContent>
      </Popover>
    );
  }
};

export const TooltipDemo: StoryObj = {
  render: () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover Me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Helpful info text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};
