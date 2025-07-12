import { IUser } from "../models/User";
export const getUpdatedUser = (user: IUser) => {
  const {
    _id,
    first_name,
    second_name,
    img_url,
    email,
    description,
    skills,
    followers,
    followingCount,
    postsCount,
  } = user;

  return {
    _id,
    first_name,
    second_name,
    img_url,
    email,
    description,
    skills,
    followers,
    followingCount,
    postsCount,
  };
};
