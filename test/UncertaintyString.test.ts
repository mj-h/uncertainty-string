import { UncertaintyString } from '../src/';

import { expect } from 'chai';

async function checkToNumber(str: string, valExpected: number, uncertExpected: number): Promise<void> {
  it(str + ' -> ' + valExpected + ', ' + uncertExpected, () => {
    const [value, uncertainty] = UncertaintyString.toNumbers(str);
    expect(value).to.eql(valExpected);
    expect(uncertainty).to.eql(uncertExpected);
  });
}

async function checkFromNumbers(val: number, uncert: number, strExpected: string): Promise<void> {
  it(val + ', ' + uncert + ' -> ' + strExpected, () => {
    const str = UncertaintyString.fromNumbers(val, uncert);
    expect(str).to.eql(strExpected);
  });
}

async function todoFromNumbers(val: number, uncert: number, strExpected: string): Promise<void> {
  xit(val + ', ' + uncert + ' -> ' + strExpected, () => {
    const str = UncertaintyString.fromNumbers(val, uncert);
    expect(str).to.eql(strExpected);
  });
}

// Note: You can get floating-point issues, if the uncertainty does not end in 5
// This is not of consequence for the correctness of the tests.
describe('UncertaintyString.toNumbers', async () => {
  checkToNumber('12300(1500)', 12300, 1500);
  checkToNumber('12300.(1500)', 12300, 1500);
  checkToNumber('123(15)', 123, 15);
  checkToNumber('123.(15)', 123, 15);
  checkToNumber('123.1(15)', 123.1, 1.5);
  checkToNumber('123.155(15)', 123.155, 0.015);
  checkToNumber('-123(15)', -123, 15);
  checkToNumber('0.123(15)', 0.123, 0.015);
  checkToNumber('0.1(15)', 0.1, 1.5);
  checkToNumber('0(125)', 0, 125);
  checkToNumber('.125(125)', 0.125, 0.125);
});

describe('UncertaintyString.fromNumbers', async () => {
  checkFromNumbers(125, 15, '125(15)');
  checkFromNumbers(-125, 15, '-125(15)');
  checkFromNumbers(123, 13, '123(13)');
  checkFromNumbers(-123, 13, '-123(13)');
  checkFromNumbers(1.23, 0.23, '1.23(23)');
  checkFromNumbers(-1.23, 0.23, '-1.23(23)');
  checkFromNumbers(0.23, 0.47, '0.23(47)');
  checkFromNumbers(-0.23, 0.47, '-0.23(47)');
  checkFromNumbers(0.234, 0.048, '0.234(48)');
  checkFromNumbers(-0.234, 0.048, '-0.234(48)');
  checkFromNumbers(0.069, 0.041, '0.069(41)');
  checkFromNumbers(-0.069, 0.041, '-0.069(41)');
  checkFromNumbers(0, 1000, '0(1000)');
  checkFromNumbers(0, 100, '0(100)');
  checkFromNumbers(0, 10, '0(10)');
  checkFromNumbers(0, 1, '0.0(10)');
  checkFromNumbers(0, 0.1, '0.00(10)');
  checkFromNumbers(0, 0.01, '0.000(10)');
  checkFromNumbers(0, 0.001, '0.0000(10)');
  checkFromNumbers(-0, 0.1, '0.00(10)');
  checkFromNumbers(-0, 10, '0(10)');
  checkFromNumbers(113, 133, '110(130)'); // rounds
  checkFromNumbers(117, 133, '120(130)'); // properly rounds up
  checkFromNumbers(114, 135, '110(140)'); // properly rounds up
  checkFromNumbers(118, 136, '120(140)'); // properly rounds up
  checkFromNumbers(999999, 1000, '1000000(1000)'); // properly rounds up
  checkFromNumbers(1000, 999, '1000(1000)'); // properly rounds up
  checkFromNumbers(999999, 999, '1000000(1000)'); // properly rounds up
  checkFromNumbers(1.234e30, 2e25, '1234000000000000000000000000000(20000000000000000000000000)'); // big numbers
  checkFromNumbers(-1.234e30, 2e25, '-1234000000000000000000000000000(20000000000000000000000000)'); // negative big numbers
});
