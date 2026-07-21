// Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
// Compile: javac Command.java
// Run:     java Command

import java.util.Stack;

// Receiver — knows how to actually perform the operations.
class Light {
    private boolean on = false;

    void turnOn() {
        on = true;
        System.out.println("Light is ON");
    }

    void turnOff() {
        on = false;
        System.out.println("Light is OFF");
    }
}

interface RemoteCommand {
    void execute();
    void undo();
}

class LightOnCommand implements RemoteCommand {
    private Light light;

    LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }

    public void undo() {
        light.turnOff();
    }
}

class LightOffCommand implements RemoteCommand {
    private Light light;

    LightOffCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOff();
    }

    public void undo() {
        light.turnOn();
    }
}

// Invoker — triggers commands and keeps a history for undo.
class RemoteControl {
    private Stack<RemoteCommand> history = new Stack<>();

    void pressButton(RemoteCommand command) {
        command.execute();
        history.push(command);
    }

    void pressUndo() {
        if (history.isEmpty()) {
            System.out.println("Nothing to undo.");
            return;
        }
        RemoteCommand last = history.pop();
        last.undo();
    }
}

public class Command {
    public static void main(String[] args) {
        Light light = new Light();
        RemoteControl remote = new RemoteControl();

        RemoteCommand onCommand = new LightOnCommand(light);
        RemoteCommand offCommand = new LightOffCommand(light);

        System.out.println("Press ON button:");
        remote.pressButton(onCommand);

        System.out.println("Press OFF button:");
        remote.pressButton(offCommand);

        System.out.println("Press UNDO button:");
        remote.pressUndo();

        System.out.println("Press UNDO button again:");
        remote.pressUndo();

        System.out.println("Press UNDO button once more (nothing left):");
        remote.pressUndo();
    }
}
