const fs = require('fs');
const fetchSheet = require('@flumens/fetch-onedrive-excel'); // eslint-disable-line

const drive =
  'sites/flumensio.sharepoint.com,6230bb4b-9d52-4589-a065-9bebfdb9ce63,21520adc-6195-4b5f-91f6-7af0b129ff5c/drive';

const file = '01UPL42ZXKCJ4BYXCWVJGYIWBOAQUXNNTK';

const getSpeciesWarehouseIDIndex = species => {
  const index = {};
  species.forEach((s, id) => {
    if (s.warehouseId) index[s.warehouseId] = id;
  });
  return index;
};

const getSpeciesNameIndex = species => {
  const index = {};
  species.forEach((s, id) => {
    if (s.warehouseId) index[s.scientificName] = id;
  });
  return index;
};

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

const getData = async () => {
  const species = await fetchSheet({ drive, file, sheet: 'species' });
  saveToFile(species, 'species');

  await fetchAndSave('species');
  await fetchAndSave('photos');

  const warehouseIDIndex = await getSpeciesWarehouseIDIndex(species);
  saveToFile(warehouseIDIndex, 'warehouseIDIndex');

  const nameIndex = await getSpeciesNameIndex(species);
  saveToFile(nameIndex, 'nameIndex');

  console.log('All done! 🚀');
};

getData();
