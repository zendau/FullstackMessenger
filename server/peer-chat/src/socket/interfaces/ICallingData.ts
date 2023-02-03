export default interface ICallingData {
  from: {
    peerId: string;
    login: string;
  };
  chatTitle: string;
  users: string[];
  confereceId: string;
}
