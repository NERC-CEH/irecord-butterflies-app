/* eslint-disable */
const fs = require('fs');
const { execSync } = require('child_process');

function getThumbnails() {
  const thumbnails = [];
  const files = fs.readdirSync('./other', { withFileTypes: true });

  files
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .forEach(dir => {
      const files = fs.readdirSync(`./other/${dir}`);
      const byThumbnails = file =>
        file.includes('.png') && !file.includes('_map');
      const addDir = file => {
        const fullDir = `./other/${dir}`;
        return [fullDir, `${fullDir}/${file}`];
      };
      thumbnails.push(files.filter(byThumbnails).map(addDir));
    });

  return thumbnails.flat();
}

const thumbnails = getThumbnails();

const createBackground = ([dir, thumbnail]) => {
  execSync(
    `convert "${thumbnail}"  -channel RGBA  -blur 0x80 -resize 1000x1000  -gravity center -crop 500x500+0+0 +repage ${dir}/thumbnail_background.png`,
    { stdio: 'inherit' }
  );

  execSync(
    `convert ${dir}/thumbnail_background.png  ./makeThumbnailBackgroundsMask.png -composite  -resize 100 ${dir}/thumbnail_background.png`,
    { stdio: 'inherit' }
  );
};
thumbnails.forEach(createBackground);
