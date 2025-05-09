import { observer } from 'mobx-react';
import clsx from 'clsx';
import { closeOutline } from 'ionicons/icons';
import { IonToolbar, IonIcon } from '@ionic/react';
import { Badge } from 'common/flumens';
import {
  Filter as FilterValue,
  Filters,
  FilterGroupWithText as FilterGroup,
} from '..';
import './styles.scss';

type Filter = [FilterGroup, FilterValue[]];

const flattenFilterValuesByType = ([filterType, values]: Filter) => {
  const injectTypeBeforeValue = (value: FilterValue) => [filterType, value];
  return values.map(injectTypeBeforeValue);
};

type Props = {
  values: Filters;
  onRemove: any;
  searchPhrase?: string;
};

const CurrentFilters = ({ searchPhrase, values, onRemove }: Props) => {
  const getFilter = ([type, value]: [FilterGroup, FilterValue]) => {
    const removeFilterWrap = () => onRemove(type, value);

    const isTextType = type === 'text';
    const label = isTextType ? `"${value}"` : value;

    return (
      <Badge
        key={value}
        className={clsx(isTextType && 'text')}
        fill="outline"
        onPress={removeFilterWrap}
        suffix={<IonIcon icon={closeOutline} />}
      >
        {label}
      </Badge>
    );
  };

  const flatFilters = (Object.entries(values) as Filter[]).flatMap(
    flattenFilterValuesByType
  ) as [FilterGroup, FilterValue][];

  if (searchPhrase) {
    flatFilters.unshift(['text', searchPhrase]);
  }

  const currentFilters = flatFilters.map(getFilter);

  if (!currentFilters.length) {
    return null;
  }

  return (
    <IonToolbar className="filterbar">
      <div className="flex gap-1">{currentFilters}</div>
    </IonToolbar>
  );
};

export default observer(CurrentFilters);
