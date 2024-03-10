import { SearchResponse, ErrorResponse, OrderResponse } from "@/types";

import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";
import * as OTPAuth from "otpauth";
import { IAccount } from "@/models/Account";
import { OrderType } from "@/validation/order";

export class FinvasiaApi implements VyApi {
  baseurl: string = "https://api.shoonya.com/NorenWClientTP";
  wsurl: string = "wss://api.shoonya.com/NorenWSTP/";

  constructor(public uid: string, public token: string) {}

  static async getToken(account: IAccount) {
    let totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: account.totpCode,
    });

    let otp = totp.generate();
    try {
      const response = await fetch(
        "https://api.shoonya.com/NorenWClientTP/QuickAuth",
        {
          method: "POST",
          body: `jData=${JSON.stringify({
            apkversion: "1.0.0",
            uid: account.userId,
            pwd: sha256(account.password),
            factor2: otp,
            vc: account.secret,
            appkey: sha256(`${account.userId}|${account.key}`),
            imei: "abcd123",
            source: "API",
          })}`,
        }
      );
      // if (response.status !== 200) throw new Error(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  getWsUrl(): string {
    return this.wsurl;
  }

  async searchScript(
    stext: string,
    exch: string
  ): Promise<SearchResponse | ErrorResponse> {
    const payload = {
      uid: this.uid,
      stext,
      exch,
    };

    return await this.postCall("/SearchScrip", payload);
  }

  async placeOrder(data: OrderType): Promise<OrderResponse | ErrorResponse> {
    data.uid = this.uid;
    data.actid = this.uid;
    return await this.postCall<OrderResponse | ErrorResponse>(
      "/PlaceOrder",
      data
    );
  }

  private async postCall<T>(endpoint: string, payload: {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${endpoint}`, {
        headers: { "Content-Type": "text/plain" },
        method: "POST",
        body: `jData=${JSON.stringify(payload)}&jKey=${this.token}`,
      });
      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      console.log(error);
      // console.log(error.message);
      throw new Error(error.message);
    }
  }
}
