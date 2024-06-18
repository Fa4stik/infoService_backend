import {Router} from "express";
import projectController from "./project/project.controller";
import projectSectionController from "./projectSection/projectSection.controller";
import projectSectionContentController from "./projectSectionContent/projectSectionContent.controller";
import userController from "./user/user.controller";
import authController from "./auth/auth.controller";
import galleryController from "./gallery/gallery.controller";
import {authHandler} from "../middleware/authHandler";

const api = Router()
    .use('/project', authHandler, projectController)
    .use('/projectSection', authHandler, projectSectionController)
    .use('/projectSectionContent', authHandler, projectSectionContentController)
    .use('/gallery', galleryController)
    .use('/user', authHandler, userController)
    .use('/auth', authController)

export default Router().use('/api/v1', api)