# TSL2591

A light to digital converter, that has some bells and whistles.

[![npm Version](http://img.shields.io/npm/v/@johntalton/tsl2591.svg)](https://www.npmjs.com/package/@johntalton/tsl2591)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/tsl2591)
[![CI](https://github.com/johntalton/tsl2591/actions/workflows/CI.yaml/badge.svg)](https://github.com/johntalton/tsl2591/actions/workflows/CI.yaml)
![GitHub](https://img.shields.io/github/license/johntalton/tsl2591)
[![Downloads Per Month](http://img.shields.io/npm/dm/@johntalton/tsl2591.svg)](https://www.npmjs.com/package/@johntalton/tsl2591)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/tsl2591)

# Example

```javascript
import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { TSL2591, DEFAULT_ADDRESS } from '@johntalton/tsl2591'

const bus = /* byob */
const aBus = new I2CAddressedBus(bus, DEFAULT_ADDRESS)
const device = TSL2591.from(aBus)

await device.setProfile({ enable: true, powerOn: true })

const { ch0, ch1 } = await device.getColor()


```

Each channel represents the two analog sensors, full spectrum on `ch0` and inferred on `ch1`.  via magic, once and deduce the lux value.