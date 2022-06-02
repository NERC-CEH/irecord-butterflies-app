import species, { Species } from 'common/data/species';
import { FilterGroup } from 'models/app';
import { FilterOption } from 'Components/FiltersToolbar/FiltersMenu';
import checks from './images/checks.jpg';
import plain from './images/plain.jpg';
import spots from './images/spots.jpg';
import stripes from './images/stripes.jpg';

const markingIllustrations = { checks, plain, spots, stripes };
const sizeLabels = {
  Small: (
    <>
      Small <small>{'(< 2cm)'}</small>
    </>
  ),
  Medium: (
    <>
      Medium <small>(2 - 4cm)</small>
    </>
  ),
  Large: (
    <>
      Large <small>{'(> 4cm)'}</small>
    </>
  ),
};

const getOptions = (type: keyof Pick<Species, FilterGroup>) => {
  const getOptionsFromSpecies = (sp: Species) => sp[type] as string;
  const hasValue = (v: any) => !!v;

  const options = species
    .flatMap(getOptionsFromSpecies)
    .filter(hasValue)
    .sort();

  const uniqueOptions = [...new Set(options)];
  return uniqueOptions;
};

const options: FilterOption<FilterGroup>[] = [
  {
    type: 'colour',
    values: getOptions('colour'),
    render: (value: any) => (
      <>
        <div
          style={{ background: value === 'Cream' ? '#fffdd0' : value }}
          className="colour"
        />
        {value}
      </>
    ),
  },
  {
    type: 'markings',
    values: getOptions('markings'),
    render: (value: any) => (
      <>
        <img
          src={
            markingIllustrations[
              value.toLowerCase() as keyof typeof markingIllustrations
            ]
          }
        />
        {value}
      </>
    ),
  },
  {
    type: 'size',
    values: getOptions('size'),
    render: (value: any) => sizeLabels[value as keyof typeof sizeLabels],
  },
  { type: 'group', values: getOptions('group') },
  { type: 'country', values: getOptions('country') },
];

export default options;
