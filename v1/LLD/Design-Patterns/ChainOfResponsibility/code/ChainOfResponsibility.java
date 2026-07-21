// Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
// Compile: javac ChainOfResponsibility.java
// Run:     java ChainOfResponsibility

abstract class ApprovalHandler {
    protected ApprovalHandler next;

    ApprovalHandler setNext(ApprovalHandler next) {
        this.next = next;
        return next;
    }

    abstract void handle(double amount);
}

class TeamLead extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 1000) {
            System.out.println("TeamLead approved expense of $" + amount);
        } else if (next != null) {
            System.out.println("TeamLead cannot approve $" + amount + " — escalating.");
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount);
        }
    }
}

class Manager extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 5000) {
            System.out.println("Manager approved expense of $" + amount);
        } else if (next != null) {
            System.out.println("Manager cannot approve $" + amount + " — escalating.");
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount);
        }
    }
}

class Director extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 20000) {
            System.out.println("Director approved expense of $" + amount);
        } else if (next != null) {
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount + " — needs CEO sign-off.");
        }
    }
}

public class ChainOfResponsibility {
    public static void main(String[] args) {
        ApprovalHandler teamLead = new TeamLead();
        ApprovalHandler manager = new Manager();
        ApprovalHandler director = new Director();

        teamLead.setNext(manager).setNext(director);

        System.out.println("Requesting approval for $500:");
        teamLead.handle(500);

        System.out.println("Requesting approval for $3000:");
        teamLead.handle(3000);

        System.out.println("Requesting approval for $18000:");
        teamLead.handle(18000);

        System.out.println("Requesting approval for $50000:");
        teamLead.handle(50000);
    }
}
