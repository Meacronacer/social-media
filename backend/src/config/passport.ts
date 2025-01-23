import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import UserService from "../services/user-service";
import { IUser } from "../models/User";
dotenv.config();

// Настройка Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Function
    ) => {
      try {
        const user: IUser = await UserService.findOrCreateUser(profile);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//@ts-ignore
passport.serializeUser((user: IUser, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done: Function) => {
  UserService.findUserById(id)
    //@ts-ignore
    .then((user: IUser | null) => done(null, user))
    .catch((err: Error) => done(err));
});

export default passport;
