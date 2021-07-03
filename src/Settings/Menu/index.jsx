import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, toast } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';

const { success, error } = toast;

const resetApp = async (saveSamples, appModel, userModel) => {
  console.log('Settings:Menu:Controller: resetting the application!');

  try {
    await saveSamples.resetDefaults();
    await appModel.resetDefaults();
    await userModel.resetDefaults();
    success('Done');
  } catch (e) {
    error(`${e.message}`);
  }
};

function onToggle(appModel, setting, checked) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();
}

const MenuController = props => {
  const { savedSamples, appModel, userModel } = props;

  const resetApplication = () => resetApp(savedSamples, appModel, userModel);
  const { sendAnalytics, useLocationForGuide, location } = appModel.attrs;

  const onToggleWrap = (...args) => onToggle(appModel, ...args);
  const onToggleGuideLocation = checked => {
    onToggle(appModel, 'useLocationForGuide', checked);

    if (!checked) {
      appModel.attrs.location = null;
      appModel.updateCurrentLocation(false); // stops any current runs
    } else {
      appModel.updateCurrentLocation();
    }

    appModel.save();
  };

  const currentLocation = location && location.gridref;

  const adminChangeLocation = e => {
    appModel.attrs.location.gridref = e.target.value;
    console.log('setting hectad', appModel.attrs.location.gridref);
    appModel.save();
  };
  const adminChangeWeek = e => {
    window.admin.currentWeek = parseInt(e.target.value, 10);
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
