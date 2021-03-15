import { observer } from 'mobx-react';
import React from 'react';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, MenuAttrItemFromModel, PhotoPicker } from '@apps';
import Image from 'models/image';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import numberIcon from 'common/images/number.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import species from 'common/data/species';
import config from 'common/config';

function OccurrenceHomeMain({ occurrence }) {
  const match = useRouteMatch();

  const isDisabled = occurrence.isDisabled();

  const increaseCount = () => {
    const { count } = occurrence.attrs;
    occurrence.attrs.count = count + 1; // eslint-disable-line
  };

  const decreaseCount = () => {
    const { count } = occurrence.attrs;
    if (count <= 1) {
      return;
    }

    occurrence.attrs.count = count - 1; // eslint-disable-line
  };

  const getNumberAttr = () => {
    const { count } = occurrence.attrs;

    return (
      <IonItem id="menu-item-count-edit" disabled={isDisabled}>
        <IonLabel>Number</IonLabel>
        <IonIcon icon={numberIcon} slot="start" />
        <div slot="end">
          {!isDisabled && (
            <IonButton
              shape="round"
              fill="clear"
              size="default"
              onClick={decreaseCount}
              color="medium"
            >
              <IonIcon icon={removeCircleOutline} />
            </IonButton>
          )}

          <span>{count}</span>
          {!isDisabled && (
            <IonButton
              shape="round"
              fill="clear"
              size="default"
              color="medium"
              onClick={increaseCount}
            >
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          )}
        </div>
      </IonItem>
    );
  };

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
        routerLink={!isDisabled && `${match.url}/species`}
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

          {getNumberAttr()}

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
          <PhotoPicker
            model={occurrence}
            ImageClass={Image}
            isDisabled={isDisabled}
            dataDirPath={config.dataPath}
          />
        </div>
      </IonList>
    </Main>
  );
}

OccurrenceHomeMain.propTypes = exact({
  occurrence: PropTypes.object.isRequired,
});

export default observer(OccurrenceHomeMain);
