import { Page, Main, Section } from '@apps';
import './styles.scss';

const { P, H } = Section;

function SpeciesGuide() {
  return (
    <Page id="about">
      <Main>
        <Section>
          <h1>About</h1>
          <P>
            Butterflies are in trouble. A third of UK species are threatened and
            three-quarters are in decline. Butterfly recording is the foundation
            for protecting these beautiful creatures. The{' '}
            <strong>iRecord Butterflies</strong> app helps you to identify the
            butterflies that you see, but also uses your sightings to help save
            butterflies.{' '}
          </P>

          <P>
            You can record a single butterfly or create a list of different
            species seen during a survey. Tap on the green Record button to
            record a single species sighting or hold the Record button down to
            start a species list.
          </P>

          <P>
            If you have shared your location with the app, species are listed in
            order of likelihood. This is to help speed up recording and to
            assist with identification. Likelihood is based on a combination of
            previous records from your area (specifically the 10km x 10km map
            square) held in the UK butterfly database, as well as data on the
            numbers of each species seen at different times of year. However,
            the list for your area may not be complete as it is currently based
            on records received by Butterfly Conservation between 2005 and 2019.
            To improve future versions of the app, as well as helping
            conservation, please enter records of species that you see, even if
            they don't appear on the filtered lists for your area.
          </P>

          <P>
            Sightings will be stored within the iRecord website and passed onto
            the Butterflies for the New Millennium national recording scheme run
            by the charity Butterfly Conservation, with support from the
            Biological Records Centre. This long-running scheme has gathered
            millions of butterfly sightings that provide vital information about
            how the fortunes of butterflies have changed over the decades. The
            sightings are used to understand the causes of decline and to inform
            conservation work on the ground to help threatened species.
          </P>

          <P>
            Any records you submit using the{' '}
            <strong>iRecord Butterflies</strong> app will be displayed to users
            of the iRecord website and be examined and verified by an expert
            before being added to local and national butterfly databases. Your
            registration with this app also creates an account on the iRecord
            website, and you may receive notification emails from iRecord
            informing you about any checks and feedback on your records. If you
            wish, you can log on to the iRecord website using the same email and
            password combination. On the website, you can view your records by
            choosing the "Explore" menu and then "My records", and you can
            control your notifications by editing your account settings.
          </P>

          <P>
            Records may be collated and disseminated manually or electronically,
            including via the internet, for conservation, environmental
            decision-making, education, scientific research and other public
            benefit uses. Your butterfly records (but not your contact details)
            may be made publicly accessible on the internet.{' '}
          </P>

          <P>Many thanks for taking part! </P>

          <P>
            More about the Butterflies for the New Millennium recording scheme{' '}
            <a
              href="http://butterfly-conservation.org/111/Butterflies-fortheNewMillennium.html"
              rel="external"
            >
              http://butterfly-conservation.org/111/Butterflies-fortheNewMillennium.html
            </a>
          </P>

          <P>
            More about Butterfly Conservation{' '}
            <a href="http://butterfly-conservation.org/" rel="external">
              http://butterfly-conservation.org/
            </a>
          </P>

          <P>
            More about the Biological Records Centre{' '}
            <a href="http://www.brc.ac.uk/ " rel="external">
              http://www.brc.ac.uk/{' '}
            </a>
          </P>

          <H>Help</H>

          <P>
            For additional help with using this app, to report problems or to
            suggest improvements, please email{' '}
            <a href="mailto:irecord@ceh.ac.uk">irecord@ceh.ac.uk</a>
          </P>
        </Section>
      </Main>
    </Page>
  );
}

export default SpeciesGuide;
