"use client";
import { Account } from "@/models/Account";
import React from "react";
import SubmitButton from "./SubmitButton";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BROKER } from "@/lib/constants";
import { useFormState } from "react-dom";
import { editAccount } from "@/app/action";

const EditAccountForm = ({ account, id }: { account: Account; id: string }) => {
  const [formState, formAction] = useFormState(editAccount, null);
  return (
    <form action={formAction} className="space-y-4">
      <Input type="hidden" name="userId" value={account.userId} />
      <Input type="hidden" name="id" value={id} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={account.name}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.name?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="broker">Select Broker</Label>
        <Select name="broker" defaultValue={account.broker}>
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
        {/* <span className="text-red-500 text-sm">
      {formState?.errors?.broker?.[0]}
    </span> */}
      </div>

      <div>
        <Label htmlFor="password">Passwrod</Label>
        <Input
          id="password"
          name="password"
          defaultValue={account.password}
          placeholder="Passwrod"
        />
        {/* <span className="text-red-500 text-sm">
      {formState?.errors?.password?.[0]}
    </span> */}
      </div>
      <div>
        <Label htmlFor="totpcode">TOTP Code</Label>
        <Input
          id="totpcode"
          name="totpCode"
          defaultValue={account.totpCode}
          placeholder="TOTP Code"
        />
        {/* <span className="text-red-500 text-sm">
      {formState?.errors?.totpCode?.[0]}
    </span> */}
      </div>
      <div>
        <Label htmlFor="key">Key</Label>
        <Input
          id="key"
          name="key"
          defaultValue={account.key}
          placeholder="Key provide by Broker"
        />
        {/* <span className="text-red-500 text-sm">
      {formState?.errors?.key?.[0]}
    </span> */}
      </div>
      <div>
        <Label htmlFor="secret">Secret</Label>
        <Input
          id="secret"
          name="secret"
          defaultValue={account.secret}
          placeholder="secter / <userid>_U"
        />
        {/* <span className="text-red-500 text-sm">
      {formState?.errors?.secret?.[0]}
    </span> */}
      </div>
      <div className="text-right">
        <SubmitButton text="Update" />
      </div>
    </form>
  );
};

export default EditAccountForm;
