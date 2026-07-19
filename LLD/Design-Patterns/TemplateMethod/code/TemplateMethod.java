// Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
// Compile: javac TemplateMethod.java
// Run:     java TemplateMethod

abstract class CaffeineBeverage {
    // The template method — final so subclasses can't change the sequence.
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (wantsCondiments()) {
            addCondiments();
        }
    }

    void boilWater() {
        System.out.println("Boiling water");
    }

    void pourInCup() {
        System.out.println("Pouring into cup");
    }

    abstract void brew();
    abstract void addCondiments();

    // Hook — subclasses may override; default is "yes".
    boolean wantsCondiments() {
        return true;
    }
}

class Tea extends CaffeineBeverage {
    void brew() {
        System.out.println("Steeping the tea");
    }

    void addCondiments() {
        System.out.println("Adding lemon");
    }
}

class Coffee extends CaffeineBeverage {
    void brew() {
        System.out.println("Dripping coffee through filter");
    }

    void addCondiments() {
        System.out.println("Adding sugar and milk");
    }

    // Overrides the hook — this coffee is prepared black.
    boolean wantsCondiments() {
        return false;
    }
}

public class TemplateMethod {
    public static void main(String[] args) {
        System.out.println("Preparing tea:");
        CaffeineBeverage tea = new Tea();
        tea.prepareRecipe();

        System.out.println("Preparing coffee (no condiments):");
        CaffeineBeverage coffee = new Coffee();
        coffee.prepareRecipe();
    }
}
