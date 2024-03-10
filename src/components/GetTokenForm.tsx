"use client";
import React, { useEffect } from "react";
import { IconSubmitButton } from "./IconSubmitButton";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { getToken } from "@/app/action";
import { useToast } from "./ui/use-toast";

const initialState = {
  message: "",
};

const GetTokenForm = ({ id }: { id: string }) => {
  const [formState, formAction] = useFormState(getToken, initialState);
  const { toast } = useToast();
  useEffect(() => {
    if (formState?.message != "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: formState?.message,
      });
    }
  }, [formState?.message]);
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <IconSubmitButton size="sm" variant="outline">
        <FingerPrintIcon className="size-4" />
      </IconSubmitButton>
    </form>
  );
};

export default GetTokenForm;
