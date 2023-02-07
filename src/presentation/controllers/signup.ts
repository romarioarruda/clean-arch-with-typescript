import { InvalidParamError } from "../errors";
import { EmailValidator, SignUpProtocol } from "../../domain/protocols";
import { Controller, HttpRequest, HttpResponse } from "../protocols";
import { badRequest, serverError, success } from "../helpers/http";
import { ValidatorProtocol } from "../helpers/validators/validator-protocol";

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly signupService: SignUpProtocol,
    private readonly validator: ValidatorProtocol,
  ) {}

  handle(req: HttpRequest): HttpResponse {
    try {
      const error = this.validator.validate(req.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = req.body

      const signup = this.signupService.create({
        name, email, password
      })

      return success(signup)
    } catch(error) {
      return serverError(error)
    }
  }
}
