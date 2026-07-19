// Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
// Compile: javac Visitor.java
// Run:     java Visitor

interface ShoppingCartVisitor {
    double visit(Book book);
    double visit(Electronic electronic);
}

interface ItemElement {
    double accept(ShoppingCartVisitor visitor);
}

class Book implements ItemElement {
    private double price;
    private String title;

    Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    double getPrice() {
        return price;
    }

    String getTitle() {
        return title;
    }

    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

class Electronic implements ItemElement {
    private double price;
    private String name;

    Electronic(String name, double price) {
        this.name = name;
        this.price = price;
    }

    double getPrice() {
        return price;
    }

    String getName() {
        return name;
    }

    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

class PricingVisitor implements ShoppingCartVisitor {
    public double visit(Book book) {
        // Books are tax-exempt.
        System.out.println("Pricing book '" + book.getTitle() + "': $" + book.getPrice() + " (no tax)");
        return book.getPrice();
    }

    public double visit(Electronic electronic) {
        // Electronics carry an 8% tax.
        double taxed = electronic.getPrice() * 1.08;
        System.out.println("Pricing electronic '" + electronic.getName() + "': $" + electronic.getPrice() + " + 8% tax = $" + taxed);
        return taxed;
    }
}

public class Visitor {
    public static void main(String[] args) {
        ItemElement[] cart = new ItemElement[]{
            new Book("Design Patterns", 45.0),
            new Electronic("Headphones", 100.0)
        };

        ShoppingCartVisitor pricingVisitor = new PricingVisitor();

        double total = 0;
        for (ItemElement item : cart) {
            total += item.accept(pricingVisitor);
        }

        System.out.println("Total: $" + total);
    }
}
