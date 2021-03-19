import React from 'react';
import { Header, Page, Main, Section } from '@apps';
import 'common/images/flumens.svg';
import photos from 'common/data/species/cache/photos.json';
import './styles.scss';

const { P, H } = Section;

const extraPhotoAuthors = [
  'Adam Gor',
  'John Murray',
  'Anthony Pope',
  'Peter Withers',
];

const byLastName = (n1, n2) => {
  const lastName1 = n1.split(' ').pop();
  const lastName2 = n2.split(' ').pop();
  return lastName1.localeCompare(lastName2);
};
const getAuthorFromPhoto = photo => photo.author || '';
const allAuthors = photos.map(getAuthorFromPhoto);
const uniqueAuthors = [...new Set([...allAuthors, ...extraPhotoAuthors])].sort(
  byLastName
);
const getAuthorComponent = author => <span>{author}</span>;
const authors = uniqueAuthors.map(getAuthorComponent);

export default () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main>
      <Section>
        <P>
          We thank the following for providing input into the development of
          this app:
        </P>
        <P skipTranslation className="credits">
          <span>
            <b>Richard Fox</b> (Butterfly Conservation)
          </span>
          <span>
            <b>David Roy</b> (UKCEH)
          </span>
          <span>
            <b>Karolis Kazlauskis</b> (Flumens)
          </span>
          <span>
            <b>Vilius Stankaitis</b> (Flumens)
          </span>
          <span>
            <b>Anthony McCluskey</b>
          </span>
        </P>
      </Section>

      <Section>
        <H>Funding</H>
        <P>
          We are grateful to Butterfly Conservation, Defra, the Joint Nature
          Conservation Committee for all contributing to the funding of the
          application.
        </P>
      </Section>

      <Section>
        <H>Development</H>
        <P>
          This app was built by{' '}
          <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
            Flumens
          </a>{' '}
          which specialises in developing bespoke environmental science and
          community focussed mobile applications.
        </P>
      </Section>

      <Section>
        <H>Graphics</H>
        <P>
          Icons made by{' '}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </P>
      </Section>

      <Section>
        <H>Photographs</H>
        <P>
          We are very grateful to all of the photographers whose images we have
          used in this app:
        </P>
        <P skipTranslation className="credits">
          {authors}
        </P>
        <P>
          Also, thanks to Andrew Cooper and Anthony McCluskey who were
          responsible for the species photo cut-outs.
        </P>
      </Section>
    </Main>
  </Page>
);
