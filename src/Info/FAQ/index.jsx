import React from 'react';
import { IonIcon } from '@ionic/react';
import { Header, Page, Main, Collapse } from '@apps';
import 'common/images/flumens.svg';
import './styles.scss';
import butterflyIcon from 'common/images/butterflyIcon.svg';

export default () => (
  <Page id="faq">
    <Header title="FAQ" />
    <Main>
      <div className="rounded">
        <Collapse title="Where are all my previous records?">
          <span>
            Records that you have submitted from previous versions of the
            iRecord Butterflies app are all stored safely in the iRecord
            website. To see these, download them or make changes, visit{' '}
            <a href="https://www.brc.ac.uk/irecord">iRecord site</a> and log
            into your account. Although this app keeps a record of your pending
            and uploaded sightings, this is not designed to be a permanent
            repository. The only way to ensure that your records are safe and
            useful for conservation and research is to upload them.
          </span>
        </Collapse>
        <Collapse title="Can I record multiple species at a site?">
          <span>
            Yes. Hold down the 'Record' button{' '}
            <IonIcon
              icon={butterflyIcon}
              className="long-tap-tip-message-icon"
            />{' '}
            for a second or two and an option to start a Species list will
            appear. This allows you to record multiple species at a site on a
            particular date.
          </span>
        </Collapse>
        <Collapse title="Why are species missing from the 'in my area' list?">
          <span>
            The Species section of the app uses existing data from UK butterfly
            recording and monitoring schemes to present species in the order
            that they are most likely to be encountered in your general area
            (the 10km x 10km map square in which you are located) in the current
            week of the year. Records from the Butterflies for the New
            Millennium recording scheme for the period 2005-2019 provide the
            basis for the species known in your area. Other species may be
            present but not yet recorded in the BNM scheme and therefore will
            not in 'your area' lists. Submitting records of such species will
            not alter the ordering of these lists in the short-term but will
            enable the lists to be refined in future versions of the app.
          </span>
        </Collapse>
        <Collapse title="How to edit your sightings after they are uploaded">
          <div className="collapse-content-wrapper">
            <span>
              Once records are uploaded from the app, they can no longer be
              edited from within the app, and instead you need to do the
              following:
            </span>
            <ol>
              <li>
                Go to the{' '}
                <a href="https://www.brc.ac.uk/irecord">iRecord website</a> and
                log in (using the same username and password as you have used to
                register on the app)
              </li>
              <li>
                Go to the Explore -{' '}
                <a href="https://www.brc.ac.uk/irecord/my-records">
                  My records page
                </a>{' '}
                and find the record that needs to be edited
              </li>
              <li>
                Click on the edit button (on the right-hand side of the page,
                pencil and pad icon)
              </li>
              <li>Make the required edits and then click on Submit to save</li>
            </ol>
          </div>
        </Collapse>
        <Collapse title="What if I am not sure which species it is?">
          <div className="collapse-content-wrapper">
            <p>
              Identifying butterflies is not always straightforward and some
              very common and widespread species can be challenging to identify
              (e.g. Large, Small and Green-veined White). Please don't submit
              sightings if you are not sure of the identification.
            </p>
            <p>
              The species pages in this app provide some guidance on
              identification (and we plan to add more in the future), including
              comparison photos for some species that are easily mistaken. You
              can also filter the species list (using the magnifying glass icon
              in the top right corner of the screen) by main colour, markings
              and/or size to help narrow down your options. If you are still not
              sure then post a photo on{' '}
              <a href="https://twitter.com/savebutterflies">@savebutterflies</a>{' '}
              social media accounts to get an identification. But remember, only
              submit a record if you are sure it is correct - if in doubt, leave
              it out.
            </p>
          </div>
        </Collapse>
      </div>
    </Main>
  </Page>
);
