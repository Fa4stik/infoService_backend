import prisma from "../../../prisma/prisma-client";
import {TProjectSection} from "./projectSection.model";
import {ApiError} from "../../middleware/errorHandler";

export const getAll = () =>
    prisma.projectSection.findMany({where: {}})
        .catch(err => {
            throw err
        })

export const add = (projectSection: TProjectSection) =>
    prisma.projectSection.create({data: projectSection})
        .catch(err => {
            throw err
        })

export const edit = ({id, ...rest}: TProjectSection) =>
    prisma.projectSection.update({
        where: {id},
        data: rest
    })
    .catch(err => {
        throw ApiError.BadRequest(err)
    })

export const deleteById = (id?: string) =>
    prisma.projectSection.delete({where: {id}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })
