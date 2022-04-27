interface IRole {
  id: number;
  value: string;
  desc: string;
}

export default interface IUserDTO {
  id: number;
  email: number;
  role: IRole;
}
