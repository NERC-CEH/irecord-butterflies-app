export type FilterGroup =
  | 'colour'
  | 'markings'
  | 'size'
  | 'group'
  | 'country'
  | 'survey';
export type Filter = string;
export type Filters = {
  [key in FilterGroup]?: Filter[];
};

declare const appModel: {
  _init: any;
  attrs: any;
  save: () => any;
  toggleFilter: (type: string, value: string) => void;
};

export default appModel;
