import { Trans as T } from 'react-i18next';
import { Button, InfoMessage } from '@flumens';
import config from 'common/config';
import Sample from 'models/sample';

interface Props {
  sample: Sample;
}

const DisabledRecordMessage = ({ sample }: Props) => {
  let href = `${config.backend.url}`;
  if (sample.getSurvey().name === 'list') {
    const [occ] = sample.occurrences;
    if (occ) {
      // check in case of incomplete pull from remote
      href = `${config.backend.url}/record-details?occurrence_id=${occ.id}`;
    }
  } else if (sample.getSurvey().name === 'point') {
    href = `${config.backend.url}/sample-details?sample_id=${sample.id}`;
  }

  return (
    <InfoMessage skipTranslation color="secondary">
      <div className="mb-2">
        <T>
          This record has been submitted and cannot be edited within this App.
        </T>
      </div>
      <div>
        <T>To view the full record, please visit the iRecord website.</T>
      </div>

      <Button href={href} className="mt-2 p-1" color="primary">
        iRecord website
      </Button>
    </InfoMessage>
  );
};

export default DisabledRecordMessage;
