import express from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequetsHandler } from '~/utils/handlers'

const usesRouter = express.Router()

// define the home page route
usesRouter.post('/login', loginValidator, loginController)

/**
 * Register a new user
 * path: /register
 * body:{name:string , email:string, password:string,confirm_password:string, date_of_birth:ISO8601}
 */
usesRouter.post('/register', registerValidator, wrapRequetsHandler(registerController))

export default usesRouter
