import React from 'react';
import { IonIcon, IonImg } from '@ionic/react';
import { Header, Page, Main, Collapse } from '@apps';
import 'common/images/flumens.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import deleteOccExplanationImage from './deleteOccExplanationImage.png';
import './styles.scss';

export default () => (
  <Page id="faq">
    <Header title="FAQ" />
    <Main>
      <div className="rounded">
        <Collapse title="Where are all my previous records?">
          <span>
            Records that you have submitted from previous versions of the
            iRecord Butterflies app are all stored safely in the iRecord
            website. To see these, download them or make changes, visit the{' '}
            <a href="https://www.brc.ac.uk/irecord">iRecord website</a> and log
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
            not appear in 'your area' lists. Submitting records of such species
            will not alter the ordering of these lists in the short-term but
            will enable the lists to be refined in future versions of the app.
          </span>
        </Collapse>

        <Collapse title="Why are moths in a separate section of the species list?">
          <span>
            This new section of the list is a temporary solution. We have not
            yet put any information into the app about the known distributions
            of day-flying moths, or the times of year that they may be seen.
            When this information has been added, the moths will appear among
            the butterfly species in the other sections of the species list,
            depending on which settings you have selected.
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
        <Collapse title="How to delete a species from survey list">
          <div className="collapse-content-wrapper">
            <span>
              To delete a species from your list, swipe it left and click the
              delete button.
            </span>
            <IonImg src={deleteOccExplanationImage} />
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

        <Collapse title="Will my single-species timed count contribute to the UK Butterfly Monitoring Scheme (UKBMS)?">
          <div className="collapse-content-wrapper">
            <p>
              Timed counts form an important part of the UKBMS dataset, enabling
              more robust national and regional trends to be calculated for
              priority species when transect data are limited. Single species
              timed counts submitted via this app will be made available to the
              UKBMS and may contribute to the species trends.
            </p>
            <p>
              In order to contribute, counts should be carried out in accordance
              with{' '}
              <a href="https://ukbms.org/guidance-recording-forms">
                UKBMS guidance notes
              </a>
              , conducted at the peak of the species’ flight period and carried
              out in suitable weather conditions. Data are much more useful to
              the UKBMS, and more likely to contribute, when the same species is
              monitored at the same site over many years.
            </p>

            <p>
              The UKBMS has also published guidance for Marsh Fritillary larval
              web counts and Brown Hairstreak egg counts. These counts can also
              be entered via the app in the same way.
            </p>
          </div>
        </Collapse>
      </div>
    </Main>
  </Page>
);
