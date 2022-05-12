interface IRole {
  id: number;
  value: string;
  desc: string;
}

export default interface IUserDTO {
  id: number;
  email: string;
  login: string;
  role: IRole;
}
