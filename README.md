# ST LIS2MDL magnetic Sensor Package

ST LIS2MDL magnetic Sensor I2C extension for makecode.  

Author: shaoziyang  
Date:   2019.Jul  

## Basic usage
```
basic.forever(function () {
    serial.writeValue("x", LIS2MDL.magneticForce(LIS2MDL.Dimension.Strength))
    basic.pause(1000)
})
```


## License

MIT

Copyright (c) 2018, microbit/micropython Chinese community  

## Supported targets

* for PXT/microbit


[From microbit/micropython Chinese community](http://www.micropython.org.cn)
