/**
 * Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
 * Run: node template_method.js
 */

class CaffeineBeverage {
  // The template method — the fixed sequence of steps.
  prepareRecipe() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.wantsCondiments()) {
      this.addCondiments();
    }
  }

  boilWater() {
    console.log("Boiling water");
  }

  pourInCup() {
    console.log("Pouring into cup");
  }

  brew() {
    throw new Error("brew() must be implemented by subclass");
  }

  addCondiments() {
    throw new Error("addCondiments() must be implemented by subclass");
  }

  // Hook — subclasses may override; default is true.
  wantsCondiments() {
    return true;
  }
}

class Tea extends CaffeineBeverage {
  brew() {
    console.log("Steeping the tea");
  }

  addCondiments() {
    console.log("Adding lemon");
  }
}

class Coffee extends CaffeineBeverage {
  brew() {
    console.log("Dripping coffee through filter");
  }

  addCondiments() {
    console.log("Adding sugar and milk");
  }

  wantsCondiments() {
    return false;
  }
}

console.log("Preparing tea:");
const tea = new Tea();
tea.prepareRecipe();

console.log("Preparing coffee (no condiments):");
const coffee = new Coffee();
coffee.prepareRecipe();

module.exports = { CaffeineBeverage, Tea, Coffee };
