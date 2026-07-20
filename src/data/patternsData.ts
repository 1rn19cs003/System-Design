export interface PatternData {
  slug: string;
  category: 'creational' | 'structural' | 'behavioral';
  title: string;
  tag: string;
  description: string;
  plainEnglish: string;
  theory: string;
  umlDiagramSvg?: string;
  goodUseCases: string[];
  badUseCases: string[];
  realWorldExamples: string[];
  interviewQuestions: { question: string; answer: string }[];
  snippets: {
    java?: { code: string; output: string };
    python?: { code: string; output: string };
    javascript?: { code: string; output: string };
    cpp?: { code: string; output: string };
  };
}

export const PATTERNS_DATA: Record<string, PatternData> = {
  singleton: {
    slug: 'singleton',
    category: 'creational',
    title: 'Singleton Pattern',
    tag: 'Creational Pattern',
    description: 'Ensure a class has only one instance and provide a global point of access to it.',
    plainEnglish:
      'Imagine a country with only one President. No matter how many people want to speak to the government, there is only one official office of the President. The Singleton pattern ensures that only one instance of a class exists throughout the application lifecycle.',
    theory:
      'The Singleton pattern restricts class instantiation to a single object. It is used when exact control over a shared resource (like a database connection pool, logger, or configuration settings) is needed.',
    umlDiagramSvg: '/assets/singleton/class-diagram.svg',
    goodUseCases: [
      'Managing a shared resource like a Database Connection Pool.',
      'Logger objects where creating multiple instances causes file lock contention.',
      'Application Configuration Settings loaded once at startup.',
    ],
    badUseCases: [
      'When state needs to be maintained per-user or per-request.',
      'Hiding dependencies in global state, making unit testing difficult without dependency injection.',
    ],
    realWorldExamples: [
      'java.lang.Runtime#getRuntime() in Java Standard Library.',
      'Database connection pool managers (e.g. HikariCP).',
      'Redux / Pinia global application state stores.',
    ],
    interviewQuestions: [
      {
        question: 'How do you make a Singleton thread-safe in Java?',
        answer:
          'Using double-checked locking with volatile keyword, or relying on initialization-on-demand holder idiom (Bill Pugh Singleton) which leverages JVM class-loading thread safety.',
      },
      {
        question: 'Why is Singleton sometimes considered an anti-pattern?',
        answer:
          'It introduces tight coupling, global mutable state, violates the Single Responsibility Principle, and makes mock testing during unit tests difficult unless interface abstractions are used.',
      },
    ],
    snippets: {
      java: {
        code: `public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;
    private DatabaseConnectionPool() {
        System.out.println("Initializing Database Connection Pool...");
    }

    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }

    public void query(String sql) {
        System.out.println("Executing SQL: " + sql);
    }

    public static void main(String[] args) {
        DatabaseConnectionPool db1 = DatabaseConnectionPool.getInstance();
        DatabaseConnectionPool db2 = DatabaseConnectionPool.getInstance();
        System.out.println("Are db1 and db2 the same instance? " + (db1 == db2));
        db1.query("SELECT * FROM users;");
    }
}`,
        output: `Initializing Database Connection Pool...
Are db1 and db2 the same instance? true
Executing SQL: SELECT * FROM users;`,
      },
      python: {
        code: `class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class DatabaseConnectionPool(metaclass=SingletonMeta):
    def __init__(self):
        print("Initializing Database Connection Pool...")

    def query(self, sql):
        print(f"Executing SQL: {sql}")

db1 = DatabaseConnectionPool()
db2 = DatabaseConnectionPool()
print(f"Are db1 and db2 the same instance? {db1 is db2}")
db1.query("SELECT * FROM users;")`,
        output: `Initializing Database Connection Pool...
Are db1 and db2 the same instance? True
Executing SQL: SELECT * FROM users;`,
      },
    },
  },
  adapter: {
    slug: 'adapter',
    category: 'structural',
    title: 'Adapter Pattern',
    tag: 'Structural Pattern',
    description: 'Convert the interface of a class into another interface clients expect.',
    plainEnglish:
      'Like a travel plug adapter that lets your 3-pin UK laptop charger plug into a 2-pin European socket. The Adapter pattern allows incompatible interfaces to work together.',
    theory:
      'Adapter works as a wrapper between two objects. It catches calls for one object and transforms them to format and interface expected by the second object.',
    umlDiagramSvg: '/assets/adapter/class-diagram.svg',
    goodUseCases: [
      'Integrating a legacy library with a modern codebase without altering legacy source code.',
      'Wrapping third-party payment gateways (PayPal, Stripe) behind a unified payment interface.',
    ],
    badUseCases: [
      'When both classes are under your control and it is cleaner to refactor them directly.',
    ],
    realWorldExamples: [
      'java.util.Arrays#asList() adapting an array into a List interface.',
      'Database driver adapters (JDBC / ORM database connectors).',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Class Adapter and Object Adapter?',
        answer:
          'Class Adapter uses multiple inheritance (inherits from target and adaptee), while Object Adapter uses composition (holds an instance of adaptee inside). Object Adapter is generally preferred.',
      },
    ],
    snippets: {
      java: {
        code: `interface TargetPaymentGateway {
    void processPayment(double amount);
}

class LegacyPayPalService {
    public void makePayment(double dollars) {
        System.out.println("Paid $" + dollars + " via PayPal.");
    }
}

class PayPalAdapter implements TargetPaymentGateway {
    private LegacyPayPalService payPalService;
    public PayPalAdapter(LegacyPayPalService payPalService) {
        this.payPalService = payPalService;
    }
    @Override
    public void processPayment(double amount) {
        payPalService.makePayment(amount);
    }
}

public class Main {
    public static void main(String[] args) {
        TargetPaymentGateway payment = new PayPalAdapter(new LegacyPayPalService());
        payment.processPayment(99.99);
    }
}`,
        output: `Paid $99.99 via PayPal.`,
      },
    },
  },
  observer: {
    slug: 'observer',
    category: 'behavioral',
    title: 'Observer Pattern',
    tag: 'Behavioral Pattern',
    description: 'Define a one-to-many dependency so when one object changes state, all dependents are notified.',
    plainEnglish:
      'Like subscribing to a YouTube channel or newsletter. When a creator uploads a video, all subscribers get a notification automatically.',
    theory:
      'Observer defines a subscription mechanism to notify multiple objects about any events that happen to the object they are observing.',
    umlDiagramSvg: '/assets/observer/class-diagram.svg',
    goodUseCases: [
      'Event-driven UIs (DOM event listeners, ReactiveX, RxJS).',
      'Publish/subscribe messaging between decoupled components.',
    ],
    badUseCases: [
      'When subscriber notifications happen synchronously in large chains, causing hard-to-trace cascading updates.',
    ],
    realWorldExamples: [
      'DOM addEventListener in browsers.',
      'Node.js EventEmitter.',
      'Spring Framework ApplicationEventPublisher.',
    ],
    interviewQuestions: [
      {
        question: 'How do you prevent memory leaks when using the Observer pattern?',
        answer:
          'Ensure observers unsubscribe when they are destroyed, or use weak references (WeakReference in Java / WeakMap in JS) so unreferenced observers can be garbage collected.',
      },
    ],
    snippets: {
      java: {
        code: `import java.util.*;

interface Observer {
    void update(String news);
}

class NewsAgency {
    private List<Observer> observers = new ArrayList<>();
    public void addObserver(Observer o) { observers.add(o); }
    public void notifyAll(String news) {
        for (Observer o : observers) o.update(news);
    }
}

public class Main {
    public static void main(String[] args) {
        NewsAgency agency = new NewsAgency();
        agency.addObserver(news -> System.out.println("Subscriber 1 received: " + news));
        agency.addObserver(news -> System.out.println("Subscriber 2 received: " + news));
        agency.notifyAll("Breaking News: Next.js App Deployed!");
    }
}`,
        output: `Subscriber 1 received: Breaking News: Next.js App Deployed!
Subscriber 2 received: Breaking News: Next.js App Deployed!`,
      },
    },
  },
  strategy: {
    slug: 'strategy',
    category: 'behavioral',
    title: 'Strategy Pattern',
    tag: 'Behavioral Pattern',
    description: 'Define a family of algorithms, encapsulate each one, and make them interchangeable.',
    plainEnglish:
      'Like choosing how to travel to an airport: by car, bus, or train. You have the same goal (reach airport), but you pick different strategies based on time and budget.',
    theory:
      'Strategy lets you alter the behavior of an object at runtime by passing different strategy instances.',
    umlDiagramSvg: '/assets/strategy/class-diagram.svg',
    goodUseCases: [
      'Multiple sorting algorithms chosen dynamically based on data size.',
      'Route calculation algorithms (Fastest vs Toll-free vs Walking) in mapping apps.',
    ],
    badUseCases: [
      'When you only have 1 or 2 algorithms that rarely change, simple conditionals suffice.',
    ],
    realWorldExamples: [
      'java.util.Collections#sort(List, Comparator) passing custom Strategy Comparators.',
    ],
    interviewQuestions: [
      {
        question: 'How does Strategy pattern enforce SOLID principles?',
        answer:
          'It enforces Open/Closed Principle (add new strategies without modifying existing context code) and Single Responsibility Principle (isolates algorithm logic).',
      },
    ],
    snippets: {
      java: {
        code: `interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardStrategy implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid $" + amount + " using Credit Card."); }
}

class CryptoStrategy implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid $" + amount + " using Bitcoin."); }
}

class ShoppingCart {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy strategy) { this.strategy = strategy; }
    public void checkout(int amount) { strategy.pay(amount); }
}

public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.setStrategy(new CryptoStrategy());
        cart.checkout(250);
    }
}`,
        output: `Paid $250 using Bitcoin.`,
      },
    },
  },
  'factory-method': {
    slug: 'factory-method',
    category: 'creational',
    title: 'Factory Method Pattern',
    tag: 'Creational Pattern',
    description: 'Define an interface for creating an object, but let subclasses decide which class to instantiate.',
    plainEnglish:
      'Imagine ordering a logistics delivery: you ask for a Transport, and depending on whether it is land or sea, the Logistics factory creates a Truck or a Ship.',
    theory:
      'Factory Method decouples object creation from the client code that uses the object.',
    umlDiagramSvg: '/assets/factory-method/class-diagram.svg',
    goodUseCases: ['When you don’t know beforehand the exact types of objects your code will work with.'],
    badUseCases: ['When object instantiation is trivial and unlikely to change.'],
    realWorldExamples: ['java.util.Calendar#getInstance()'],
    interviewQuestions: [
      {
        question: 'What is the difference between Simple Factory and Factory Method?',
        answer:
          'Simple Factory uses a single class with a switch/if-else to instantiate objects. Factory Method relies on inheritance/subclassing to override the creation method.',
      },
    ],
    snippets: {
      java: {
        code: `abstract class Button { public abstract void render(); }
class WindowsButton extends Button { public void render() { System.out.println("Render Windows Button"); } }
class HtmlButton extends Button { public void render() { System.out.println("Render HTML Button"); } }

abstract class Dialog {
    public abstract Button createButton();
    public void renderWindow() { Button b = createButton(); b.render(); }
}
class WindowsDialog extends Dialog { public Button createButton() { return new WindowsButton(); } }

public class Main {
    public static void main(String[] args) {
        Dialog dialog = new WindowsDialog();
        dialog.renderWindow();
    }
}`,
        output: `Render Windows Button`,
      },
    },
  },
  'abstract-factory': {
    slug: 'abstract-factory',
    category: 'creational',
    title: 'Abstract Factory Pattern',
    tag: 'Creational Pattern',
    description: 'Provide an interface for creating families of related or dependent objects.',
    plainEnglish:
      'Like an IKEA furniture set: if you pick Victorian style, the factory gives you a Victorian Chair, Victorian Sofa, and Victorian Coffee Table that match.',
    theory:
      'Abstract Factory isolates concrete classes from the client code through interfaces.',
    umlDiagramSvg: '/assets/abstract-factory/class-diagram.svg',
    goodUseCases: ['When your system needs to be independent of how its products are created, composed, and represented.'],
    badUseCases: ['When new product types are added frequently, requiring modification of the factory interface.'],
    realWorldExamples: ['javax.xml.parsers.DocumentBuilderFactory'],
    interviewQuestions: [
      {
        question: 'Abstract Factory vs Factory Method?',
        answer:
          'Factory Method creates ONE product using inheritance. Abstract Factory creates a FAMILY of related products using composition.',
      },
    ],
    snippets: {
      java: {
        code: `interface Chair { void sitOn(); }
class ModernChair implements Chair { public void sitOn() { System.out.println("Sitting on modern chair"); } }
interface FurnitureFactory { Chair createChair(); }
class ModernFurnitureFactory implements FurnitureFactory { public Chair createChair() { return new ModernChair(); } }

public class Main {
    public static void main(String[] args) {
        FurnitureFactory factory = new ModernFurnitureFactory();
        Chair chair = factory.createChair();
        chair.sitOn();
    }
}`,
        output: `Sitting on modern chair`,
      },
    },
  },
  builder: {
    slug: 'builder',
    category: 'creational',
    title: 'Builder Pattern',
    tag: 'Creational Pattern',
    description: 'Separate the construction of a complex object from its representation.',
    plainEnglish:
      'Like customizing a pizza: step by step add dough, cheese, pepperoni, and olives, then call build().',
    theory:
      'Builder pattern allows step-by-step construction of complex objects using fluent methods.',
    umlDiagramSvg: '/assets/builder/class-diagram.svg',
    goodUseCases: ['Constructing objects with numerous optional parameters (avoiding telescoping constructors).'],
    badUseCases: ['Simple objects with few required fields.'],
    realWorldExamples: ['java.lang.StringBuilder', 'Lombok @Builder'],
    interviewQuestions: [
      {
        question: 'Why avoid telescoping constructors?',
        answer:
          'Telescoping constructors lead to unreadable code like new User("Alice", null, true, 25, null, "admin"). Builder makes parameter setting explicit.',
      },
    ],
    snippets: {
      java: {
        code: `class User {
    private String name, email;
    public static class Builder {
        private String name, email;
        public Builder setName(String name) { this.name = name; return this; }
        public Builder setEmail(String email) { this.email = email; return this; }
        public User build() { User u = new User(); u.name = this.name; u.email = this.email; return u; }
    }
    public String toString() { return "User{" + name + ", " + email + "}"; }
}

public class Main {
    public static void main(String[] args) {
        User u = new User.Builder().setName("Alice").setEmail("alice@example.com").build();
        System.out.println(u);
    }
}`,
        output: `User{Alice, alice@example.com}`,
      },
    },
  },
  prototype: {
    slug: 'prototype',
    category: 'creational',
    title: 'Prototype Pattern',
    tag: 'Creational Pattern',
    description: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
    plainEnglish:
      'Like cloning a document in Google Docs: instead of creating a document from scratch, you duplicate an existing template.',
    theory:
      'Prototype allows cloning existing objects without coupling your code to their specific classes.',
    umlDiagramSvg: '/assets/prototype/class-diagram.svg',
    goodUseCases: ['When object creation is computationally expensive (e.g. DB fetch or heavy disk I/O).'],
    badUseCases: ['Objects with complex circular references.'],
    realWorldExamples: ['java.lang.Object#clone()'],
    interviewQuestions: [
      {
        question: 'Deep copy vs Shallow copy?',
        answer:
          'Shallow copy duplicates field values (references point to same objects). Deep copy duplicates target objects recursively.',
      },
    ],
    snippets: {
      java: {
        code: `class Circle implements Cloneable {
    int radius;
    public Circle(int r) { this.radius = r; }
    @Override
    public Circle clone() {
        try { return (Circle) super.clone(); } catch (Exception e) { return null; }
    }
}

public class Main {
    public static void main(String[] args) {
        Circle c1 = new Circle(10);
        Circle c2 = c1.clone();
        System.out.println("Cloned circle radius: " + c2.radius);
    }
}`,
        output: `Cloned circle radius: 10`,
      },
    },
  },
  decorator: {
    slug: 'decorator',
    category: 'structural',
    title: 'Decorator Pattern',
    tag: 'Structural Pattern',
    description: 'Attach additional responsibilities to an object dynamically.',
    plainEnglish:
      'Like ordering a coffee: start with Basic Coffee, then decorate it with Milk, Whip Cream, and Caramel.',
    theory:
      'Decorator places target objects inside special wrapper objects that contain the extra behaviors.',
    umlDiagramSvg: '/assets/decorator/class-diagram.svg',
    goodUseCases: ['Adding responsibilities to objects dynamically without breaking existing code.'],
    badUseCases: ['When the wrapper stack becomes too deep and hard to debug.'],
    realWorldExamples: ['java.io.BufferedReader(new FileReader("file.txt"))'],
    interviewQuestions: [
      {
        question: 'Decorator vs Inheritance?',
        answer:
          'Inheritance extends behavior at compile-time. Decorator wraps behavior dynamically at runtime.',
      },
    ],
    snippets: {
      java: {
        code: `interface Coffee { double cost(); }
class SimpleCoffee implements Coffee { public double cost() { return 2.0; } }
class MilkDecorator implements Coffee {
    private Coffee c;
    public MilkDecorator(Coffee c) { this.c = c; }
    public double cost() { return c.cost() + 0.5; }
}

public class Main {
    public static void main(String[] args) {
        Coffee myCoffee = new MilkDecorator(new SimpleCoffee());
        System.out.println("Cost: $" + myCoffee.cost());
    }
}`,
        output: `Cost: $2.5`,
      },
    },
  },
  facade: {
    slug: 'facade',
    category: 'structural',
    title: 'Facade Pattern',
    tag: 'Structural Pattern',
    description: 'Provide a unified interface to a set of interfaces in a subsystem.',
    plainEnglish:
      'Like a smart home remote button "Movie Mode" that dims lights, turns on TV, and closes blinds in 1 click.',
    theory:
      'Facade provides a simple interface to a complex subsystem of classes.',
    umlDiagramSvg: '/assets/facade/class-diagram.svg',
    goodUseCases: ['Structuring a complex subsystem into discrete layers with clean simple entry points.'],
    badUseCases: ['When facade turns into a God object that knows about every class.'],
    realWorldExamples: ['SLF4J Logger Facade'],
    interviewQuestions: [
      {
        question: 'Facade vs Adapter?',
        answer:
          'Adapter makes two existing incompatible interfaces work together. Facade creates a NEW simplified interface over a complex system.',
      },
    ],
    snippets: {
      java: {
        code: `class CPU { void start() { System.out.println("CPU Started"); } }
class Memory { void load() { System.out.println("Memory Loaded"); } }

class ComputerFacade {
    private CPU cpu = new CPU();
    private Memory memory = new Memory();
    public void start() { cpu.start(); memory.load(); }
}

public class Main {
    public static void main(String[] args) {
        ComputerFacade computer = new ComputerFacade();
        computer.start();
    }
}`,
        output: `CPU Started
Memory Loaded`,
      },
    },
  },
};
