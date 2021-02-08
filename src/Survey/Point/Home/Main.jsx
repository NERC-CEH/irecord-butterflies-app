import { observer } from 'mobx-react';
import React from 'react';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  NavContext,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
import {
  Main,
  alert,
  MenuAttrItem,
  LongPressButton,
  MenuNote,
  MenuAttrItemFromModel,
  PhotoPicker,
  toast,
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

const inWIP = () => toast.warn('Sorry, this is still WIP.');

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
              color="secondary"
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
              color="secondary"
              onClick={this.increaseCount}
            >
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          )}
        </div>
      </IonItem>
    );
  };

  render() {
    const { match, sample, isDisabled } = this.props;
    const [occ] = sample.occurrences;

    const location = sample.attrs.location || {};

    const prettyGridRef = (
      <IonLabel position="stacked" mode="ios">
        <IonLabel>
          <GridRefValue sample={sample} />
        </IonLabel>
        <IonLabel>{location.name}</IonLabel>
      </IonLabel>
    );

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
            <IonItem className="menu-attr-item disabled" detail onClick={inWIP}>
              <IonIcon icon={butterflyIcon} slot="start" />
              <IonLabel>Species</IonLabel>
            </IonItem>
            <MenuAttrItemFromModel model={sample} attr="date" />
            <MenuAttrItem
              routerLink={`${match.url}/location`}
              value={prettyGridRef}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
            />
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
