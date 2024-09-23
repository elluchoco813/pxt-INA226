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
      readvoltage(){
        
      }
  
      readCurrent(){
        
      }
    
  }
  
}
