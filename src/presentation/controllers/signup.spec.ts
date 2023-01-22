import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { ServerError } from "../errors/server-error"
import { EmailValidator } from "../protocols/email-validator"
import { SignUpController } from "./signup"

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return /^[\w-]+@[\w-]+\.\w+$/.test(email)
  }
}

const emailValidator = new EmailValidatorStub()

const factorySut = (): SignUpController => {
  return new SignUpController(emailValidator)
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        email: 'email@gmail.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        name: 'dev tester',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'testeemail.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'email@gmail.com',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'email@gmail.com',
        password: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should call email validator with valid email', () => {
    const sut = factorySut()

    const spy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'teste@email.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith('teste@email.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const sut = factorySut()
    
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() as unknown as any })

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'teste@email.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(new Error()))
  })
})