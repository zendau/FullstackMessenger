import { User } from "../users.entity";

export default function convertUserDTO(userData: User) {
  return {
    id: userData.id,
    email: userData.email,
    login: userData.login,
  };
}