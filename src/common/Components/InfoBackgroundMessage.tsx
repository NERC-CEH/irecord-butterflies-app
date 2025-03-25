import { observer } from 'mobx-react';
import clsx from 'clsx';
import { InfoBackgroundMessage as InfoBackgroundMessageOrig } from '@flumens';
import appModel, { Attrs } from 'models/app';

interface Props {
  name?: keyof Attrs;
  children: any;
  className?: any;
}

const InfoBackgroundMessage = ({ name, children, ...props }: Props) => {
  if (name && !appModel.data[name]) {
    return null;
  }

  const hideMessage = () => {
    (appModel.data as any)[name as any] = false;
    return {};
  };

  const onHide = name ? hideMessage : undefined;

  return (
    <InfoBackgroundMessageOrig
      onHide={onHide}
      {...props}
      className={clsx(props.className, 'font-light')}
    >
      {children}
    </InfoBackgroundMessageOrig>
  );
};

export default observer(InfoBackgroundMessage);
