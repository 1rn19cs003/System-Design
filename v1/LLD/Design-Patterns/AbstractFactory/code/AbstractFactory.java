// Abstract Factory Pattern — cross-platform UI widget families.
// Compile: javac AbstractFactory.java
// Run:     java AbstractFactory

interface Button {
    void render();
}

interface Checkbox {
    void render();
}

class WindowsButton implements Button {
    public void render() { System.out.println("Rendering a Windows-style button."); }
}

class WindowsCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering a Windows-style checkbox."); }
}

class MacButton implements Button {
    public void render() { System.out.println("Rendering a Mac-style button."); }
}

class MacCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering a Mac-style checkbox."); }
}

interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements UIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements UIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

public class AbstractFactory {
    static void renderUI(UIFactory factory) {
        Button button = factory.createButton();
        Checkbox checkbox = factory.createCheckbox();
        button.render();
        checkbox.render();
    }

    public static void main(String[] args) {
        System.out.println("-- Windows family --");
        renderUI(new WindowsFactory());

        System.out.println("-- Mac family --");
        renderUI(new MacFactory());
    }
}
