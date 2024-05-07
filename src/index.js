import {
	BLOCKS,
	REGISTERS
} from './defs.js'

const LENGTH_ONE_BYTE = 1
const BIT_SET = 1

export class TSL2591 {
	#aBus

	constructor(aBus) { this.#aBus = aBus }

	async triggerInterrupt() {}
	async clearInterrupt(persist, noPersist) {}

	async getProfile() {
		const buffer = await this.#aBus.readI2cBlock(BLOCKS.PROFILE.START, BLOCKS.PROFILE.LENGTH)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const enable = u8[0]
		const control = u8[1]

		const noPersistInterruptEnabled = ((enable >> 7) & 0b1) === BIT_SET
		const sleepAfterInterrupt = ((enable >> 6) & 0b1) === BIT_SET
		const interruptEnabled = ((enable >> 4) & 0b1) === BIT_SET
		const enabled = ((enable >> 1) & 0b1) === BIT_SET
		const powerOn = (enable & 0b1) === BIT_SET

		const resetFlag = ((control >> 7) & 0b1) === BIT_SET
		const gain = ((control >> 4) & 0b11) === BIT_SET
		const time = (control & 0b111) === BIT_SET

		return {
			noPersistInterruptEnabled,
			interruptEnabled,
			sleepAfterInterrupt,
			enabled,
			powerOn,

			resetFlag,
			gain,
			time
		}
	}

	async getPackageID() {
		const buffer = await this.#aBus.readI2cBlock(REGISTERS.PID, LENGTH_ONE_BYTE)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		return (u8[0] >> 4) & 0b11
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

		const noPersistInterruptFlag = ((status >> 5) & 0b1) === BIT_SET
		const interruptFlag = ((status >> 4) & 0b1) === BIT_SET
		const valid = (status & 0b1) === BIT_SET

		return {
			noPersistInterruptFlag,
			interruptFlag,
			valid
		}
	}

	async getColor() {
		const buffer = await this.#aBus.readI2cBlock(BLOCKS.COLOR.START, BLOCKS.COLOR.LENGTH)
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)


		return {
			ch0: 0,
			ch1: 0
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

		return {
			interruptLow,
			interruptHigh,
			noPersistInterruptLow,
			noPersistInterruptHigh
		}
	}
}