import { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { AppModel } from 'common/models/app';
import { IonBackdrop, IonIcon } from '@ionic/react';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import ExpandableList from 'Components/ExpandableList';
import whatsNewBackgroundImage from 'common/images/whatsNewBackgroundImage.jpg';
import './styles.scss';

type Props = {
  appModel: AppModel;
};

const WhatsNewDialog: FC<Props> = ({ appModel }) => {
  const { showWhatsNewInVersion240, appSession } = appModel.attrs;

  const skipShowingDialogOnFreshInstall = () => {
    const isFreshInstall = appSession <= 1;
    if (isFreshInstall) {
      appModel.attrs.showWhatsNewInVersion240 = false; // eslint-disable-line
      appModel.save();
    }
  };
  useEffect(skipShowingDialogOnFreshInstall, [appSession]);

  if (!showWhatsNewInVersion240) return null;

  const closeDialog = () => {
    appModel.attrs.showWhatsNewInVersion240 = false; // eslint-disable-line
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
          <div className="butterfly-badge ">
            <IonIcon icon={butterflyIcon} />
          </div>
        </div>

        <div className="message">
          <h1>
            <T>What's New</T>
          </h1>
          <ul>
            <ExpandableList>
              <li>
                <T>Added timed count confusion species.</T>
              </li>
              <li>
                <T>Added +5 species count shortcut.</T>
              </li>
              <li>
                <T>Added photo species suggestions.</T>
              </li>
              <li>
                <T>Enabled Android back button.</T>
              </li>
              <li>
                <T>Updated About page.</T>
              </li>
              <li>
                <T>Added ability to select multiple photos from the gallery.</T>
              </li>
              <li>
                <T>Improved app performance for long survey lists.</T>
              </li>
              <li>
                <T>Added user account delete option.</T>
              </li>
            </ExpandableList>
          </ul>
        </div>

        <div className="button" onClick={closeDialog}>
          Ok
        </div>
      </div>
    </div>
  );
};

export default observer(WhatsNewDialog);
