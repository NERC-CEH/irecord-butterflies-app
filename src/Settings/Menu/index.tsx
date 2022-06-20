import { FC } from 'react';
import { isPlatform } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Page, Header, useToast, PickByType } from '@flumens';
import appModel, { Attrs as AppModelAttrs } from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import { observer } from 'mobx-react';
import Main from './Main';

const useResetApp = () => {
  const toast = useToast();

  const reset = async () => {
    console.log('Settings:Menu:Controller: resetting the application!');

    try {
      await savedSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }
  };

  return reset;
};

function onToggle(
  setting: keyof PickByType<AppModelAttrs, boolean>,
  checked: boolean
) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();

  isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });
}

const MenuController: FC = () => {
  const resetApp = useResetApp();

  const resetApplication = () => resetApp();

  const {
    sendAnalytics,
    useLocationForGuide,
    useProbabilitiesForGuide,
    location,
    useSmartSorting,
    useMoths,
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
        // admin controls
        adminChangeLocation={adminChangeLocation}
        adminChangeWeek={adminChangeWeek}
      />
    </Page>
  );
};

export default observer(MenuController);
