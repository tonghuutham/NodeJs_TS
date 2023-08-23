import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterResBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/databases.services'
import usersService from '~/services/users.services'

//loginController
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'tonghuutham@gmail.com' && password === '123123') {
    return res.status(200).json({
      message: 'Login success'
    })
  }
  return res.status(400).json({
    message: 'Login failed '
  })
}

//registerController
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterResBody>,
  res: Response,
  next: NextFunction
) => {
  // const { email, password } = req.body
  // throw new Error('lỗi ròi ')

  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register successfull ',
    result
  })
}
