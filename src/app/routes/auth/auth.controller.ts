import {Request, Router} from "express";
import {TUserData, TUserLogin} from "./auth.model";
import {
    generateLink,
    login,
    logout,
    resetPassword,
    saveTokens,
    updateAccessToken,
    validateIdForTokens,
    checkLink
} from "./auth.service";
import {adminHandler, authHandler} from "../../middleware/authHandler";

const router = Router()

router.get('/check', async (req: Request<{}, {}, {}, {link: string}>, res, next) => {
    try {
        await checkLink(req.query.link)
        res.status(204).json({})
    } catch (e) {
        next(e)
    }
})

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

router.post('/is', authHandler, async (req, res, next) => {
    try {
        res.status(204).json({success: true})
    } catch (e) {
        next(e)
    }
})

router.post('/isAdmin', adminHandler, async (req, res, next) => {
    try {
        res.status(204).json({})
    } catch (e) {
        next(e)
    }
})

router.post('/migrate', authHandler, async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const authHeader = req.headers['authorization']
        const accessToken = authHeader && authHeader.split(' ')[1]
        const id = saveTokens(refreshToken, accessToken ?? '')
        res.json({id})
    } catch (e) {
        next(e)
    }
})

router.post('/tokens', async (req: Request<{}, {}, {}, {id: string}>, res, next) => {
    try {
        const {refresh, access} =
            validateIdForTokens(req.query.id)
        res.cookie('refreshToken', refresh, {httpOnly: true, maxAge: 30*24*60*60*1000})
        res.header('authorization', 'Bearer ' + access)
        res.json({accessToken: access})
    } catch (e) {
        next(e)
    }
})

router.post('/reset', async (req: Request<{}, {}, Pick<TUserData, 'email'>>, res, next) => {
    try {
        const link =
            await generateLink(req.body.email, req.get('origin') ?? req.get('host') ?? '')
        res.status(204).json(link)
    } catch (e) {
        next(e)
    }
})

router.put('/reset', async (req: Request<{}, {}, Pick<TUserLogin, 'password'>, {link: string}>, res, next) => {
    try {
        const updateUser = await resetPassword(req.query.link, req.body.password)
        res.status(204).json(updateUser)
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