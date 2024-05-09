import {Router, Request} from "express";
import {getAll, edit, add, deleteById} from './projectSection.service'
import {TProjectSection} from "./projectSection.model";

const router = Router()

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