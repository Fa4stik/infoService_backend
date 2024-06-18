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

    /**
     * Check authentication query
     * @param message reason for cancel
     * @param code 401 - invalid access token, 403 - invalid other data for authentication
     * @constructor
     */
    static Unauthorized(message: any, code: 401 | 403 = 403) {
        return new ApiError(code, message)
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