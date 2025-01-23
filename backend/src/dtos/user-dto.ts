import { IUser } from "../models/User";

export default class UserDto {
  first_name: string;
  second_name: string;
  email: string;
  isActivated: boolean;
  img_url: string | undefined;
  id;

  constructor(model: IUser) {
    this.id = model.id;
    this.first_name = model.first_name;
    this.second_name = model.second_name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.img_url = model.img_url;
  }
}
