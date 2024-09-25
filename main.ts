namespace grovein226 {
  export function createINA(): INA226
    {
        let ina = new INA226();
        
        ina.init();
        
        return ina;
    }
  export class INA226 {
        // Aquí defines las propiedades y métodos para interactuar con el sensor
      private i2cAddress: number;
      private currentLSB: number;
      private shunt: number;
      private maxCurrent: number;
    
      constructor(address: number){
          this.i2cAddress = address;
          this.currentLSB = 0.0;
          this.shunt = 0.002;
          this.maxCurrent = 20.0;
        }
  
      init(): boolean {
        // Intentamos realizar alguna operación básica como leer el ID del fabricante
        let manufacterID = this.readRegister(0xFE); // Leer el registro del ID del fabricante

        if (manufacterID == 0x5449){
          //Si el ID es correcto se retorna un true y la inicialización es exitosa
          return true;
        } else{
          //Si no es correcto el ID, se retorna false, indicando que no hay respuesta 
          return false;
        }
      }

      private readRegister(reg: number): number{
          pins.i2cWriteNumber(this.address, reg, NumberFormat.UInt8BR);//se comunica a la direccion i2c y se especifica que el registro es en formato unsigned 8-bit con codificación BE
          let buffer = pins.i2cReadBuffer(this.address, 2); //en esta linea lee los datos del dispositivo, el 2 corresponde a los dos bytes que es el tamaño del registro del INA226
          return (buffer[0] << 8) | buffer[1]; //retorna el registro, para ello se hace un corrimiento y un OR para leer los 16 bits del registro
      }

      writeRegister(register:number, value: number): boolean{
          //Se crea un buffer de 3 bytes, 1 para indicar el registro a escribir y 2 para ingresar el valor que se escribirá en este
          let buffer = pins.createBuffer(3);

          //Buffer para definir el registro en el que se escribirá
          buffer.setNumber(NumberFormat.UInt8LE, 0, register);

          //Buffer para definir el valor que se escribirá
          buffer.setNumber(NumberFormat.UInt16BE, 1, value);

          //Se escribe a traves de i2c y la dirección del INA
          let result = pins.i2cWriteBuffer(this.address, buffer);
          //Si el resultado es 0 se indica que se escribió correctamente, por ende se retorna un true
          return result == 0;
      }
    
      setModeShuntBusContinuous(): boolean {
          let config = this.readRegister(0x00); // Leer el registro de configuración
          config &= ~(0x07); // Limpiar los bits del modo
          config |= 0x07; // Establecer el modo "Shunt and Bus continuous"
          return this.writeRegister(0x00, config); // Escribir el nuevo valor en el registro
      }

      setAverage(average: number): boolean {
          let config = this.readRegister(0x00); // Leer el registro de configuración
          config &= ~(0x0E00); // Limpiar los bits del promedio
          config |= (average << 9); // Establecer el valor del promedio (ajustar el shift según la tabla de bits del INA226)
          return this.writeRegister(0x00, config); // Escribir el nuevo valor en el registro
      }

      setBusVoltageConversionTime(time: number): boolean {
          let config = this.readRegister(0x00); // Leer el registro de configuración
          config &= ~(0x01C0); // Limpiar los bits del tiempo de conversión del bus
          config |= (time << 6); // Establecer el tiempo de conversión (según la tabla de tiempos)
          return this.writeRegister(0x00, config); // Escribir el nuevo valor en el registro
      }

      setShuntVoltageConversionTime(time: number): boolean {
          let config = this.readRegister(0x00); // Leer el registro de configuración
          config &= ~(0x0038); // Limpiar los bits del tiempo de conversión del shunt
          config |= (time << 3); // Establecer el tiempo de conversión (según la tabla de tiempos)
          return this.writeRegister(0x00, config); // Escribir el nuevo valor en el registro
      }

    
      readvoltage(){
          let rawVoltage = this.readRegister(0x02); // Leer el registro de voltaje
          // Convertir el valor crudo a voltios
          let voltage = rawVoltage * this.shunt; // Ajusta esto según la fórmula correcta para el INA226
          return voltage;
      }
  
      readCurrent(){
          let rawCurrent = this.readRegister(0x04); // Leer el registro de corriente
          // Convertir el valor crudo a amperios
          let current = rawCurrent * this.currentLSB; // Ajusta esto según la relación que tienes para currentLSB
          return current;
      }
    
  }
  
}
