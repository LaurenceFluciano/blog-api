import express from 'express'
import { mongooseConnection } from './configs/mongodbConnection.js'
import {router as blogRoutes} from './api/routes/blog.routes.js'
import {router as userRoute} from './api/routes/user.routes.js'
import {router as userAuthRoute} from "./api/routes/auth.user.routes.js"
import { httpErrorHandler } from './api/middlewares/error.handler.middleware.js'
const app = express()


mongooseConnection().catch(console.dir);
app.use(express.json())
app.use("/api/blog", blogRoutes)
app.use("/api/user", userRoute)
app.use("/api/user/auth", userAuthRoute)
app.use(httpErrorHandler)

app.listen(3000)