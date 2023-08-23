import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import USE_MESSAGE from '~/constants/messages'
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
      notEmpty: {
        errorMessage: USE_MESSAGE.NAME_IS_REQUIRED
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USE_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      isString: {
        errorMessage: USE_MESSAGE.NAME_MUST_BE_A_STRING
      },
      trim: true
    },
    email: {
      isEmail: true,
      notEmpty: {
        errorMessage: USE_MESSAGE.EMAIL_IS_REQUIRED
      },
      custom: {
        options: async (value) => {
          const isExitsEmail = await usersService.checkMailExit(value) // check email đã có trong db chưa
          if (isExitsEmail) {
            throw new ErrorWithStatus({ message: USE_MESSAGE.EMAIL_ALREADY_EXISTS, status: 400 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USE_MESSAGE.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 255
        },
        errorMessage: USE_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
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
      notEmpty: { errorMessage: USE_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED },
      isLength: {
        options: {
          min: 6,
          max: 255
        },
        errorMessage: USE_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
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
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USE_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  })
)
