/**
 * Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
 * Run: node command.js
 */

class Light {
  constructor() {
    this.on = false;
  }

  turnOn() {
    this.on = true;
    console.log("Light is ON");
  }

  turnOff() {
    this.on = false;
    console.log("Light is OFF");
  }
}

class LightOnCommand {
  constructor(light) {
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand {
  constructor(light) {
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

class RemoteControl {
  constructor() {
    this.history = [];
  }

  pressButton(command) {
    command.execute();
    this.history.push(command);
  }

  pressUndo() {
    if (this.history.length === 0) {
      console.log("Nothing to undo.");
      return;
    }
    const last = this.history.pop();
    last.undo();
  }
}

const light = new Light();
const remote = new RemoteControl();

const onCommand = new LightOnCommand(light);
const offCommand = new LightOffCommand(light);

console.log("Press ON button:");
remote.pressButton(onCommand);

console.log("Press OFF button:");
remote.pressButton(offCommand);

console.log("Press UNDO button:");
remote.pressUndo();

console.log("Press UNDO button again:");
remote.pressUndo();

console.log("Press UNDO button once more (nothing left):");
remote.pressUndo();

module.exports = { Light, LightOnCommand, LightOffCommand, RemoteControl };
