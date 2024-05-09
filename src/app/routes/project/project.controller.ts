import {Request, Router} from "express";
import {add, deleteById, edit, getAll, getById} from "./project.service";
import {TProject} from "./project.model";
import {authHandler} from "../../middleware/authHandler";

const router = Router()

router.get('/get', async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        const projects = await getById(req.query.id)
        res.json(projects ?? {})
    } catch (e) {
        next(e)
    }
})

router.get('/getAll', async (req, res, next) => {
    try {
        const projects = await getAll()
        res.json(projects)
    } catch (e) {
        next(e)
    }
})

router.post('/add', async (req: Request<{}, {}, TProject>, res, next) => {
    try {
        const newProject = await add(req.body)
        res.status(201).json(newProject)
    } catch (e) {
        next(e)
    }
})

router.put('/edit', async (req: Request<{}, {}, TProject>, res, next) => {
    try {
        const updateProject = await edit(req.body)
        res.json(updateProject)
    } catch (e) {
        next(e)
    }
})

router.delete('/delete', async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        const delProject = await deleteById(req.query.id)
        res.status(204).json(delProject)
    } catch (e) {
        next(e)
    }
})

export default router