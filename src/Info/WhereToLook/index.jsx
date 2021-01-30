import React from 'react';
import { Header, Page, Main, Section } from '@apps';
import 'common/images/flumens.svg';
import './styles.scss';

const { P } = Section;

export default () => (
  <Page id="where-to-look">
    <Header title="Where to Look" />
    <Main>
      <Section>
        <P>
          Each of the species, which is regularly recorded in the UK, has a
          distribution map to show where it's been seen in recent years. Each
          species also has an <strong>ID Guide</strong> which contains a{' '}
          <strong>Habitat</strong> section to give you some specific guidance
          about where you are most likely to find them.
        </P>

        <P>
          The app also features general information about each species and
          contains a photo gallery for each to help you ID them.
        </P>

        <P>Happy hunting!</P>
      </Section>
    </Main>
  </Page>
);
