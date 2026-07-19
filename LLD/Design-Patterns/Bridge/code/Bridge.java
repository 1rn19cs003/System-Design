// Bridge Pattern — Shape abstraction bridged to a Renderer implementor.
// Compile: javac Bridge.java
// Run:     java Bridge

// Implementor hierarchy
interface Renderer {
    void renderCircle(float radius);
    void renderSquare(float side);
}

class OpenGLRenderer implements Renderer {
    public void renderCircle(float radius) {
        System.out.println("[OpenGL] drawing circle, radius=" + radius);
    }
    public void renderSquare(float side) {
        System.out.println("[OpenGL] drawing square, side=" + side);
    }
}

class DirectXRenderer implements Renderer {
    public void renderCircle(float radius) {
        System.out.println("[DirectX] drawing circle, radius=" + radius);
    }
    public void renderSquare(float side) {
        System.out.println("[DirectX] drawing square, side=" + side);
    }
}

// Abstraction hierarchy
abstract class Shape {
    protected Renderer renderer;

    Shape(Renderer renderer) {
        this.renderer = renderer;
    }

    abstract void draw();
}

class Circle extends Shape {
    private float radius;

    Circle(Renderer renderer, float radius) {
        super(renderer);
        this.radius = radius;
    }

    void draw() {
        renderer.renderCircle(radius);
    }
}

class Square extends Shape {
    private float side;

    Square(Renderer renderer, float side) {
        super(renderer);
        this.side = side;
    }

    void draw() {
        renderer.renderSquare(side);
    }
}

public class Bridge {
    public static void main(String[] args) {
        Shape openGLCircle = new Circle(new OpenGLRenderer(), 5.0f);
        Shape directXSquare = new Square(new DirectXRenderer(), 3.0f);

        openGLCircle.draw();
        directXSquare.draw();
    }
}
