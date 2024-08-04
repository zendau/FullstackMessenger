import IUser from "@/user/interfaces/IUser";


export default function convertUserDTO(userData: IUser) {
  return {
    id: userData.id,
    email: userData.email,
    login: userData.login,
    role: userData.role
  };
}