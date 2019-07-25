basic.forever(function () {
    serial.writeNumbers(LIS2MDL.get())
    basic.pause(1000)
})