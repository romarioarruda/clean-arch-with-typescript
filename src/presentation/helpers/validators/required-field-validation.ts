import { EmailValidator } from "../../../domain/protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import { ValidatorProtocol } from "./validator-protocol";

export class RequiredFieldValidation implements ValidatorProtocol {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) { }

  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }

    if (input?.email && !this.emailValidator.isValid(input?.email)) {
      return new InvalidParamError('email')
    }

    if (input?.password && input?.passwordConfirmation) {
      return this.passwordComparation(input?.password, input?.passwordConfirmation)
    }
  }

  passwordComparation(password: string, passwordConfirmation: string): Error {
    if (password !== passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
