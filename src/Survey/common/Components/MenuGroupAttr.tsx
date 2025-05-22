import { peopleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { IonIcon, IonItem, IonLabel } from '@ionic/react';
import groups from 'common/models/collections/groups';
import Group from 'common/models/group';
import Sample from 'common/models/sample';

type Props = { sample: Sample };

const MenuGroupAttr = ({ sample }: Props) => {
  const match = useRouteMatch();

  const byId = (grp: Group) => grp.id === sample.data.groupId;
  const group = groups.find(byId);

  const title = group?.data.title || sample.data.groupId;

  if (sample.isDisabled && !title) return null;

  return (
    <IonItem
      routerLink={!sample.isDisabled ? `${match.url}/group` : undefined}
      detail={!sample.isDisabled}
    >
      <IonIcon src={peopleOutline} slot="start" />
      <IonLabel>Activity</IonLabel>
      <div className="text-right text-[var(--form-value-color)]">{title}</div>
    </IonItem>
  );
};

export default MenuGroupAttr;
