import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Page, Header, useToast, PickByType, useLoader } from '@flumens';
import { isPlatform, NavContext } from '@ionic/react';
import appModel, { Attrs as AppModelAttrs } from 'models/app';
import savedSamples from 'models/collections/samples';
import userModel from 'models/user';
import Main from './Main';

const useResetApp = () => {
  const toast = useToast();

  const reset = async () => {
    console.log('Settings:Menu:Controller: resetting the application!');

    try {
      await savedSamples.reset();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }
  };

  return reset;
};

const useDeleteUser = () => {
  const toast = useToast();
  const loader = useLoader();
  const { goBack } = useContext(NavContext);

  const deleteUser = async () => {
    console.log('Settings:Menu:Controller: deleting the user!');

    await loader.show('Please wait...');

    try {
      await userModel.delete();
      goBack();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  return deleteUser;
};

function onToggle(
  setting: keyof PickByType<AppModelAttrs, boolean>,
  checked: boolean
) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();

  isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });
}

const MenuController = () => {
  const resetApp = useResetApp();
  const deleteUser = useDeleteUser();

  const resetApplication = () => resetApp();

  const {
    sendAnalytics,
    useLocationForGuide,
    useProbabilitiesForGuide,
    location,
    useSmartSorting,
    useMoths,
    useSpeciesImageClassifier,
  } = appModel.attrs;

  const onToggleGuideLocation = (checked: boolean) => {
    onToggle('useLocationForGuide', checked);

    if (!checked) {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.location = null;
      appModel.updateCurrentLocation(false); // stops any current runs
    } else {
      appModel.updateCurrentLocation();
    }

    appModel.save();
  };

  const onToggleSmartSorting = (checked: boolean) =>
    onToggle('useSmartSorting', checked);

  const onToggleProbabilitiesForGuide = (checked: boolean) =>
    onToggle('useProbabilitiesForGuide', checked);

  const currentLocation = location && location.gridref;

  const adminChangeLocation = (e: any) => {
    if (!appModel.attrs.location) {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.location = {};
    }

    // eslint-disable-next-line no-param-reassign
    appModel.attrs.location.gridref = e.target.value;
    console.log('setting hectad', appModel.attrs.location.gridref);
    appModel.save();
  };
  const adminChangeWeek = (e: any) => {
    const currentWeek = parseInt(e.target.value, 10);
    if (currentWeek > 53) return;
    (window as any).admin.currentWeek = currentWeek;
    console.log('setting week', (window as any).admin.currentWeek);
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApplication}
        isLoggedIn={userModel.isLoggedIn()}
        deleteUser={deleteUser}
        sendAnalytics={sendAnalytics}
        useLocationForGuide={useLocationForGuide}
        onToggle={onToggle}
        onToggleGuideLocation={onToggleGuideLocation}
        onToggleProbabilitiesForGuide={onToggleProbabilitiesForGuide}
        useProbabilitiesForGuide={useProbabilitiesForGuide}
        onToggleSmartSorting={onToggleSmartSorting}
        useSmartSorting={useSmartSorting}
        useMoths={useMoths}
        currentLocation={currentLocation}
        useSpeciesImageClassifier={useSpeciesImageClassifier}
        // admin controls
        adminChangeLocation={adminChangeLocation}
        adminChangeWeek={adminChangeWeek}
      />
    </Page>
  );
};

export default observer(MenuController);
