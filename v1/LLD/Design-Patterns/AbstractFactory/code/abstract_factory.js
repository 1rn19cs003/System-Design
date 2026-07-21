/**
 * Abstract Factory Pattern — cross-platform UI widget families.
 * Run: node abstract_factory.js
 */

class WindowsButton {
  render() { console.log("Rendering a Windows-style button."); }
}
class WindowsCheckbox {
  render() { console.log("Rendering a Windows-style checkbox."); }
}
class MacButton {
  render() { console.log("Rendering a Mac-style button."); }
}
class MacCheckbox {
  render() { console.log("Rendering a Mac-style checkbox."); }
}

class WindowsFactory {
  createButton() { return new WindowsButton(); }
  createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

function renderUI(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  button.render();
  checkbox.render();
}

console.log("-- Windows family --");
renderUI(new WindowsFactory());

console.log("-- Mac family --");
renderUI(new MacFactory());

module.exports = { WindowsFactory, MacFactory };
