import { IDevice } from '@/token/interfaces/ITokenDevice';

export default interface IRefreshData {
  refreshToken: string;
  device: IDevice;
}
