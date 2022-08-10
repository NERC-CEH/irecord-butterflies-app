import { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { AppModel } from 'common/models/app';
import { IonBackdrop, IonIcon, isPlatform } from '@ionic/react';
import { star } from 'ionicons/icons';
import ExpandableList from 'Components/ExpandableList';
import ProbabilityBadge from 'Components/ProbabilityBadge';
import whatsNewBackgroundImage from './whatsNewBackgroundImage.jpg';
import './styles.scss';

type Props = {
  appModel: AppModel;
};

const WhatsNewDialog: FC<Props> = ({ appModel }) => {
  const { showWhatsNew, showWhatsNewInVersion240, appSession } = appModel.attrs;

  const skipShowingDialogOnFreshInstall = () => {
    const isFreshInstall = appSession <= 1;
    if (isFreshInstall) {
      appModel.attrs.showWhatsNewInVersion240 = false; // eslint-disable-line
      appModel.save();
    }
  };
  useEffect(skipShowingDialogOnFreshInstall, [appSession]);

  if (!showWhatsNew) return null;

  if (!showWhatsNewInVersion240) return null;

  const closeDialog = () => {
    appModel.attrs.showWhatsNewInVersion240 = false; // eslint-disable-line
    appModel.save();
  };

  const hideFutureDialogs = () => {
    appModel.attrs.showWhatsNew = false; // eslint-disable-line
    appModel.save();
  };

  return (
    <div id="whats-new-dialog">
      <IonBackdrop tappable visible stopPropagation />

      <div className="wrapper">
        <div
          className="header"
          style={{ backgroundImage: `url(${whatsNewBackgroundImage})` }}
        >
          <div className="whats-new-badge ">
            <IonIcon icon={star} />
          </div>
        </div>

        <div className="message">
          <h1>
            <T>What's New</T>
            <span>v2.4.0</span>
          </h1>
          <ul>
            <ExpandableList>
              <li>
                <summary>
                  <T>Added photo species suggestions.</T>
                </summary>
                <p>
                  Image recognition technology will help you to identify
                  butterflies. See <ProbabilityBadge probability={1} /> badge
                  next to your record photos and in species lists.
                </p>
              </li>
              <li>
                <summary>
                  <T>
                    Added ability to select multiple photos from the gallery.
                  </T>
                </summary>
              </li>
              {isPlatform('android') && (
                <li>
                  <summary>
                    <T>Enabled Android back button.</T>
                  </summary>
                </li>
              )}
              <li>
                <summary>
                  <T>Added +5 species count shortcut.</T>
                </summary>
                <p>
                  Long-tap a species counter button to increase its abundance
                  quicker.
                </p>
              </li>
              <li>
                <summary>
                  <T>Added user account delete option.</T>
                </summary>
              </li>
              <li>
                <summary>
                  <T>Added timed count confusion species.</T>
                </summary>
              </li>

              <li>
                <summary>
                  <T>Improved app performance for long survey lists.</T>
                </summary>
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
