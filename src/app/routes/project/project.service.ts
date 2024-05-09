import prisma from "../../../prisma/prisma-client";
import {ApiError} from "../../middleware/errorHandler";
import {TProject} from "./project.model";

export const getById = (id?: string) =>
    prisma.project.findUnique({where: {id}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })

export const getAll = () =>
    prisma.project.findMany()
        .catch(err => {
            throw err
        })

export const add = (project: TProject) =>
    prisma.project.create({data: project})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })

export const edit = ({id, ...rest}: TProject) =>
    prisma.project.update({
        where: {id},
        data: rest
    })
    .catch(err => {
        throw ApiError.BadRequest(err)
    })

export const deleteById = (id?: string) =>
    prisma.project.delete({where: {id}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })