import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  IonItemDivider,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
} from '@ionic/react';
import clsx from 'clsx';
import Occurrence from 'models/occurrence';
import { useRouteMatch } from 'react-router';
import { Attr, Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import PhotoPicker from 'common/Components/PhotoPicker';
import numberIcon from 'common/images/number.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import species, { Species } from 'common/data/species';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceHomeMain: FC<Props> = ({ occurrence }) => {
  const match = useRouteMatch();

  const isDisabled = occurrence.isDisabled();

  const getSpeciesButton = () => {
    const { taxon } = occurrence.attrs;
    if (!taxon) {
      return (
        <MenuAttrItem
          routerLink={`${match.url}/species`}
          icon={butterflyIcon}
          label="Species"
          required
        />
      );
    }

    const byId = ({ id: speciesID }: Species) => speciesID === taxon.id;
    const fullSpeciesProfile = species.find(byId) as Species;

    const { commonName, scientificName, thumbnail } = fullSpeciesProfile;

    return (
      <IonItem
        className="menu-attr-item species-item"
        routerLink={!isDisabled ? `${match.url}/species` : undefined}
        detail={!isDisabled}
      >
        <IonAvatar>
          <img src={thumbnail} />
        </IonAvatar>
        <IonLabel position="stacked" mode="ios" slot="end">
          <IonLabel>
            <b>{commonName}</b>
          </IonLabel>
          <IonLabel>
            <i>{scientificName}</i>
          </IonLabel>
        </IonLabel>
      </IonItem>
    );
  };

  return (
    <Main className={clsx(isDisabled && 'disable-top-padding')}>
      {isDisabled && <VerificationMessage occurrence={occurrence} />}

      <IonList lines="full">
        <IonItemDivider>Details</IonItemDivider>
        <div className="rounded">
          {getSpeciesButton()}

          <Attr
            model={occurrence}
            input="counter"
            inputProps={{
              icon: numberIcon,
              label: 'Number',
              isDisabled,
              min: 1,
            }}
            attr="count"
          />

          <MenuAttrItemFromModel
            model={occurrence}
            attr="stage"
            routerLink={`${match.url}/stage`}
          />
          <MenuAttrItemFromModel
            model={occurrence}
            attr="comment"
            routerLink={`${match.url}/comment`}
          />
        </div>

        <IonItemDivider>Species Photo</IonItemDivider>
        <div className="rounded">
          <PhotoPicker model={occurrence} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(OccurrenceHomeMain);
