import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { star } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { IonBackdrop, IonIcon } from '@ionic/react';
import appModel from 'common/models/app';
import ExpandableList from 'Components/ExpandableList';
import croppingVideo from './cropping.mp4';
import './styles.scss';

const WhatsNewDialog = () => {
  const { showWhatsNew, showWhatsNewInVersion250, appSession } = appModel.attrs;

  const skipShowingDialogOnFreshInstall = () => {
    const isFreshInstall = appSession <= 1;
    if (isFreshInstall) {
      appModel.attrs.showWhatsNewInVersion250 = false; // eslint-disable-line
    }
  };
  useEffect(skipShowingDialogOnFreshInstall, [appSession]);

  if (!showWhatsNew) return null;

  if (!showWhatsNewInVersion250) return null;

  const closeDialog = () => {
    appModel.attrs.showWhatsNewInVersion250 = false; // eslint-disable-line
  };

  const hideFutureDialogs = () => {
    appModel.attrs.showWhatsNew = false; // eslint-disable-line
  };

  return (
    <div id="whats-new-dialog">
      <IonBackdrop tappable visible stopPropagation />

      <div className="wrapper">
        <div
          className="header"
          // style={{ backgroundImage: `url(${whatsNewBackgroundImage})` }}
        >
          <div className="video-container">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video width="100%" loop autoPlay muted playsInline>
              <source src={croppingVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="whats-new-badge">
            <IonIcon icon={star} />
          </div>
        </div>

        <div className="message">
          <h1>
            <T>What's New</T>
            <span>v2.5.0</span>
          </h1>
          <ul>
            <ExpandableList>
              <li>
                <summary>
                  <T>Added photo cropping.</T>
                </summary>
                <p>
                  To get the best results from image recognition technology you
                  can now pinch zoom and center your species photos. This helps
                  to avoid a busy background, particularly one with other
                  species in it.
                </p>
              </li>
            </ExpandableList>
          </ul>
        </div>

        <div className="whats-new-dialog-buttons">
          <div className="button" onClick={hideFutureDialogs}>
            Don't show again
          </div>
          <div className="button" onClick={closeDialog}>
            OK
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(WhatsNewDialog);
