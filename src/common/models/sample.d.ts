declare const appModel: {
  new (obj: any): MyInterface;

  _init: any;

  id: string | number;
  cid: string;

  attrs: any;
  metadata: any;

  isGPSRunning: () => boolean;
  toggleGPStracking: (state: boolean) => void;
  setAreaLocation: (shape: number) => void;
};

export default appModel;
