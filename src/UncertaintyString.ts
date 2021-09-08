const MAX_DIGITS = 16; // JS floats only give 15.9 digits of precision.

export abstract class UncertaintyString {
  static toNumbers(str: string): number[] {
    const parts = str.split('(');
    if (parts.length != 2 || !parts[1].endsWith(')')) {
      throw 'Uncertainty-string does not contain proper parentheses: ' + str;
    }
    parts[1] = parts[1].slice(0, -1);
    if (parts[1].indexOf('.') >= 0) {
      throw 'The uncertainty-part of an uncertainty-string should not contain a period. Error in: ' + str;
    }
    let leastSignificantDecimalPosition = 0;
    const periodIndex = parts[0].indexOf('.');
    if (periodIndex >= 0) {
      leastSignificantDecimalPosition = parts[0].length - periodIndex - 1;
    }
    const value = parseFloat(parts[0]);
    const uncertainty = parseFloat(parts[1]) * Math.pow(10, -leastSignificantDecimalPosition);
    return [value, uncertainty];
  }

  /**
   * Assembles an uncertainty-string such as "0.1234(55)", which stands for
   * "a measurement of 0.1234 with an uncertainty of 0.0055".
   *
   * @param val The value, e.g. 0.1324
   * @param uncert The uncertainty, e.g., 0.077
   * @returns A shorthand for value and uncertainty, e.g. "1234(77)"
   */
  static fromNumbers(val: number, uncert: number): string {
    const [uncertStr, magUncert] = createUncertStr(uncert);
    let sign = 0;
    let digitStr = '0';
    let magOfLeadingDigit = 0;
    if (val != 0) {
      sign = Math.sign(val);
      digitStr = createStrUntilMagX(val / sign, magUncert - 1);
      magOfLeadingDigit = magUncert - 1 + digitStr.length - 1;
    }
    // place decimal point
    if (magOfLeadingDigit < 0) {
      // prepend 0.00...
      digitStr = '0.'.padEnd(2 - magOfLeadingDigit - 1, '0') + digitStr;
    } else if (val === 0 && magUncert - 1 < 0) {
      // replace with 0.00
      digitStr = '0.'.padEnd(3 - magUncert, '0');
    } else if (magUncert - 1 > 0 && val !== 0) {
      // append 000...
      digitStr = digitStr.padEnd(digitStr.length + magUncert - 1, '0');
    } else if (magUncert - 1 < 0) {
      // insert period
      const pos = magOfLeadingDigit + 1;
      digitStr = digitStr.substring(0, pos) + '.' + digitStr.substring(pos);
    }
    const signStr = sign < 0 ? '-' : '';
    return signStr + digitStr + '(' + uncertStr + ')';
  }
}

function createUncertStr(number: number): [string, number] {
  const numberAsExpStr = number.toExponential();
  const decimalMantissa = Number(numberAsExpStr.split('e')[0]);
  let mag = parseInt(numberAsExpStr.split('e')[1]);
  let numberRoundedAsStr = decimalMantissa.toFixed(1);
  if (numberRoundedAsStr == '10.0') {
    // rounding edge-case
    mag = mag + 1;
    numberRoundedAsStr = '10';
  }
  const uncertStr = numberRoundedAsStr.replace('.', '').padEnd(mag + 1, '0');
  return [uncertStr, mag];
}

function createStrUntilMagX(number: number, magEnd: number): string {
  const numberAsExpStr = number.toExponential();
  const decimalMantissa = Number(numberAsExpStr.split('e')[0]);
  const magOfNumber = parseInt(numberAsExpStr.split('e')[1]);
  if (magOfNumber - magEnd > MAX_DIGITS) {
    throw `Can only work with maximum of ${MAX_DIGITS} digits, not ${magOfNumber - magEnd} digits.`;
  }
  const numberRoundedAsStr = decimalMantissa.toFixed(magOfNumber - magEnd);
  return numberRoundedAsStr.replace('.', '');
}
