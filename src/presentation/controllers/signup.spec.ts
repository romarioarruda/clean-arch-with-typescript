import { EmailService, SignUpService } from "../../domain/use-cases";
import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { RequiredFieldValidation, ValidatorComposite } from "../helpers/validators";
import { SignUpController } from "./signup"

const emailValidator = new EmailService()
const requiredFields = [
  new RequiredFieldValidation('name', emailValidator),
  new RequiredFieldValidation('email', emailValidator),
  new RequiredFieldValidation('password', emailValidator),
  new RequiredFieldValidation('passwordConfirmation', emailValidator)
]

const signupService = new SignUpService()
const composite = new ValidatorComposite(requiredFields)

const factorySut = (): SignUpController => {
  return new SignUpController(emailValidator, signupService, composite)
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

  test('Should return 400 if password is different of passwordConfirmation', () => {
    const sut = factorySut()

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'teste@email.com',
        password: 'any-pass',
        passwordConfirmation: 'other-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 500 if EmailValidator throws', () => {
    const sut = factorySut()
    
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { 
      throw new Error()
    })

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

  test('Should return 200 if called signup create method successfuly', async () => {
    const sut = factorySut()

    const spy = jest.spyOn(signupService, 'create')

    const httpRequest = {
      body: {
        name: 'dev tester',
        email: 'teste@email.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(spy).toHaveBeenCalledWith({
      name: 'dev tester',
      email: 'teste@email.com',
      password: 'any-pass',
    })
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
})