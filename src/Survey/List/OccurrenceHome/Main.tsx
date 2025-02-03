import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Attr, Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import { IonList, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import species, { Species } from 'common/data/species';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import numberIcon from 'common/images/number.svg';
import Occurrence from 'models/occurrence';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceHomeMain = ({ occurrence }: Props) => {
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
    <Main>
      {isDisabled && <VerificationMessage occurrence={occurrence} />}

      <IonList lines="full">
        <h3 className="list-title">Details</h3>
        <div className="rounded-list">
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

        <h3 className="list-title">Species Photo</h3>
        <div className="rounded-list">
          <PhotoPicker model={occurrence} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(OccurrenceHomeMain);
