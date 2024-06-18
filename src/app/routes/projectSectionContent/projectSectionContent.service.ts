import {TProject} from "../project/project.model";
import prisma from "../../../prisma/prisma-client";
import {TProjectSectionContent} from "./projectSectionContent.model";

export const getByProjectId = (projectId: TProject['id']) =>
    prisma.projectSectionContent.findMany({where: {
            projectId
        }})

export const add = (projectContent: Omit<TProjectSectionContent, 'id'>) =>
    prisma.projectSectionContent.create({data: {...projectContent}})

export const edit = ({id, ...projectContent}: TProjectSectionContent) =>
    prisma.projectSectionContent.update({
        where: {id},
        data: projectContent
    })

export const deleteById = (id: TProjectSectionContent['id']) =>
    prisma.projectSectionContent.delete({where: {id}})