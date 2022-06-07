import { User } from "../user.entity";

export default function convertUserDTO(userData: User) {
  return {
    id: userData.id,
    email: userData.email,
    login: userData.login,
    role: convertRoleDTO(userData.role)
  };
}

function convertRoleDTO(role: any) {
  return {
    id: role.id,
    value: role.value,
    accessLevel: role.accessLevel
  }

}