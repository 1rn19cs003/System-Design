"""
Abstract Factory Pattern — cross-platform UI widget families.
Run: python abstract_factory.py
"""

from abc import ABC, abstractmethod


class Button(ABC):
    @abstractmethod
    def render(self):
        ...


class Checkbox(ABC):
    @abstractmethod
    def render(self):
        ...


class WindowsButton(Button):
    def render(self):
        print("Rendering a Windows-style button.")


class WindowsCheckbox(Checkbox):
    def render(self):
        print("Rendering a Windows-style checkbox.")


class MacButton(Button):
    def render(self):
        print("Rendering a Mac-style button.")


class MacCheckbox(Checkbox):
    def render(self):
        print("Rendering a Mac-style checkbox.")


class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        ...

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        ...


class WindowsFactory(UIFactory):
    def create_button(self) -> Button:
        return WindowsButton()

    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()


class MacFactory(UIFactory):
    def create_button(self) -> Button:
        return MacButton()

    def create_checkbox(self) -> Checkbox:
        return MacCheckbox()


def render_ui(factory: UIFactory):
    button = factory.create_button()
    checkbox = factory.create_checkbox()
    button.render()
    checkbox.render()


if __name__ == "__main__":
    print("-- Windows family --")
    render_ui(WindowsFactory())

    print("-- Mac family --")
    render_ui(MacFactory())
