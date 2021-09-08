import { observer } from 'mobx-react';
import React from 'react';
import {
  IonItemDivider,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import { Attr, Main, MenuAttrItem, MenuAttrItemFromModel } from '@apps';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import PhotoPicker from 'common/Components/PhotoPicker';
import numberIcon from 'common/images/number.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import species from 'common/data/species';

function OccurrenceHomeMain({ occurrence }) {
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

    const byId = ({ id: speciesID }) => speciesID === taxon.id;
    const fullSpeciesProfile = species.find(byId);

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
}

OccurrenceHomeMain.propTypes = exact({
  occurrence: PropTypes.object.isRequired,
});

export default observer(OccurrenceHomeMain);
