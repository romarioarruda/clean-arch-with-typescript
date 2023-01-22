import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { EmailValidator } from "../protocols/email-validator"
import { SignUpController } from "./signup"

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return /^[\w-]+@[\w-]+\.\w+$/.test(email)
  }
}

const factorySut = (): SignUpController => {
  const emailValidator = new EmailValidatorStub()
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
})