import {TUser} from "../user/user.model";
import {Prisma} from "@prisma/client";

export type TUserData = Omit<TUser, "password">
export type TUserLogin = Pick<TUser, "email" | "password">