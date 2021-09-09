Uncertainty String
==================

A module for handling physics-style uncertainty-strings, like 1.873(34). 
You can see it in action in this playground: 
[https://mj-h.github.io/uncertainty-string/](https://mj-h.github.io/uncertainty-string/)

Install with 

```sh
npm install uncertainty-string
```

Usage:

```js
const { UncertaintyString } = require("uncertainty-string")

let [value, uncertainty] = UncertaintyString.toNumbers("1.234(56)");
// -> value       = 1.234
//    uncertainty = 0.056

let uncertstr = UncertaintyString.fromNumbers(0.789, 0.015);
// -> uncertstr = 0.789(15)
```

Background
----------
In physics, it is customary to always state the measurement-uncertainty 
together with the measurement. For example: "The length of this stick is 
1.235 meters plus or minus 0.022 meters". Since this is cumbersome, the following
shorthand is often used: "The length of this stick is 1.234(22) meters".

Some debate exists over including the decimal point in the uncertainty:
- with decimal-point: 45.6(2.3)
- without decimal-point: 45.6(23)
Some journals use the decimal-point, others don't. This module follows the
convention used by Physical Review Letters and omits the decimal point (see 
page 1 of [this article](https://journals.aps.org/prl/pdf/10.1103/PhysRevLett.127.072502))



Examples
--------
- "123(15)"
  - mean: 123
  - uncertainty: 15
- "12.3(15)"
  - mean: 12.3
  - uncertainty: 1.5
- "1.23(15)"
  - mean: 1.23
  - uncertainty: 0.15
- "0.123(15)"
  - mean: 0.123
  - uncertainty: 0.015
- "1230(150)"
  - mean: 1230
  - uncertainty: 150
- "12300(1500)"
  - mean: 12300
  - uncertainty: 1500

For a full list of examples, see the [test file](test/UncertaintyString.test.ts) 
or play with `UncertaintyString` on the [playground](https://mj-h.github.io/uncertainty-string/)