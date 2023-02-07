import { ValidatorProtocol } from "./validator-protocol";

export class ValidatorComposite implements ValidatorProtocol {
  constructor(
    private readonly validations: ValidatorProtocol[]
  ) {}

  validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) {
        return error
      }
    }
  }
}
