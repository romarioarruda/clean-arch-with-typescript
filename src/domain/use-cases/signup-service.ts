import { UserDTO } from "../dto";
import { UserModel } from "../model";
import { SignUpProtocol } from "../protocols";

export class SignUpService implements SignUpProtocol {
  create(dto: UserDTO): UserModel {
    return {
      id: String(Date.now()),
      name: dto.name,
      email: dto.email
    }
  }
}
