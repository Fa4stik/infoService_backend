import {Router, Request} from "express";
import {TProject} from "../project/project.model";
import {getByProjectId, edit, add, deleteById} from "./projectSectionContent.service";
import {TProjectSectionContent} from "./projectSectionContent.model";

const router = Router()

router.get('/getByProjectId', async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        const projectsContent = await getByProjectId(req.query.id)
        res.json(projectsContent)
    } catch (e) {
        next(e)
    }
})

router.post('/add', async (req: Request<{}, {}, Omit<TProjectSectionContent, 'id'>>, res, next) => {
    try {
        const newProject = await add(req.body)
        res.status(201).json(newProject)
    } catch (e) {
        next(e)
    }
})

router.put('/edit', async (req: Request<{}, {}, TProjectSectionContent>, res, next) => {
    try {
        const updateProject = await edit(req.body)
        res.status(201).json(updateProject)
    } catch (e) {
        next(e)
    }
})

router.delete('/delete', async (req: Request<{}, {}, Pick<TProjectSectionContent, 'id'>>, res, next) => {
    try {
        const deleteProject = await deleteById(req.body.id)
        res.status(204).json(deleteProject)
    } catch (e) {
        next(e)
    }
})

export default router