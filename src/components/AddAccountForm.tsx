"use client";
import { useFormState } from "react-dom";
import SubmitButton from "./SubmitButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addAccount } from "@/app/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BROKER } from "@/lib/constants";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

const initialstate: { errors: any } = {
  errors: {},
};

const AddAccountForm = () => {
  const [formState, formAction] = useFormState(addAccount, initialstate);
  const { toast } = useToast();

  useEffect(() => {
    if (formState.errors.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: formState.errors.message,
      });
    }
  }, [formState.errors]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="name" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.name?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="broker">Select Broker</Label>
        <Select name="broker">
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Select Broker" />
          </SelectTrigger>
          <SelectContent>
            {BROKER.map((b) => (
              <SelectItem key={b} value={b} className="capitalize">
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-red-500 text-sm">
          {formState?.errors?.broker?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="userId">User Id</Label>
        <Input id="userId" name="userId" placeholder="User Id" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.userId?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="password">Passwrod</Label>
        <Input id="password" name="password" placeholder="Passwrod" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.password?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="totpcode">TOTP Code</Label>
        <Input id="totpcode" name="totpCode" placeholder="TOTP Code" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.totpCode?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="key">Key</Label>
        <Input id="key" name="key" placeholder="Key provide by Broker" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.key?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="secret">Secret</Label>
        <Input id="secret" name="secret" placeholder="secter / <userid>_U" />
        <span className="text-red-500 text-sm">
          {formState?.errors?.secret?.[0]}
        </span>
      </div>
      <div className="text-right">
        <SubmitButton text="Add" />
      </div>
    </form>
  );
};

export default AddAccountForm;
