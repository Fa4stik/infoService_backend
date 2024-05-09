import {TUser} from "../user/user.model";

export type TUserData = Omit<TUser, "password">
export type TUserLogin = Pick<TUser, "login" | "password">