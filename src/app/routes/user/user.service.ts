import prisma from "../../../prisma/prisma-client";
import {TUser} from "./user.model";
import {ApiError} from "../../middleware/errorHandler";
import bcrypt from "bcrypt";

export const getAll = () =>
    prisma.user.findMany({
        select: {
            id: true,
            login: true,
            email: true,
            projectIDs: true
        }
    })

export const getByLogin = async (login?: string) => {
    try {
        const user = await prisma.user.findUnique({where: {login}})
        if (!user)
            throw ApiError.BadRequest('Not found user')

        const {password, ...userData} = user
        return userData
    } catch (e) {
        throw ApiError.BadRequest(e)
    }
}
export const add = async (user: TUser) => {
    const hashPassword = await bcrypt.hash(user.password, 2)
    return prisma.user.create({data: {...user, password: hashPassword}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })
}

export const edit = async ({id, ...rest}: TUser) => {
    const updateObj: Omit<TUser, 'id'> = {...rest}

    if ('password' in rest)
        updateObj.password = await bcrypt.hash(rest.password, 2)


    return prisma.user.update({
            where: {id},
            data: updateObj
        })
        .catch(err => {
            throw ApiError.BadRequest(err)
        })
}

export const deleteByLogin = (login?: string) => {
    const tokenDeleteMany = prisma.token.deleteMany({
        where: {user: {login}}
    })
    const userDelete = prisma.user
        .delete({where: {login}})

    return prisma.$transaction([tokenDeleteMany, userDelete])
}