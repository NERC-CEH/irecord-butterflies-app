declare const occurrenceModel: {
  new (obj: any): MyInterface;
  _init: any;
  cid: string;

  attrs: any;

  metadata: any;

  media: any;
  getSurvey: any;

  isDisabled: () => boolean;
  destroy: () => void;
  save: () => void;
  getVerificationStatus: () => string;
  getVerificationStatusMessage: () => string;
  isUploaded: () => boolean;
};

export default occurrenceModel;
