import IEditUser from "../interfaces/IEditUserData";
import IUser from "../interfaces/IUserData";

export default function convertEditUserDTO(userData: IEditUser) {
  return {
    ...(userData.newEmail && { email: userData.newEmail }),
    ...(userData.login && { login: userData.login }),
    ...(userData.password && { password: userData.password }),
  };
}
