import { FC, useState } from 'react';
import { Trans as T } from 'react-i18next';
import { IonItem, IonLabel } from '@ionic/react';
import './styles.scss';

const MAX_ITEMS = 4;

const ExpandableList: FC<any> = ({ children: itemsProp }: any) => {
  const [showMore, setShowMore] = useState(false);
  const items = Array.isArray(itemsProp)
    ? itemsProp.slice(0, MAX_ITEMS)
    : itemsProp;

  const restItems = Array.isArray(itemsProp)
    ? itemsProp.slice(MAX_ITEMS, itemsProp.length)
    : [];

  const hidingMoreThanTwo = restItems.length >= 2;

  const expandList = () => setShowMore(true);
  return (
    <>
      {items}

      {hidingMoreThanTwo && !showMore && (
        <IonItem className="expandable-list" onClick={expandList}>
          <IonLabel>
            <T>Show more</T>
          </IonLabel>
        </IonItem>
      )}

      {!showMore && !hidingMoreThanTwo && restItems}

      {showMore && restItems}
    </>
  );
};

export default ExpandableList;
