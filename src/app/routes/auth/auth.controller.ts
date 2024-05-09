import {Router, Request} from "express";
import {TUserLogin} from "./auth.model";
import {login, logout, updateAccessToken} from "./auth.service";

const router = Router()

router.post('/login', async (req: Request<{}, {}, TUserLogin>, res, next) => {
    try {
        const loginData = await login(req.body)
        res.cookie('refreshToken', loginData.refreshToken, {httpOnly: true, maxAge: 30*24*60*60*1000})
        res.header('authorization', 'Bearer ' + loginData.accessToken)
        res.json(loginData)
    } catch (e) {
        next(e)
    }
})

router.post('/refresh', async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const accessToken = await updateAccessToken(refreshToken)
        res.json({accessToken})
    } catch (e) {
        next(e)
    }
})

router.delete('/logout', async (req: Request<{}, {}, TUserLogin>, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const logoutUser = await logout(refreshToken)
        res.removeHeader('authorization')
        res.clearCookie('refreshToken')
        res.status(204).json(logoutUser)
    } catch (e) {
        next(e)
    }
})

export default router