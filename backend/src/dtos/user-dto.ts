import { IUser } from "../models/User";

export default class UserDto {
  first_name: string;
  second_name: string;
  email: string;
  isActivated: boolean;
  description: string;
  skills: string[];
  img_url: string | undefined;
  _id;

  constructor(model: IUser) {
    this._id = model._id;
    this.first_name = model.first_name;
    this.second_name = model.second_name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.description = model.description;
    this.skills = model.skills;
    this.img_url = model.img_url;
  }
}
