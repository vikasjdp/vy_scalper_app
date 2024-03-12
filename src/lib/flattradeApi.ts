import {
  SearchResponse,
  ErrorResponse,
  OrderResponse,
  OrderBook,
  CancelOrderResponse,
  PositionBook,
} from "@/types";

import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";
import * as OTPAuth from "otpauth";
import { IAccount } from "@/models/Account";
import { MOrder, OrderType } from "@/validation/order";

export class FlattradeApi implements VyApi {
  baseurl: string = "https://piconnect.flattrade.in/PiConnectTP";
  wsurl: string = "wss://piconnect.flattrade.in/PiConnectWSTp/";

  constructor(public uid: string, public token: string) {}

  static async getToken(account: IAccount) {
    try {
      const rsid = await fetch("https://authapi.flattrade.in/auth/session", {
        method: "POST",
        headers: { referer: "https://auth.flattrade.in/" },
      });
      const sid = await rsid.text();
      let totp = new OTPAuth.TOTP({
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: account.totpCode,
      });

      let otp = totp.generate();
      const hashPass = sha256(account.password);
      const coderes = await fetch("https://authapi.flattrade.in/ftauth", {
        method: "POST",
        body: JSON.stringify({
          UserName: account.userId,
          Password: hashPass,
          PAN_DOB: otp,
          App: "",
          ClientID: "",
          Key: "",
          APIKey: account.key,
          Sid: sid,
          Override: "",
          Source: "AUTHPAGE",
        }),
      });
      const resData = await coderes.json();
      if (resData.emsg != "") throw Error();

      const rdUrl = new URLSearchParams(resData.RedirectURL.split("?")[1]);
      const code = rdUrl.get("code");
      if (!code) throw Error();
      const response = await fetch(
        "https://authapi.flattrade.in/trade/apitoken",
        {
          method: "POST",
          body: JSON.stringify({
            api_key: account.key,
            request_code: code,
            api_secret: sha256(`${account.key}${code}${account.secret}`),
          }),
        }
      );
      //   if (response.status !== 200) throw new Error(await response.json());
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

  async modifyOrder(
    data: MOrder
  ): Promise<CancelOrderResponse | ErrorResponse> {
    data.uid = this.uid;
    data.actid = this.uid;
    return await this.postCall<CancelOrderResponse | ErrorResponse>(
      "/ModifyOrder",
      data
    );
  }

  async cancelOrder(
    norenordno: string
  ): Promise<CancelOrderResponse | ErrorResponse> {
    return await this.postCall<CancelOrderResponse | ErrorResponse>(
      "/CancelOrder",
      { norenordno, uid: this.uid }
    );
  }

  async getOrderBook(): Promise<OrderBook[] | ErrorResponse> {
    return await this.postCall<OrderBook[] | ErrorResponse>("/OrderBook", {
      uid: this.uid,
    });
  }

  async getPositionBook(): Promise<PositionBook[] | ErrorResponse> {
    return await this.postCall<PositionBook[] | ErrorResponse>(
      "/PositionBook",
      { uid: this.uid, actid: this.uid }
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
