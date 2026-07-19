"""
Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
Run: python command.py
"""

from abc import ABC, abstractmethod


class Light:
    """Receiver — knows how to actually perform the operations."""

    def __init__(self):
        self.on = False

    def turn_on(self):
        self.on = True
        print("Light is ON")

    def turn_off(self):
        self.on = False
        print("Light is OFF")


class RemoteCommand(ABC):
    @abstractmethod
    def execute(self):
        ...

    @abstractmethod
    def undo(self):
        ...


class LightOnCommand(RemoteCommand):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_on()

    def undo(self):
        self.light.turn_off()


class LightOffCommand(RemoteCommand):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_off()

    def undo(self):
        self.light.turn_on()


class RemoteControl:
    """Invoker — triggers commands and keeps a history for undo."""

    def __init__(self):
        self.history = []

    def press_button(self, command: RemoteCommand):
        command.execute()
        self.history.append(command)

    def press_undo(self):
        if not self.history:
            print("Nothing to undo.")
            return
        last = self.history.pop()
        last.undo()


if __name__ == "__main__":
    light = Light()
    remote = RemoteControl()

    on_command = LightOnCommand(light)
    off_command = LightOffCommand(light)

    print("Press ON button:")
    remote.press_button(on_command)

    print("Press OFF button:")
    remote.press_button(off_command)

    print("Press UNDO button:")
    remote.press_undo()

    print("Press UNDO button again:")
    remote.press_undo()

    print("Press UNDO button once more (nothing left):")
    remote.press_undo()
