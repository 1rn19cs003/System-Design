// Prototype Pattern — cloning a game Enemy, demonstrating deep copy of a nested field.
// Compile: javac Prototype.java
// Run:     java Prototype

class Stats {
    int health;
    int damage;

    Stats(int health, int damage) {
        this.health = health;
        this.damage = damage;
    }

    Stats deepCopy() {
        return new Stats(this.health, this.damage);
    }
}

class Enemy implements Cloneable {
    String type;
    Stats stats;

    Enemy(String type, Stats stats) {
        this.type = type;
        this.stats = stats;
    }

    // Deep copy: stats gets its own independent copy, not a shared reference.
    public Enemy clone() {
        return new Enemy(this.type, this.stats.deepCopy());
    }

    public String toString() {
        return type + "{health=" + stats.health + ", damage=" + stats.damage + "}";
    }
}

public class Prototype {
    public static void main(String[] args) {
        Enemy orcPrototype = new Enemy("Orc", new Stats(100, 15));

        Enemy orc1 = orcPrototype.clone();
        Enemy orc2 = orcPrototype.clone();

        // Mutate orc1's stats — orc2 and the prototype must stay unaffected.
        orc1.stats.health = 40;

        System.out.println("Prototype: " + orcPrototype);
        System.out.println("orc1 (damaged): " + orc1);
        System.out.println("orc2 (untouched): " + orc2);
    }
}
