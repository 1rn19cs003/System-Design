/**
 * Proxy Pattern — virtual proxy that lazily loads an expensive Image.
 * Run: node proxy.js
 */

class RealImage {
  constructor(filename) {
    this.filename = filename;
    this.loadFromDisk();
  }

  loadFromDisk() {
    console.log(`Loading '${this.filename}' from disk (expensive)...`);
  }

  display() {
    console.log(`Displaying '${this.filename}'`);
  }
}

class ProxyImage {
  constructor(filename) {
    this.filename = filename;
    this.realImage = null;
  }

  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

const image = new ProxyImage("vacation.jpg");
console.log("Proxy created, no loading yet.");

console.log("First display() call:");
image.display();

console.log("Second display() call:");
image.display();

module.exports = { RealImage, ProxyImage };
