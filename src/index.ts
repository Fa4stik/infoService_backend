'use strict'

import express from 'express'
import 'dotenv/config'
import routes from "./app/routes/routes";
import {resolve} from "node:path";
import {errorHandler} from "./app/middleware/errorHandler";
import bodyParser from "body-parser";
import cors from 'cors'
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express()

app.use(morgan('combined'))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())

app.use(express.static(resolve(__dirname, 'assets')))

app.use(routes)
app.use(errorHandler)

const port = process.env.PORT ?? 5000
app.listen(port, () => {
    console.log('app started for port', port)
})