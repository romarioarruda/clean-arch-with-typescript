import { InvalidParamError, MissingParamError } from "../errors";
import { badRequest, serverError, success } from "../helpers/http";
import { EmailValidator, SignUpProtocol } from "../../domain/protocols";
import { Controller, HttpRequest, HttpResponse } from "../protocols";

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly signupService: SignUpProtocol
  ) {
    this.emailValidator = emailValidator
    this.signupService = signupService
  }

  handle(req: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = req.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const signup = this.signupService.create({
        name, email, password
      })

      return success(signup)
    } catch(error) {
      return serverError(error)
    }
  }
}
