import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(req: HttpRequest): HttpResponse {
    if (!req.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!req.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!req.body.password) {
      return badRequest(new MissingParamError('password'))
    }
  }
}
