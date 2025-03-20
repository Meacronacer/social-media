export interface Iuser extends IAuthor {
  email: string | undefined;
  description: string;
  skills: string[];
  followers: IAuthor[];
  following: IAuthor[];
  postsCount: number;
  followingCount: number;
}

export interface IAuthor {
  _id: string | undefined;
  first_name: string | undefined;
  second_name: string | undefined;
  img_url?: string | undefined;
}
