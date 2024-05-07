export const PACKAGE_ID = 0x00
export const DEVICE_ID = 0x50

export const COMMAND_BIT = 0b1000_0000
export const COMMAND_OPERATION_NORMAL_BITS = 0b0010_0000
export const COMMAND_OPERATION_SPECIAL_FUNCTION_BITS = 0x0110_0000

export const COMMAND_SPECIAL_FUNCTION_SET_INTERRUPT = 0b0000_00100
export const COMMAND_SPECIAL_FUNCTION_CLEAR_INTERRUPT = 0b0000_00110
export const COMMAND_SPECIAL_FUNCTION_CLEAR_ALL_INTERRUPTS = 0b0000_00111
export const COMMAND_SPECIAL_FUNCTION_CLEAR_NO_PERSIST_INTERRUPT = 0b0000_0101

export const NORMAL_COMMAND = COMMAND_BIT | COMMAND_OPERATION_NORMAL_BITS
export const SPECIAL_COMMAND = COMMAND_BIT | COMMAND_OPERATION_SPECIAL_FUNCTION_BITS

export const REGISTERS = {
	ENABLE: NORMAL_COMMAND | 0x00,
	CONFIG: NORMAL_COMMAND | 0x01,

	AILTL: NORMAL_COMMAND | 0x04,
	AILTH: NORMAL_COMMAND | 0x05,
	AIHTL: NORMAL_COMMAND | 0x06,
	AIHTH: NORMAL_COMMAND | 0x7,
	NPAILTL: NORMAL_COMMAND | 0x08,
	NPAILTH: NORMAL_COMMAND | 0x09,
	NPAIHTL: NORMAL_COMMAND | 0x0A,
	NPAIHTH: NORMAL_COMMAND | 0x0B,

	PERSIST: NORMAL_COMMAND | 0x0C,

	PID: NORMAL_COMMAND | 0x11,
	ID: NORMAL_COMMAND | 0x12,
	STATUS: NORMAL_COMMAND | 0x13,

	C0DATAL: NORMAL_COMMAND | 0x14,
	C0DATAH: NORMAL_COMMAND | 0x15,
	C1DATAL: NORMAL_COMMAND | 0x16,
	C1DATAH: NORMAL_COMMAND | 0x17
}

export const BLOCKS = {
	THRESHOLD: { START: REGISTERS.AILTL, LENGTH: 8 },
	COLOR: { START: REGISTERS.C0DATAL, LENGTH: 4 },
	PROFILE: { START: REGISTERS.ENABLE, LENGTH: 2 }
}

//
export const GAIN_MODE_LOW =  0b00
export const GAIN_MODE_MEDIUM =  0b01
export const GAIN_MODE_HIGH =  0b10
export const GAIN_MODE_MAX =  0b11

//
export const INTEGRATION_TIME_100_MS = 0b000
export const INTEGRATION_TIME_200_MS = 0b001
export const INTEGRATION_TIME_300_MS = 0b010
export const INTEGRATION_TIME_400_MS = 0b011
export const INTEGRATION_TIME_500_MS = 0b100
export const INTEGRATION_TIME_600_MS = 0b101

//
export const PERSISTENCE_EVERY = 0b0000
export const PERSISTENCE_ANY = 0b0001
export const PERSISTENCE_2 = 0b0010
export const PERSISTENCE_3 = 0b0011
export const PERSISTENCE_5 = 0b0100
export const PERSISTENCE_10 = 0b0101
export const PERSISTENCE_15 = 0b0110
export const PERSISTENCE_20 = 0b0111
export const PERSISTENCE_25 = 0b1000
export const PERSISTENCE_30 = 0b1001
export const PERSISTENCE_35 = 0b1010
export const PERSISTENCE_40 = 0b1011
export const PERSISTENCE_45 = 0b1100
export const PERSISTENCE_50 = 0b1101
export const PERSISTENCE_55 = 0b1110
export const PERSISTENCE_60 = 0b1111