import { IDevice } from 'src/token/interfaces/ITokenDevice';

export default interface IRefreshData {
  refreshToken: string;
  device: IDevice;
}
