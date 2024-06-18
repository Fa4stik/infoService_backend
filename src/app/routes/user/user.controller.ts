import {Request, Router} from "express";
import {TUser} from "./user.model";
import {add, deleteByLogin, edit, getByLogin, getAll} from './user.service'

const router = Router()

router.get('/getAll', async (req, res, next) => {
    try {
        const users = await getAll()
        res.json(users)
    } catch (e) {
        next(e)
    }
})

router.get('/get', async (req: Request<{}, {}, {}, Pick<TUser, 'login'>>, res, next) => {
    try {
        const user = await getByLogin(req.query.login)
        res.json(user ?? {})
    } catch (e) {
        next(e)
    }
})

router.post('/add', async (req: Request<{}, {}, TUser>, res, next) => {
    try {
        const newUser = await add(req.body)
        res.status(201).json(newUser)
    } catch (e) {
        next(e)
    }
})

router.put('/edit', async (req: Request<{}, {}, TUser>, res, next) => {
    try {
        const updateUser = await edit(req.body)
        res.json(updateUser)
    } catch (e) {
        next(e)
    }
})

router.delete('/delete', async (req: Request<{}, {}, {}, Pick<TUser, 'login'>>, res, next) => {
    try {
        const userDelete = await deleteByLogin(req.query.login)
        res.status(204).json(userDelete)
    } catch (e) {
        next(e)
    }
})

export default router