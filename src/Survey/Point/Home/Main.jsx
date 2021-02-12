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
import {
  Main,
  alert,
  MenuAttrItem,
  LongPressButton,
  MenuNote,
  MenuAttrItemFromModel,
  PhotoPicker,
} from '@apps';
import Image from 'models/image';
import {
  camera,
  locationOutline,
  addCircleOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import PropTypes from 'prop-types';
import numberIcon from 'common/images/number.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import species from 'common/data/species';

@observer
class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    sample: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    appModel: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
  };

  getNewImageButton = photoSelect => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return <br />;
    }

    return (
      <LongPressButton
        color="secondary"
        onLongClick={this.navigateToSearch}
        type="submit"
        expand="block"
        onClick={photoSelect}
      >
        <IonIcon slot="start" icon={camera} size="large" />
        Plant
      </LongPressButton>
    );
  };

  navigateToSearch = () => {
    const { match } = this.props;

    this.context.navigate(`${match.url}/taxon`);
  };

  showFirstSurveyTip = () => {
    const { appModel } = this.props;

    if (!appModel.attrs.showFirstSurveyTip) {
      return;
    }

    alert({
      skipTranslation: true,
      header: 'Your first survey',
      message: (
        <>
          You can add plant photos using your camera and we will try to identify
          them for you. Alternatively, you can long-press the button to enter
          the species manually.
        </>
      ),
      buttons: [
        {
          text: 'OK, got it',
          role: 'cancel',
          cssClass: 'primary',
        },
      ],
    });

    appModel.attrs.showFirstSurveyTip = false;
    appModel.save();
  };

  componentDidMount() {
    this.showFirstSurveyTip();
  }

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
    const { isDisabled, sample } = this.props;

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
    const { sample, match } = this.props;
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
        routerLink={`${match.url}/species`}
        detail
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
    const { match, sample } = this.props;

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

    return (
      <MenuAttrItem
        routerLink={`${match.url}/location`}
        value={value}
        icon={locationOutline}
        label="Location"
        skipValueTranslation
        required
        className={clsx({ empty })}
      />
    );
  };

  render() {
    const { match, sample, isDisabled } = this.props;
    const [occ] = sample.occurrences;

    return (
      <Main>
        <IonList lines="full">
          {isDisabled && (
            <MenuNote>
              This survey has been finished and cannot be updated.
            </MenuNote>
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
            <PhotoPicker model={sample} ImageClass={Image} />
          </div>
        </IonList>
      </Main>
    );
  }
}

export default Component;
