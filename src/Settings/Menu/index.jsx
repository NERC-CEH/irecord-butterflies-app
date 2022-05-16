import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, useToast } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';

const useResetApp = (saveSamples, appModel, userModel) => {
  const toast = useToast();

  const reset = async () => {
    console.log('Settings:Menu:Controller: resetting the application!');

    try {
      await saveSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (e) {
      toast.error(`${e.message}`);
    }
  };

  return reset;
};

function onToggle(appModel, setting, checked) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();
}

const MenuController = ({ savedSamples, appModel, userModel }) => {
  const resetApp = useResetApp(savedSamples, appModel, userModel);

  const resetApplication = () => resetApp(savedSamples, appModel, userModel);

  const {
    sendAnalytics,
    useLocationForGuide,
    useProbabilitiesForGuide,
    location,
    useSmartSorting,
    useMoths,
  } = appModel.attrs;

  const onToggleWrap = (...args) => onToggle(appModel, ...args);
  const onToggleGuideLocation = checked => {
    onToggle(appModel, 'useLocationForGuide', checked);

    if (!checked) {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.location = null;
      appModel.updateCurrentLocation(false); // stops any current runs
    } else {
      appModel.updateCurrentLocation();
    }

    appModel.save();
  };

  const onToggleSmartSorting = checked =>
    onToggle(appModel, 'useSmartSorting', checked);

  const onToggleProbabilitiesForGuide = checked =>
    onToggle(appModel, 'useProbabilitiesForGuide', checked);

  const currentLocation = location && location.gridref;

  const adminChangeLocation = e => {
    if (!appModel.attrs.location) {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.location = {};
    }

    // eslint-disable-next-line no-param-reassign
    appModel.attrs.location.gridref = e.target.value;
    console.log('setting hectad', appModel.attrs.location.gridref);
    appModel.save();
  };
  const adminChangeWeek = e => {
    const currentWeek = parseInt(e.target.value, 10);
    if (currentWeek > 53) return;
    window.admin.currentWeek = currentWeek;
    console.log('setting week', window.admin.currentWeek);
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApplication}
        sendAnalytics={sendAnalytics}
        useLocationForGuide={useLocationForGuide}
        onToggle={onToggleWrap}
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

MenuController.propTypes = exact({
  userModel: PropTypes.object.isRequired,
  appModel: PropTypes.object.isRequired,
  savedSamples: PropTypes.array.isRequired,
});

export default observer(MenuController);
