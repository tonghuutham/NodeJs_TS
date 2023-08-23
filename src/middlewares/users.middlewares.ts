import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/databases.services'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      isString: true
    },
    email: {
      isEmail: true,
      notEmpty: true,
      custom: {
        options: async (value) => {
          const isExitsEmail = await usersService.checkMailExit(value) // check email đã có trong db chưa
          if (isExitsEmail) {
            throw new ErrorWithStatus({ message: 'Email already exists', status: 400 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      isString: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'Invalid password string passed to password field'
      }
    },
    confirm_password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      isString: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'Invalid password string passed to password field'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('re-enter password does not match')
          }
          return true
        }
      }
    }
  })
)
