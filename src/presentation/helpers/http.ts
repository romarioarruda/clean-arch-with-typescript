import { MissingParamError, ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const badRequest = (error: MissingParamError): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

export const success = (response: unknown): HttpResponse => ({
  statusCode: 200,
  body: response
})
