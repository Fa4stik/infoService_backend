import prisma from "../../../prisma/prisma-client";
import * as fs from "node:fs";

const assetsPath = '/home/nodejs_proj/infoService_backend/src/assets/'

type MultFile = Express.Multer.File
type TFiles = {[fieldname: string]: MultFile[];} | MultFile[] | undefined

export const saveFiles = (projectId: string | undefined, files: TFiles) => {
    if (!projectId || !files)
        return

    Object.entries(files).forEach(([key, file]) => {
        fs.writeFile(
            assetsPath + `${projectId}_${file.filename}`,
            file.buffer,
            (err) => {}
        )
    })
}

export const getByProjectId = (projectId: string) =>
    prisma.gallery.findMany({
        where: {projectId},
    })