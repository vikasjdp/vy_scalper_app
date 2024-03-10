"use server";

import dbConnect from "@/lib/dbConnect";
import Account, { IAccount } from "@/models/Account";
import User from "@/models/User";
import { AccountSchema } from "@/validation/account";
import { registerSchema } from "@/validation/register";
import mongoose, { MongooseError } from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { HydratedDocument } from "mongoose";
import { FinvasiaApi } from "@/lib/finvasiaApi";
import { revalidatePath } from "next/cache";

export async function registerUserAction(prevState: any, formdata: FormData) {
  try {
    const data = Object.fromEntries(formdata.entries());
    const validatedFields = registerSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        errors: {
          name: validatedFields.error.flatten().fieldErrors.name?.[0],
          email: validatedFields.error.flatten().fieldErrors.email?.[0],
          password: validatedFields.error.flatten().fieldErrors.password?.[0],
          cpassword: validatedFields.error.flatten().fieldErrors.cpassword?.[0],
        },
      };
    }

    await dbConnect();
    const user = await User.findOne({ email: validatedFields.data.email });
    if (user) {
      return {
        errors: {
          email: "Email allready regisered",
        },
      };
    }
    await User.create(validatedFields.data);
  } catch (error) {
    console.log(error);
    console.log(typeof error);
    return {
      errors: {},
    };
  }
  redirect("/login");
}

export async function addAccount(prevState: any, formdata: FormData) {
  try {
    const data = Object.fromEntries(formdata.entries());
    const validatedFields = AccountSchema.safeParse(data);
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        success: {},
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    //Todo:: Fix this any in code
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error();
    const id = session.user.id;
    await dbConnect();
    const account: HydratedDocument<IAccount> | null = await Account.findOne({
      userId: validatedFields.data.userId,
    });
    if (account) {
      return {
        errors: {
          message: "User id Already Added to an account",
        },
      };
    }
    const newaccount: HydratedDocument<IAccount> = await Account.create({
      user: id,
      ...validatedFields.data,
    });
  } catch (error: any) {
    if (error instanceof MongooseError) {
      console.log(error);
      return {
        errors: {
          message: "All field are required",
        },
      };
    }
    return {
      errors: {
        message: "Something went wrong",
      },
    };
  }
  redirect("/dashboard");
}

export async function getAccounts() {
  const session: any = await getServerSession(authOptions);
  const user = session?.user.id;
  await dbConnect();
  try {
    const accounts: HydratedDocument<IAccount>[] = await Account.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          user: {
            $toString: "$user",
          },
          name: 1,
          userId: 1,
          broker: 1,
          password: 1,
          totpCode: 1,
          secret: 1,
          key: 1,
          token: 1,
          tokenExp: 1,
        },
      },
    ]);
    return accounts;
  } catch (error) {
    console.log(error);
  }
}

export async function getAccount(id: string) {
  try {
    await dbConnect();
    const account: HydratedDocument<IAccount>[] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          user: {
            $toString: "$user",
          },
          name: 1,
          userId: 1,
          broker: 1,
          password: 1,
          totpCode: 1,
          secret: 1,
          key: 1,
          token: 1,
          tokenExp: 1,
        },
      },
    ]);
    if (account.length == 0) throw new Error();
    return account[0];
  } catch (e) {
    console.log(e);
  }
}

export async function editAccount(formState: any, formdata: FormData) {
  // Todo:: Add error handel
  const rawData = Object.fromEntries(formdata.entries());
  const validatedFields = AccountSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  await dbConnect();
  let account = await Account.findByIdAndUpdate(
    { _id: rawData.id },
    validatedFields.data
  );
  redirect("/dashboard");
}

export async function getToken(formState: any, formdata: FormData) {
  const id = formdata.get("id");
  await dbConnect();
  const account: HydratedDocument<IAccount> | null = await Account.findById(id);
  if (account?.broker === "finvasia") {
    const res = await FinvasiaApi.getToken(account);
    if (res.stat === "Ok") {
      account.token = res.susertoken;
      account.save();
    } else {
      return {
        message: res.emsg,
      };
    }
  } else {
    console.log("ftcose");
    return {
      message: "abni bana nahi hai",
    };
  }
  revalidatePath("/dashboard");
}
