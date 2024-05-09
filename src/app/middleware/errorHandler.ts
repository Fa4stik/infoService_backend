import {ErrorRequestHandler, NextFunction, Request, Response} from "express";

export class ApiError extends Error {
    public statusCode: number
    public error: any

    constructor(statusCode: number, error: any) {
        super(error);
        this.statusCode = statusCode
        this.error = error
    }

    static BadRequest(message: any) {
        return new ApiError(422, message)
    }

    static Unauthorized(message: any) {
        return new ApiError(401, message)
    }
}

const generateResponse = (err: ApiError) => ({
    message: 'Error',
    error: err.error ?? err.message
})

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    !err.name &&
        next()

    err instanceof ApiError
        ? res.status(err.statusCode)
        : res.status(500)

    res.json(generateResponse(err))
    next()
}