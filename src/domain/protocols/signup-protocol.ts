import { UserDTO } from "../dto";
import { UserModel } from "../model";

export interface SignUpProtocol {
  create(dto: UserDTO): UserModel
}
