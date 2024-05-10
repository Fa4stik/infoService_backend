import {Request, Router} from "express";
import {TUser} from "./user.model";
import {add, deleteByLogin, edit, getByLogin} from './user.service'

const router = Router()

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
        const deleteUser = deleteByLogin(req.query.login)
        res.status(204).json(deleteUser)
    } catch (e) {
        next(e)
    }
})

export default router