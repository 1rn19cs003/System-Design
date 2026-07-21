/**
 * Builder Pattern — assembling a Computer with optional parts.
 * Run: node builder.js
 */

class Computer {
  constructor({ cpu, ramGB, storageGB, hasGPU }) {
    this.cpu = cpu;
    this.ramGB = ramGB;
    this.storageGB = storageGB;
    this.hasGPU = hasGPU;
  }

  toString() {
    return `Computer{cpu=${this.cpu}, ramGB=${this.ramGB}, storageGB=${this.storageGB}, hasGPU=${this.hasGPU}}`;
  }
}

class ComputerBuilder {
  constructor() {
    this._cpu = null;
    this._ramGB = 0;
    this._storageGB = 0;
    this._hasGPU = false;
  }

  setCPU(cpu) {
    this._cpu = cpu;
    return this;
  }

  setRAM(ramGB) {
    this._ramGB = ramGB;
    return this;
  }

  setStorage(storageGB) {
    this._storageGB = storageGB;
    return this;
  }

  addGPU() {
    this._hasGPU = true;
    return this;
  }

  build() {
    return new Computer({
      cpu: this._cpu,
      ramGB: this._ramGB,
      storageGB: this._storageGB,
      hasGPU: this._hasGPU,
    });
  }
}

const officePC = new ComputerBuilder()
  .setCPU("Intel i5")
  .setRAM(16)
  .setStorage(512)
  .build();

const gamingPC = new ComputerBuilder()
  .setCPU("Intel i9")
  .setRAM(32)
  .setStorage(2000)
  .addGPU()
  .build();

console.log(officePC.toString());
console.log(gamingPC.toString());

module.exports = { Computer, ComputerBuilder };
