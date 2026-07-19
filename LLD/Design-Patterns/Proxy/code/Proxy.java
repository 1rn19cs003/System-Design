// Proxy Pattern — virtual proxy that lazily loads an expensive Image.
// Compile: javac Proxy.java
// Run:     java Proxy

interface Image {
    void display();
}

// The RealSubject — expensive to construct.
class RealImage implements Image {
    private String filename;

    RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Loading '" + filename + "' from disk (expensive)...");
    }

    public void display() {
        System.out.println("Displaying '" + filename + "'");
    }
}

// The Proxy — same interface, defers creating the RealImage until display() is first called.
class ProxyImage implements Image {
    private String filename;
    private RealImage realImage;

    ProxyImage(String filename) {
        this.filename = filename;
    }

    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

public class Proxy {
    public static void main(String[] args) {
        Image image = new ProxyImage("vacation.jpg");
        System.out.println("Proxy created, no loading yet.");

        System.out.println("First display() call:");
        image.display();

        System.out.println("Second display() call:");
        image.display();
    }
}
