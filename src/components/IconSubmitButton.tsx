"use client";
import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const IconSubmitButton = ({
  children,
  size,
  variant,
}: {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon" | null;
  variant?:
    | "default"
    | "link"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | null;
}) => {
  const { pending } = useFormStatus();
  if (pending) {
    return (
      <div className="flex w-12 justify-center items-center">
        <ArrowPathIcon className="size-4 animate-spin" />
      </div>
    );
  }
  return (
    <Button aria-disabled={pending} size={size} variant={variant}>
      {children}
    </Button>
  );
};
