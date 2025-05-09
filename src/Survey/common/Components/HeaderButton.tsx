import { ReactNode } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Button } from '@flumens';

interface Props {
  children: ReactNode;
  onClick: any;
  isInvalid?: boolean;
  className?: string;
  color?: string;
}

const HeaderButton = ({
  children,
  onClick,
  color,
  isInvalid,
  className,
}: Props) => (
  <Button
    onPress={onClick}
    color={color || !isInvalid ? 'primary' : 'secondary'}
    className={clsx(
      'max-w-28 whitespace-nowrap px-4 py-1 text-base',
      isInvalid && 'opacity-50',
      className
    )}
  >
    {children}
  </Button>
);

export default observer(HeaderButton);
