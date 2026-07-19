// Factory Method Pattern — notification system example.
// Compile: javac FactoryMethod.java
// Run:     java FactoryMethod

interface Notification {
    void notifyUser();
}

class EmailNotification implements Notification {
    public void notifyUser() {
        System.out.println("Sending an EMAIL notification.");
    }
}

class SMSNotification implements Notification {
    public void notifyUser() {
        System.out.println("Sending an SMS notification.");
    }
}

abstract class NotificationFactory {
    // The factory method — subclasses decide what gets created.
    abstract Notification createNotification();

    // Shared logic, written once, against the Notification interface.
    void send() {
        Notification notification = createNotification();
        notification.notifyUser();
    }
}

class EmailNotificationFactory extends NotificationFactory {
    Notification createNotification() {
        return new EmailNotification();
    }
}

class SMSNotificationFactory extends NotificationFactory {
    Notification createNotification() {
        return new SMSNotification();
    }
}

public class FactoryMethod {
    public static void main(String[] args) {
        NotificationFactory emailFactory = new EmailNotificationFactory();
        NotificationFactory smsFactory = new SMSNotificationFactory();

        emailFactory.send();
        smsFactory.send();
    }
}
