import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Добавляем поле user, которое соответствует интерфейсу IUser
    }
  }
}
