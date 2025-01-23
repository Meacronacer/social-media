import { Iuser } from "./user";

export interface IauthResponse {
  accessToken: string;
  refreshToken: string;
  user: Iuser;
}
