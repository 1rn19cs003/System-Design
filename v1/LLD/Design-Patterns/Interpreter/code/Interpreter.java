// Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
// Compile: javac Interpreter.java
// Run:     java Interpreter

interface Expression {
    int interpret();
}

// Terminal expression — a literal number.
class NumberExpression implements Expression {
    private int number;

    NumberExpression(int number) {
        this.number = number;
    }

    public int interpret() {
        return number;
    }
}

// Nonterminal expression — addition of two sub-expressions.
class AddExpression implements Expression {
    private Expression left;
    private Expression right;

    AddExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret() {
        return left.interpret() + right.interpret();
    }
}

// Nonterminal expression — subtraction of two sub-expressions.
class SubtractExpression implements Expression {
    private Expression left;
    private Expression right;

    SubtractExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret() {
        return left.interpret() - right.interpret();
    }
}

public class Interpreter {
    public static void main(String[] args) {
        // Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
        Expression five = new NumberExpression(5);
        Expression three = new NumberExpression(3);
        Expression two = new NumberExpression(2);

        Expression addition = new AddExpression(five, three);
        Expression expression = new SubtractExpression(addition, two);

        System.out.println("Evaluating: (5 + 3) - 2");
        System.out.println("Result: " + expression.interpret());

        // A second, differently-shaped expression: 10 - (4 + 1).
        Expression tree2 = new SubtractExpression(
            new NumberExpression(10),
            new AddExpression(new NumberExpression(4), new NumberExpression(1))
        );

        System.out.println("Evaluating: 10 - (4 + 1)");
        System.out.println("Result: " + tree2.interpret());
    }
}
