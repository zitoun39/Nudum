import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { Switch } from "./Switch";
import { Badge } from "./DataDisplay";
import { Alert } from "./Feedback";

describe("Core UI Components", () => {
  test("renders Button correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("renders Input correctly", () => {
    render(<Input placeholder="Type here..." readOnly />);
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });

  test("renders Textarea correctly", () => {
    render(<Textarea placeholder="Describe..." readOnly />);
    expect(screen.getByPlaceholderText("Describe...")).toBeInTheDocument();
  });

  test("renders Checkbox correctly", () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  test("renders Switch correctly", () => {
    render(<Switch aria-label="toggle" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  test("renders Badge correctly", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders Alert correctly", () => {
    render(<Alert title="Warning">Be careful</Alert>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Be careful")).toBeInTheDocument();
  });
});
