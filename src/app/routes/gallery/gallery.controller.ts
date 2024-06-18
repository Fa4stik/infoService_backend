import {Router, Request} from "express";
import {TGallery} from "./gallery.model";
import multer from "multer";
import {TProject} from "../project/project.model";
import {getByProjectId, saveFiles} from "./gallery.service";
const upload = multer({ dest: 'uploads/' })

const router = Router()

router.get('/getByProjectId', async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        const photos = await getByProjectId(req.query.id ?? '')
        res.status(200).json(photos)
    } catch (e) {
        next(e)
    }
})

router.post('/upload', upload.array('photos'), async (req: Request<{}, {}, {}, Pick<TProject, 'id'>>, res, next) => {
    try {
        saveFiles(req.query.id, req.files)
        res.status(204).json(saveFiles)
    } catch (e) {
        next(e)
    }
})

router.delete('/delById', async (req: Request<{}, {}, {}, Pick<TGallery, 'id'>>, res, next) => {
    try {

    } catch (e) {
        next(e)
    }
})

export default router