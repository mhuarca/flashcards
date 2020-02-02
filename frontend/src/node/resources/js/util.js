/* eslint-disable no-param-reassign */

/**
 * Shuffle an array in place using the
 * Algorithm P Shuffle.
 * @param {array} array The array to shuffle in place.
 */
const shuffleArray = (array) => {
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export default {
  shuffleArray,
};
