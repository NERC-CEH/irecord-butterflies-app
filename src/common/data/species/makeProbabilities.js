/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const csv = require('@fast-csv/parse');

const WEEKS_PER_YEAR = 53;

const pad = n => (n > 9 ? `${n}` : `0${n}`);

const byCount = ([, count1], [, count2]) => count2 - count1;

const getEmptyObject = () => ({});

function generateHectadProbabilities(rows) {
  const out = [];

  for (const [species, hectad, week, count] of rows) {
    // +1 to keep the index starting at position 1. 0 index will always be empty
    if (!out[hectad])
      out[hectad] = [...Array(WEEKS_PER_YEAR + 1)].map(getEmptyObject);

    out[hectad][week][species] = count;
  }

  for (const hectad in out) {
    for (const week in out[hectad]) {
      const parseAndPadInt = ([sp]) => pad(Number.parseInt(sp, 10));
      out[hectad][week] = Object.entries(out[hectad][week])
        .sort(byCount)
        .map(parseAndPadInt);
    }

    const connectSpecies = week => week.join('');
    out[hectad] = out[hectad].map(connectSpecies).join(';');
  }

  return out;
}

function generateWeeklyProbabilities(rows) {
  // +1 to keep the index starting at position 1. 0 index will always be empty
  const out = [...Array(WEEKS_PER_YEAR + 1)].map(getEmptyObject);

  for (const [species, , week, count] of rows) {
    if (!out[week]) out[week] = {};

    if (!out[week][species]) {
      out[week][species] = count;
    } else {
      out[week][species] += count;
    }
  }

  for (const week in out) {
    const parseInt = ([sp]) => Number.parseInt(sp, 10);
    out[week] = Object.entries(out[week]).sort(byCount).map(parseInt);
  }

  return out;
}

if (require.main === module) {
  const rows = [];

  const addRow = row => {
    if (row[0] === 'species_id') return;
    rows.push(row);
  };

  const process = () => {
    let out = generateHectadProbabilities(rows);
    fs.writeFileSync('./cache/probabilityByHectad.json', JSON.stringify(out));

    out = generateWeeklyProbabilities(rows);
    fs.writeFileSync('./cache/probabilityByWeek.json', JSON.stringify(out));

    console.log(`🎉 Processed ${rows.length} rows.`);
  };

  fs.createReadStream('./cache/hectad_counts_per_week.csv')
    .pipe(csv.parse())
    .on('error', console.error)
    .on('data', addRow)
    .on('end', process);
}

exports.generateWeeklyProbabilities = generateWeeklyProbabilities;
exports.generateHectadProbabilities = generateHectadProbabilities;
