import { observer } from 'mobx-react';
import React from 'react';
import clsx from 'clsx';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  NavContext,
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
import butterflyIcon from 'common/images/butterflyIcon.svg';
import PhotoPicker from 'common/Components/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import species from 'common/data/species';
import config from 'common/config';

@observer
class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = exact({
    sample: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
  });

  navigateToSearch = () => {
    const { match } = this.props;

    this.context.navigate(`${match.url}/taxon`);
  };

  increaseCount = () => {
    const { sample } = this.props;
    const [occurrence] = sample.occurrences;

    const { count } = occurrence.attrs;
    occurrence.attrs.count = count + 1;
  };

  decreaseCount = () => {
    const { sample } = this.props;

    const [occurrence] = sample.occurrences;

    const { count } = occurrence.attrs;
    if (count <= 1) {
      return;
    }

    occurrence.attrs.count = count - 1;
  };

  getNumberAttr = () => {
    const { sample, isDisabled } = this.props;
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
              onClick={this.decreaseCount}
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
              onClick={this.increaseCount}
            >
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          )}
        </div>
      </IonItem>
    );
  };

  getSpeciesButton = () => {
    const { sample, match, isDisabled } = this.props;
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

  getLocationButton = () => {
    const { match, sample, isDisabled } = this.props;

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
            Please check if your location is not at sea or outside the British
            Isles.
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

  render() {
    const { match, sample, isDisabled } = this.props;
    const [occ] = sample.occurrences;

    return (
      <Main>
        <IonList lines="full">
          {isDisabled && (
            <InfoMessage>
              This record has been uploaded and can only be edited on our
              website.
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
            {this.getSpeciesButton()}
            <MenuAttrItemFromModel model={sample} attr="date" />
            {this.getLocationButton()}
          </div>

          <IonItemDivider>Other</IonItemDivider>
          <div className="rounded">
            {this.getNumberAttr()}

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
}

export default Component;
