export interface IDeviceProfile {
  ipLocation: ILocation;
  userDeclaredLocation?: ILocation;
}

interface ILocation {
  state: string;
  district: string;
}
