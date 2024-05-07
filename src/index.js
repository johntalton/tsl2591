import {
	BLOCKS,
	COMMAND_SPECIAL_FUNCTION_CLEAR_ALL_INTERRUPTS,
	COMMAND_SPECIAL_FUNCTION_CLEAR_INTERRUPT,
	COMMAND_SPECIAL_FUNCTION_CLEAR_NO_PERSIST_INTERRUPT,
	COMMAND_SPECIAL_FUNCTION_SET_INTERRUPT,
	CONTROL_RESET_BIT,
	GAIN_MODE_LOW,
	INTEGRATION_TIME_100_MS,
	PERSISTENCE_EVERY,
	REGISTERS,
	SPECIAL_COMMAND
} from './defs.js'

export * from './defs.js'

const LENGTH_ONE_BYTE = 1

const BIT_SET = 1
const BIT_UNSET = 0

const MASK_ONE_BIT = 0b1
const MASK_TWO_BIT = 0b11
const MASK_THREE_BIT = 0b111
const MASK_FOUR_BIT = 0b1111

export class TSL2591 {
	#aBus

	static from(aBus) { return new TSL2591(aBus) }

	constructor(aBus) { this.#aBus = aBus }

	async reset() {
		return this.#aBus.writeI2cBlock(REGISTERS.CONFIG, Uint8Array.from([ CONTROL_RESET_BIT ]))
	}

	async triggerInterrupt() {
		const command = SPECIAL_COMMAND | COMMAND_SPECIAL_FUNCTION_SET_INTERRUPT
		return this.#aBus.i2cWrite(Uint8Array.from([ command ]))
	}

	async clearInterrupt(nonPersistent, persistent) {
		const specialCommand = (persistent && nonPersistent) ? COMMAND_SPECIAL_FUNCTION_CLEAR_ALL_INTERRUPTS :
			persistent ? COMMAND_SPECIAL_FUNCTION_CLEAR_INTERRUPT :
			COMMAND_SPECIAL_FUNCTION_CLEAR_NO_PERSIST_INTERRUPT

		const command = SPECIAL_COMMAND | specialCommand
		return this.#aBus.i2cWrite(Uint8Array.from([ command ]))
	}

	async getProfile() {
		const buffer = await this.#aBus.readI2cBlock(BLOCKS.PROFILE.START, BLOCKS.PROFILE.LENGTH)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const enable = u8[0]
		const control = u8[1]

		const noPersistInterruptEnabled = ((enable >> 7) & MASK_ONE_BIT) === BIT_SET
		const sleepAfterInterrupt = ((enable >> 6) & MASK_ONE_BIT) === BIT_SET
		const interruptEnabled = ((enable >> 4) & MASK_ONE_BIT) === BIT_SET
		const enabled = ((enable >> 1) & MASK_ONE_BIT) === BIT_SET
		const powerOn = (enable & MASK_ONE_BIT) === BIT_SET

		const gain = (control >> 4) & MASK_TWO_BIT
		const time = control & MASK_THREE_BIT

		return {
			noPersistInterruptEnabled,
			interruptEnabled,
			sleepAfterInterrupt,
			enabled,
			powerOn,

			gain,
			time
		}
	}

	async setProfile({
		enableNoPersistInterrupt = false,
		enableInterrupt = false,
		enableSleepAfterInterrupt = false,
		enabled = false,
		powerOn = false,
		gain = GAIN_MODE_LOW,
		time = INTEGRATION_TIME_100_MS
	}) {
		const enable = ((enableNoPersistInterrupt ? BIT_SET : BIT_UNSET) << 7) |
			((enableSleepAfterInterrupt ? BIT_SET : BIT_UNSET) << 6) |
			((enableInterrupt ? BIT_SET : BIT_UNSET) << 4) |
			((enabled ? BIT_SET : BIT_UNSET) << 1) |
			(powerOn ? BIT_SET : BIT_UNSET)

		const control = ((gain & MASK_TWO_BIT) << 4) | ((time & MASK_THREE_BIT))

		const buffer = Uint8Array.from([ enable, control ])
		return this.#aBus.writeI2cBlock(BLOCKS.PROFILE.START, buffer)
	}

	async getPackageID() {
		const buffer = await this.#aBus.readI2cBlock(REGISTERS.PID, LENGTH_ONE_BYTE)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		return (u8[0] >> 4) & MASK_TWO_BIT
	}

	async getDeviceID() {
		const buffer = await this.#aBus.readI2cBlock(REGISTERS.ID, LENGTH_ONE_BYTE)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		return u8[0]
	}

	async getStatus() {
		const buffer = await this.#aBus.readI2cBlock(REGISTERS.STATUS, LENGTH_ONE_BYTE)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [status] = u8

		const noPersistInterruptFlag = ((status >> 5) & MASK_ONE_BIT) === BIT_SET
		const interruptFlag = ((status >> 4) & MASK_ONE_BIT) === BIT_SET
		const valid = (status & MASK_ONE_BIT) === BIT_SET

		return {
			noPersistInterruptFlag,
			interruptFlag,
			valid
		}
	}

	async getColor() {
		const buffer = await this.#aBus.readI2cBlock(BLOCKS.COLOR.START, BLOCKS.COLOR.LENGTH)
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new DataView(buffer)

		const ch0 = dv.getUint16(0, true)
		const ch1 = dv.getUint16(2, true)

		return {
			ch0,
			ch1
		}
	}

	async getThresholds() {
		const buffer = await this.#aBus.readI2cBlock(BLOCKS.THRESHOLD.START, BLOCKS.THRESHOLD.LENGTH)
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new DataView(buffer)

		const interruptLow = dv.getUint16(0, true)
		const interruptHigh = dv.getUint16(2, true)
		const noPersistInterruptLow = dv.getUint16(4, true)
		const noPersistInterruptHigh = dv.getUint16(6, true)

		const persist = dv.getUint8(8) & MASK_FOUR_BIT

		return {
			interruptLow,
			interruptHigh,
			noPersistInterruptLow,
			noPersistInterruptHigh,
			persist
		}
	}

	async setThreshold({
		interruptLow = 0,
		interruptHigh = 0,
		noPersistInterruptLow = 0,
		noPersistInterruptHigh = 0,
		persist = PERSISTENCE_EVERY
	}) {
		const buffer = new ArrayBuffer(BLOCKS.THRESHOLD.LENGTH)
		const dv = new DataView(buffer)

		dv.setUint16(0, interruptLow, true)
		dv.setUint16(2, interruptHigh, true)
		dv.setUint16(4, noPersistInterruptLow, true)
		dv.setUint16(6, noPersistInterruptHigh, true)
		dv.setUint8(8, persist)

		return this.#aBus.writeI2cBlock(BLOCKS.THRESHOLD.START, buffer)
	}
}
