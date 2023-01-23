import { EmailValidator } from "../protocols";

export class EmailService implements EmailValidator {
  isValid(email: string): boolean {
    return /^[\w-]+@[\w-]+\.\w+$/.test(email)
  }
}