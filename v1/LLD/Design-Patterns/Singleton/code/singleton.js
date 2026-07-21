/**
 * Singleton Pattern — JavaScript's module cache already gives you a
 * singleton for free (require/import only evaluates a module once),
 * but this shows the classic explicit pattern too, using a class with
 * a static instance and a frozen export.
 *
 * Run: node singleton.js
 */

class Singleton {
  static #instance; // private static field
  #requestCount = 0;

  constructor() {
    if (Singleton.#instance) {
      throw new Error("Use Singleton.getInstance() instead of `new Singleton()`");
    }
    console.log("Singleton instance created.");
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }

  logRequest() {
    this.#requestCount++;
    console.log(`Handled request #${this.#requestCount}`);
  }
}

const a = Singleton.getInstance();
const b = Singleton.getInstance();

a.logRequest();
b.logRequest();

console.log("a === b:", a === b); // true -> same instance

module.exports = Singleton;
