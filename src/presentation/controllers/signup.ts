import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(req: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
