declare const occurrenceModel: {
  new (obj: any): MyInterface;

  _init: any;

  id: string | number;
  cid: string;

  attrs: any;
  metadata: any;
};

export default occurrenceModel;
