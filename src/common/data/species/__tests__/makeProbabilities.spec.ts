/* eslint-disable @getify/proper-arrows/name */
import {
  generateWeeklyProbabilites,
  generateHectadProbabilites,
} from '../makeProbabilities';

describe('generateHectadProbabilites', () => {
  it('should return hectad probs array of weekly species sorted by records count', () => {
    // Given
    const rows = [
      // sp, hect, wk, rec

      // hectad 1
      [1, 1, 1, 2],
      [2, 1, 1, 1],

      // hectad 2
      [1, 2, 1, 1],
      [2, 2, 1, 2],
    ];

    // When
    const out: any = generateHectadProbabilites(rows);

    // Then
    // expect(out.length).toBe(2 + 1);

    // hectad 1
    expect(out[1].startsWith(';0201')).toBeTruthy();

    // week 2
    expect(out[2].startsWith(';0102')).toBeTruthy();
  });
});

describe('generateWeeklyProbabilites', () => {
  it('should return weekly probs array of species sorted by records count', () => {
    // Given
    const rows = [
      // sp, hect, wk, rec

      // week 1
      [1, null, 1, 2],
      [2, null, 1, 1],

      // week 2
      [1, null, 2, 1],
      [2, null, 2, 2],
    ];

    // When
    const out = generateWeeklyProbabilites(rows);

    // Then
    expect(out.length).toBe(53 + 1);

    // week 1
    expect(out[1]).toMatchObject([2, 1]);

    // week 2
    expect(out[2]).toMatchObject([1, 2]);
  });
});
