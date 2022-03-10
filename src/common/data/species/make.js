const fs = require('fs');
const fetchSheet = require('@flumens/fetch-onedrive-excel'); // eslint-disable-line

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';

const file = '01UPL42ZXKCJ4BYXCWVJGYIWBOAQUXNNTK';

function saveToFile(data, name) {
  const saveSpeciesToFileWrap = (resolve, reject) => {
    const fileName = `./cache/${name}.json`;
    console.log(`Writing ${fileName}`);

    const dataOption = err => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    };

    fs.writeFile(fileName, JSON.stringify(data, null, 2), dataOption);
  };
  return new Promise(saveSpeciesToFileWrap);
}

const fetchAndSave = async sheet => {
  const sheetData = await fetchSheet({ drive, file, sheet });
  saveToFile(sheetData, sheet);
};

const normalizeWeeklyProbabilities = (agg, row) => {
  const { week, region, species, prob } = row;
  if (region === 'U') {
    return agg;
  }
  agg[week] = agg[week] || {}; // eslint-disable-line
  agg[week][region] = agg[week][region] || {}; // eslint-disable-line
  agg[week][region][species] = parseFloat(prob.toFixed(3)); // eslint-disable-line
  return agg;
};

const normalizeHectadProbabilities = (agg, row) => {
  const { hectad, species, prob } = row;
  agg[hectad] = agg[hectad] || {}; // eslint-disable-line
  agg[hectad][species] = parseFloat(prob.toFixed(3)); // eslint-disable-line
  return agg;
};

function checkIDsExist(normalized, species, time) {
  console.log('Checking IDs exist');
  let a = Object.values(normalized);
  if (time) {
    a = a.map(Object.values);
  }
  const names = [...new Set(a.flat().flatMap(Object.keys))];
  const checkID = name => {
    if (name === 'ScarceTortoiseshell') {
      // not in the app
      return;
    }
    const byId = sp => sp.id === name;
    if (!species.find(byId)) throw new Error(`missing species ID ${name}`);
  };
  names.forEach(checkID);
}

const getData = async () => {
  const species = await fetchSheet({ drive, file, sheet: 'species' });
  saveToFile(species, 'species');

  await fetchAndSave('species');
  await fetchAndSave('photos');

  console.log('All done! 🚀');
};

getData();
