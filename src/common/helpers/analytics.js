import * as Sentry from '@sentry/browser';
import { CaptureConsole } from '@sentry/integrations';

export default function init({
  dsn,
  environment,
  build,
  release,
  userId = -1,
  tags,
}) {
  if (!dsn || !environment || !build || !release) {
    console.log(dsn, environment, build, release); // eslint-disable-line
    throw new Error(
      'Analytics: some property is missing - dsn, environment, build, release'
    );
  }

  console.log('using new analytics');

  Sentry.init({
    dsn,
    environment,
    release,
    integrations: [new CaptureConsole({ levels: ['error'] })],
  });

  Sentry.setUser({ id: userId });
  Sentry.setTag('app.build', build);

  if (tags) {
    const setTagWrap = ([key, value]) => Sentry.setTag(key, value);
    Object.entries(tags).forEach(setTagWrap);
  }
}
