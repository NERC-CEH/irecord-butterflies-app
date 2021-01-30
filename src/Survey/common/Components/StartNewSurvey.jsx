import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import savedSamples from 'models/savedSamples';

async function getNewSample(survey) {
  const sample = await survey.create(Sample, Occurrence);
  await sample.save();

  savedSamples.push(sample);

  return sample;
}

function StartNewSurvey({ match, survey }) {
  const context = useContext(NavContext);

  const createSample = async () => {
    const sample = await getNewSample(survey);

    const url = `${match.url}/${sample.cid}`;

    context.navigate(url, 'none', 'replace');
  };

  const pickDraftOrCreateSampleWrap = () => createSample(); // effects don't like async
  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

StartNewSurvey.propTypes = exact({
  match: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
  location: PropTypes.any,
  staticContext: PropTypes.any,
});

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = survey => {
  const StartNewSurveyWrap = params => (
    <StartNewSurvey survey={survey} {...params} />
  );

  return StartNewSurveyWrap;
};

export default StartNewSurvey;
