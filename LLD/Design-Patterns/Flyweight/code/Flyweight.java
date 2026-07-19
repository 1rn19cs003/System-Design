// Flyweight Pattern — sharing tree type data (intrinsic) across many tree instances.
// Compile: javac Flyweight.java
// Run:     java Flyweight

import java.util.HashMap;
import java.util.Map;

// The Flyweight: shared, immutable intrinsic state.
class TreeType {
    private final String name;
    private final String color;
    private final String texture;

    TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }

    void render(int x, int y) {
        // x, y are extrinsic state, passed in rather than stored here.
        System.out.println("Rendering " + name + " (" + color + ", " + texture + ") at (" + x + "," + y + ")");
    }
}

// The Flyweight Factory: caches one TreeType per unique combination.
class TreeTypeFactory {
    private static Map<String, TreeType> cache = new HashMap<>();

    static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "-" + color + "-" + texture;
        if (!cache.containsKey(key)) {
            System.out.println("Creating new TreeType for: " + key);
            cache.put(key, new TreeType(name, color, texture));
        }
        return cache.get(key);
    }

    static int cacheSize() {
        return cache.size();
    }
}

// Tree only stores extrinsic state + a reference to its shared TreeType.
class Tree {
    private int x, y;
    private TreeType type;

    Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    void render() {
        type.render(x, y);
    }
}

public class Flyweight {
    public static void main(String[] args) {
        Tree[] forest = new Tree[]{
            new Tree(10, 20, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
            new Tree(30, 40, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
            new Tree(50, 60, TreeTypeFactory.getTreeType("Pine", "DarkGreen", "Smooth")),
        };

        for (Tree tree : forest) {
            tree.render();
        }

        System.out.println("Trees created: " + forest.length + ", TreeType flyweights cached: " + TreeTypeFactory.cacheSize());
    }
}
