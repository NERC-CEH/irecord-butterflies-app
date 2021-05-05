import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { useRouteMatch } from 'react-router';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
} from '@ionic/react';
import { Main, MenuAttrItem, InfoMessage, MenuAttrItemFromModel } from '@apps';
import {
  locationOutline,
  addCircleOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import numberIcon from 'common/images/number.svg';
import PhotoPicker from 'common/Components/PhotoPicker';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import species from 'common/data/species';
import config from 'common/config';

function MainComponent({ sample, isDisabled }) {
  const match = useRouteMatch();

  const increaseCount = () => {
    const [occurrence] = sample.occurrences;

    const { count } = occurrence.attrs;
    occurrence.attrs.count = count + 1;
  };

  const decreaseCount = () => {
    const [occurrence] = sample.occurrences;

    const { count } = occurrence.attrs;
    if (count <= 1) return;

    occurrence.attrs.count = count - 1;
  };

  const getNumberAttr = () => {
    const [occurrence] = sample.occurrences;
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
    const [occ] = sample.occurrences;

    const { taxon } = occ.attrs;
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

  const getLocationButton = () => {
    const location = sample.attrs.location || {};
    const hasLocation = location.latitude;
    const hasName = location.name;
    const empty = !hasLocation || !hasName;

    const value = (
      <IonLabel position="stacked" mode="ios">
        <IonLabel color={clsx(empty && hasLocation && 'dark')}>
          <GridRefValue sample={sample} requiredMessage="No location" />
        </IonLabel>
        <IonLabel color={clsx(empty && hasName && 'dark')}>
          {location.name || 'No site name'}
        </IonLabel>
      </IonLabel>
    );

    const isOutsideUK = hasLocation && !location.gridref;
    const inacurate = location.gridref && location.gridref.length <= 5;

    return (
      <>
        <MenuAttrItem
          routerLink={`${match.url}/location`}
          value={value}
          icon={locationOutline}
          label="Location"
          skipValueTranslation
          required
          className={clsx({ empty })}
          disabled={isDisabled}
        />
        {isOutsideUK && !isDisabled && (
          <InfoMessage color="warning">
            Your location is not in the UK, Republic of Ireland, Isle of Man or
            Channel Islands. Please tap on Location to change if necessary.
          </InfoMessage>
        )}
        {inacurate && !isDisabled && (
          <InfoMessage color="warning">
            Please select a more accurate location.
          </InfoMessage>
        )}
      </>
    );
  };

  const [occ] = sample.occurrences;

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && (
          <InfoMessage>
            This record has been uploaded and can only be edited on our website.
            <IonButton
              expand="block"
              className="uploaded-message-website-link"
              href={`${config.backend.url}/record-details?occurrence_id=${occ.id}`}
            >
              iRecord website
            </IonButton>
          </InfoMessage>
        )}

        <IonItemDivider>Details</IonItemDivider>
        <div className="rounded">
          {getSpeciesButton()}
          <MenuAttrItemFromModel model={sample} attr="date" />
          {getLocationButton()}
        </div>

        <IonItemDivider>Other</IonItemDivider>
        <div className="rounded">
          {getNumberAttr()}

          <MenuAttrItemFromModel
            model={occ}
            attr="stage"
            routerLink={`${match.url}/occ/${occ.cid}/stage`}
          />
          <MenuAttrItemFromModel
            model={occ}
            attr="comment"
            routerLink={`${match.url}/occ/${occ.cid}/comment`}
          />
        </div>

        <IonItemDivider>Species Photo</IonItemDivider>
        <div className="rounded">
          <PhotoPicker model={occ} />
        </div>
      </IonList>
    </Main>
  );
}

MainComponent.propTypes = exact({
  sample: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
});

export default observer(MainComponent);
