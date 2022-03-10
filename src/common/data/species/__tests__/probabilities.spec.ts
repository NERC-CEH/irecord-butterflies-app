/* eslint-disable @getify/proper-arrows/name */
import getProbablities from '../probabilities';

describe('getProbablities', () => {
  it('should return two sets of probabilites if hectad is known', () => {
    // Given
    const species1 = 'Swallowtail'; // id = 1 from species.json
    const species2 = 'DingySkipper'; // id = 2 from species.json
    const species3 = 'GrizzledSkipper'; // id = 3 from species.json

    const weekNo = 1;
    const hectad = 'SV90'; // index = 1 from hectads.json
    const probByWeekData: any = [[], []];
    const probByHectadData: any = ['', ';0102;03', '']; // hectad0, hectad1, hectad2 hectad1='wk0;wk1;wk2'

    // When
    const probs = getProbablities(
      weekNo,
      hectad,
      probByWeekData,
      probByHectadData
    );

    // Then
    expect(probs).toMatchObject([[species1, species2], [species3], []]);
  });

  it('should return time based set of probabilites if hectad is not known', () => {
    // Given
    const species1 = 'Swallowtail'; // id = 1 from species.json
    const species2 = 'DingySkipper'; // id = 2 from species.json

    const weekNo = 1;
    const hectad = '';
    const probByWeekData: any = [[], [1, 2]]; // wk0, wk1
    const probByHectadData: any = [];

    // When
    const probs = getProbablities(
      weekNo,
      hectad,
      probByWeekData,
      probByHectadData
    );

    // Then
    expect(probs).toMatchObject([[], [], [species1, species2]]);
  });
});
