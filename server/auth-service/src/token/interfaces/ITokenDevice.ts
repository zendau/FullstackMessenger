export interface ITokenDevice {
  id?: number;
  tag: string;
  brand: string;
  model: string;
  osName: string;
  osVersion: string;
}

export interface IDevice {
  ip: string;
  system: {
    mobileData: string | null;
    userAgent: string | null;
  };
}
