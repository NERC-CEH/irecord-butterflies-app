import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { device, useAlert, useLoader } from 'common/flumens';
import userModel from 'common/models/user';

const UserMarketingDialog = () => {
  const loader = useLoader();
  const alert = useAlert();
  const { agreeBcComms } = userModel.data;

  const updateSetting = async (value: boolean) => {
    await loader.show('Please wait...');

    const originalValue = userModel.data.agreeBcComms;

    try {
      userModel.data.agreeBcComms = value;
      await userModel.updateRemote({ field_agree_bc_comms: [{ value }] });
    } catch (error: any) {
      userModel.data.agreeBcComms = originalValue;
    }

    loader.hide();
  };

  useEffect(() => {
    const userReady =
      userModel.isLoggedIn() &&
      userModel.data.verified &&
      userModel.data.profileFetched;

    if (!device.isOnline) return;
    if (!userReady) return;
    if (agreeBcComms === false || agreeBcComms === true) return;

    alert({
      header: `Butterfly Conservation news`,
      cssClass:
        '[&>div>.alert-message]:h-full [&>div>.alert-message]:max-h-full',
      message: (
        <div className="[&>p]:my-2">
          <p>
            Would you like to receive Butterfly Conservation communications?
          </p>
          <p>
            Butterfly Conservation would love to keep you updated with news
            about campaigns and other work by email.
          </p>
          <p>
            You can change your preferences at any time. Butterfly Conservation
            will keep your details safe and will never swap, sell or rent your
            details to anyone.
          </p>
          <p>
            For more details about this, see Butterfly Conservation’s Privacy
            Policy [linked].
          </p>
          <p>
            Please note this opt in does not include the communications you may
            receive directly about your records as detailed in the
            irecord.org.uk privacy notice.
          </p>
        </div>
      ),

      backdropDismiss: false,
      buttons: [
        {
          text: 'No, thanks',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => updateSetting(false),
        },
        {
          text: 'Yes please',
          role: 'ok',
          cssClass: 'primary',
          handler: () => updateSetting(true),
        },
      ],
    });
  }, [userModel.data.profileFetched, userModel.data.email]);

  return null;
};

export default observer(UserMarketingDialog);
