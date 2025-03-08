import { Meta, StoryObj } from "@storybook/react";
import Example from "./example.tsx";
import "../../index.ts"
import "../../index.css"
const meta: Meta<typeof Example> = {
  title: "Example",
  component: Example,
  tags: ["autodocs"],
  argTypes: {
    className: { 
      control: "text", 
      description: "classe for styling",
      defaultValue: "text-centered text-green-600",
    },
    label: { control: "text" },
    onClick: { action: "clicked" },
  },
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    className:"text-green-600 text-center",
    label: "testing",
    onClick: () => console.log("click me!"),
  },
};
