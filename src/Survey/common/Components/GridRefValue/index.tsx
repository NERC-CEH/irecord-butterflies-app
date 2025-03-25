import { observer } from 'mobx-react';
import { prettyPrintLocation } from '@flumens';
import { IonSpinner } from '@ionic/react';
import Sample from 'models/sample';
import './styles.scss';

function getValue(sample: Sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner />;
  }

  return prettyPrintLocation(sample.data.location);
}

type Props = {
  sample: Sample;
  requiredMessage?: string;
};

const GridRefValue = ({ sample, requiredMessage }: Props) => {
  const value = getValue(sample);
  if (!value) return requiredMessage;

  return <div className="gridref-label">{value}</div>;
};

export default observer(GridRefValue);
