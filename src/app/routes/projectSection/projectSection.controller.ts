import {Router, Request} from "express";
import {getAll, edit, add, deleteById, getByProjectId} from './projectSection.service'
import {TProjectSection} from "./projectSection.model";
import {TProject} from "../project/project.model";

const router = Router()

router.get('/getByProjectId', async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        const sections = await getByProjectId(req.query.id ?? '')
        res.json(sections)
    } catch (e) {
        next(e)
    }
})

router.get('/getAll', async (req, res, next) => {
    try {
        const sections = await getAll()
        res.json(sections)
    } catch (e) {
        next(e)
    }
})

router.post('/add', async (req: Request<{}, {}, TProjectSection>, res, next) => {
    try {
        const newProject = await add(req.body)
        res.status(201).json(newProject)
    } catch (e) {
        next(e)
    }
})

router.put('/edit', async (req: Request<{}, {}, TProjectSection>, res, next) => {
    try {
        const updateProject = await edit(req.body)
        res.json(updateProject)
    } catch (e) {
        next(e)
    }
})

router.delete('/delete', async (req: Request<{}, {}, {}, Pick<TProjectSection, 'id'>>, res, next) => {
    try {
        const deleteProject = deleteById(req.query.id)
        res.status(204).json(deleteProject)
    } catch (e) {
        next(e)
    }
})

export default router