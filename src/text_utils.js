
function getLevenshteinDistance(a, b) {
  const alen = a.length;
  const blen = b.length;
  const d = [];

  for(let i = 0; i <= alen; i++){
      d[i] = [i];
  }
  for(let j = 1; j <= blen; j++){
      d[0][j] = j;
  }
  for(let i = 1; i <= alen; i++){
      for(let j = 1; j <= blen; j++){
          if(a[i-1] === b[j-1]){
              d[i][j] = d[i-1][j-1];
          } else {
              d[i][j] = Math.min(
                  d[i-1][j] + 1,    // Deletion
                  d[i][j-1] + 1,    // Insertion
                  d[i-1][j-1] + 1   // Substitution
              );
          }
      }
  }
  return d[alen][blen];
}

// Function to calculate the percentage difference
function calculatePercentageMatch(str1, str2) {
    const distance = getLevenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const percentageMatch = (1 - distance / maxLength) * 100;
    return percentageMatch;
}

const thaiToRomanConsonant = {
  'ก': 'gk',
  'ข': 'kh',
  'ฃ': 'kh',
  'ค': 'k',
  'ฅ': 'kh',
  'ฆ': 'kh',
  'ง': 'ng',
  'จ': 'j',
  'ฉ': 'ch',
  'ช': 'ch',
  'ซ': 's',
  'ฌ': 'ch',
  'ญ': 'y',
  'ฎ': 'd',
  'ฏ': 't',
  'ฐ': 'th',
  'ฑ': 'th',
  'ฒ': 'th',
  'ณ': 'n',
  'ด': 'd',
  'ต': 't',
  'ถ': 'th',
  'ท': 'th',
  'ธ': 'th',
  'น': 'n',
  'บ': 'b',
  'ป': 'p',
  'ผ': 'ph',
  'ฝ': 'f',
  'พ': 'ph',
  'ฟ': 'f',
  'ภ': 'ph',
  'ม': 'm',
  'ย': 'y',
  'ร': 'r',
  'ล': 'l',
  'ว': 'w',
  'ศ': 's',
  'ษ': 's',
  'ส': 's',
  'ห': 'h',
  'ฬ': 'l',
  'อ': 'o',
  'ฮ': 'h',
  ' ': ' '
};


/**
 * Stripout invalid characters, symbols and unnecessary spaces
 *
 * - this will converge all repetitive whitespace to a max of 1
 * - this will convert all strings to their lower case equivalents
 * - this will automatically remove all repetitions in the array
 *
 * @param {string[]} data An array of strings to be stripped
 *
 * @example
 * stripText([
 *   "$a$B$c$", "#A#b#C",
 *   "c O  n   V    e     R      g       E"
 * ]); // [ "abc", "c o n v e r g e" ]
 *
 * stripText([
 *   "Hello, World!",
 *   "Hey, I'm David, What's Up?"
 * ]); // [ "hello world", "hey im david whats up" ]
 */
function stripText(data) {
  return [
    ...new Set(
      data.reduce(
        (all, text) =>
          (text = text.normalize('NFD').replace(/\p{Diacritic}|[^\p{Letter} \p{Number}]/gu, ''))
            ? all.concat([text.replace(/\s{2,}/g, ' ').toLowerCase()])
            : all,
        [],
      ),
    ),
  ];
}

/**
 * What percentage of text found in `b` is in `a`
 * @param {string[]} a the base string to be searched in
 * @param {string[]} b the search query
 *
 * @example
 * let a = ["hello", "world", "are", "you", "happy"];
 * let b = ["hello", "dude", "how", "are", "you"];
 * // intersection = ["hello", "are", "you"];
 * // what percentage of `a` is the intersection
 * let c = getWeight(a, b); // 60
 *
 * // AND lookups
 * getWeight(
 *   ["jacob cane", "jessica cane"],
 *   ["cane"]
 * ); // 0
 *
 * getWeight(
 *   ["jacob cane", "jessica cane"],
 *   ["cane", "jessica", "jacob"]
 * ); // 100
 */
function getWeight(a, b) {



  let result = (
    ((b = b.join(' ').split(' ')), a.map(v => v.split(' ').every(p => {
      const roman = p.split('').map((w) => thaiToRomanConsonant[w]).join('')
      return b.includes(p) || b.includes(roman);

    })).filter(v => !!v).length / a.length) * 100
  );

  const containThai = !!a.concat(b).filter(next => next.match(/^[ก-๙\.\ ]{1,100}$/)).length;

  if (containThai && result < 50) {
    a = a.map((next) => {
      if (next.match(/^[ก-๙\.\ ]{1,100}$/)) {
        const thaiToRoman = next.split('').map((w) => thaiToRomanConsonant[w]).filter((w) => !!w).join('');
        if (thaiToRoman) {
          return thaiToRoman
        }
        return next;
      }
      return next;
    });

    b = b.map((next) => {
      if (next.match(/^[ก-๙\.\ ]{1,100}$/)) {
        const thaiToRoman = next.split('').map((w) => thaiToRomanConsonant[w]).filter((w) => !!w).join('');
        if (thaiToRoman) {
          return thaiToRoman
        }
        return next;
      }
      return next;
    });

      const ajoined = a.join('').replace(' ', '')
      const bjoined = b.join('').replace(' ', '')
      /**
       * find how many roman character matched
       */
      const match = calculatePercentageMatch(ajoined, bjoined);
      result += match / 2;
      

  }


  return result;
}

export default { stripText, getWeight };
