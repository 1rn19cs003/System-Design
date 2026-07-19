/**
 * Singleton Pattern — thread-safe lazy initialization (double-checked locking).
 * Compile:  javac Singleton.java
 * Run:      java Singleton
 */
public class Singleton {

    // volatile ensures visibility of the fully-constructed instance across threads
    private static volatile Singleton instance;

    private int requestCount = 0;

    // Private constructor prevents `new Singleton()` from outside this class
    private Singleton() {
        System.out.println("Singleton instance created.");
    }

    public static Singleton getInstance() {
        if (instance == null) {                 // first check (no locking, fast path)
            synchronized (Singleton.class) {
                if (instance == null) {          // second check (inside the lock)
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public void logRequest() {
        requestCount++;
        System.out.println("Handled request #" + requestCount);
    }

    public static void main(String[] args) {
        Singleton a = Singleton.getInstance();
        Singleton b = Singleton.getInstance();

        a.logRequest();
        b.logRequest();

        System.out.println("a == b: " + (a == b)); // true -> same instance
    }
}
