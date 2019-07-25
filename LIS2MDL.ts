/**
* ST LIS2MDL magnetic Sensor I2C extension for makecode.
* From microbit/micropython Chinese community.
* https://github.com/makecode-extensions
*/

/**
 * ST LIS2MDL magnetic Sensor I2C extension
 */
//% weight=100 color=#505060 icon="\uf076" block="LIS2MDL"
namespace LIS2MDL {
    const LIS2MDL_I2C_ADDR = 0x1E
    const LIS2MDL_CFG_REG_A = 0x60
    const LIS2MDL_CFG_REG_C = 0x62
    const LIS2MDL_STATUS_REG = 0x67
    const LIS2MDL_OUTX_L_REG = 0x68
    const LIS2MDL_OUTY_L_REG = 0x6A
    const LIS2MDL_OUTZ_L_REG = 0x6C

    export enum Dimension {
        //% block="Strength"
        Strength = 0,
        //% block="X"
        X = 1,
        //% block="Y"
        Y = 2,
        //% block="Z"
        Z = 3
    }

    // LP = 0 ODR= 0 MD= 0
    setreg(LIS2MDL_CFG_REG_A, 0x00)
    // BDU = 1
    setreg(LIS2MDL_CFG_REG_C, 0x10)

    let _oneshot = false
    oneshot_mode(false)

    // set dat to reg
    function setreg(reg: number, dat: number): void {
        let tb = pins.createBuffer(2)
        tb[0] = reg
        tb[1] = dat
        pins.i2cWriteBuffer(LIS2MDL_I2C_ADDR, tb)
    }

    // read a Int8LE from reg
    function getInt8LE(reg: number): number {
        pins.i2cWriteNumber(LIS2MDL_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(LIS2MDL_I2C_ADDR, NumberFormat.Int8LE);
    }

    // read a UInt8LE from reg
    function getUInt8LE(reg: number): number {
        pins.i2cWriteNumber(LIS2MDL_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(LIS2MDL_I2C_ADDR, NumberFormat.UInt8LE);
    }

    // read a Int16LE from reg
    function getInt16LE(reg: number): number {
        pins.i2cWriteNumber(LIS2MDL_I2C_ADDR, reg | 0x80, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(LIS2MDL_I2C_ADDR, NumberFormat.Int16LE);
    }

    // read a UInt16LE from reg
    function getUInt16LE(reg: number): number {
        pins.i2cWriteNumber(LIS2MDL_I2C_ADDR, reg | 0x80, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(LIS2MDL_I2C_ADDR, NumberFormat.UInt16LE);
    }

    // set a mask dat to reg
    function setreg_mask(reg: number, dat: number, mask: number): void {
        setreg(reg, (getUInt8LE(reg) & mask) | dat)
    }

    // turn number to int16
    function int16(n: number): number {
        return (n > 0x7fff) ? n - 65536 : n
    }

    // oneshot mode handle
    function ONE_SHOT(): void {
        if (_oneshot) {
            oneshot_mode(true)
            while (true) {
                if (getUInt8LE(LIS2MDL_STATUS_REG) & 0x08) return
            }
        }
    }

    /**
     * set oneshot mode to reduce power consumption
     */
    //% block="oneshot mode %oneshot"
    export function oneshot_mode(oneshot: boolean = false) {
        _oneshot = oneshot
        getInt16LE(LIS2MDL_OUTX_L_REG)
        getInt16LE(LIS2MDL_OUTY_L_REG)
        getInt16LE(LIS2MDL_OUTZ_L_REG)
        let t = (oneshot) ? 1 : 0
        setreg_mask(LIS2MDL_CFG_REG_A, t, 0xFC)
    }

    /**
     * get magneticForce (uT)
     */
    //% block="magneticForce (uT) %dim"
    export function magneticForce(dim: LIS2MDL.Dimension = LIS2MDL.Dimension.X): number {
        ONE_SHOT()
        switch (dim) {
            case Dimension.X:
                return Math.idiv(getInt16LE(LIS2MDL_OUTX_L_REG) * 3, 20);
            case Dimension.Y:
                return Math.idiv(getInt16LE(LIS2MDL_OUTY_L_REG) * 3, 20);
            case Dimension.Z:
                return Math.idiv(getInt16LE(LIS2MDL_OUTZ_L_REG) * 3, 20);
            default:
                let x = (getInt16LE(LIS2MDL_OUTX_L_REG) * 3 / 20) ** 2
                let y = (getInt16LE(LIS2MDL_OUTY_L_REG) * 3 / 20) ** 2
                let z = (getInt16LE(LIS2MDL_OUTZ_L_REG) * 3 / 20) ** 2
                return Math.round(Math.sqrt(x + y + z))
        }
    }

    /**
     * get X/Y/Z-axis magnetic field at once
     */
    //% block="get (uT)"
    export function get(): number[] {
        ONE_SHOT()
        return [Math.idiv(getInt16LE(LIS2MDL_OUTX_L_REG) * 3, 20), Math.idiv(getInt16LE(LIS2MDL_OUTY_L_REG) * 3, 20), Math.idiv(getInt16LE(LIS2MDL_OUTZ_L_REG) * 3, 20)]
    }
}
