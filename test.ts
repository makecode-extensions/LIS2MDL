basic.forever(function () {
    serial.writeValue("x", LIS2MDL.magneticForce(LIS2MDL.Dimension.Strength))
    basic.pause(1000)
})