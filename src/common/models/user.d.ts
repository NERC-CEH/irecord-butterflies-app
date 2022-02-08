declare const userModel: {
  _init: any;
  attrs: any;
  save: () => any;
  refreshUploadCountStat: () => any;
  getAccessToken: () => string;
  hasLogIn: () => boolean;
};

export default userModel;
