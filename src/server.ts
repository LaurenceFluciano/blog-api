import express from 'express'
import { mongooseConnection } from './configs/connection/mongodb.connection.js'
import {router as blogRoutes} from './api/routes/blog.routes.js'
import {router as userRoute} from './api/routes/user.routes.js'
import {router as userAuthRoute} from "./api/routes/auth.user.routes.js"
import { httpErrorHandler } from './api/middlewares/error.handler.middleware.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./configs/swagger.js";
const app = express()

mongooseConnection().catch(console.dir);
app.use(express.json())
app.use("/api/v1/blog", blogRoutes)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/user/auth", userAuthRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true, 
}));
app.use(httpErrorHandler)

app.listen(3000)