/**
 * Factory Method Pattern — notification system example.
 * Run: node factory_method.js
 */

class Notification {
  notifyUser() {
    throw new Error("notifyUser() must be implemented");
  }
}

class EmailNotification extends Notification {
  notifyUser() {
    console.log("Sending an EMAIL notification.");
  }
}

class SMSNotification extends Notification {
  notifyUser() {
    console.log("Sending an SMS notification.");
  }
}

class NotificationFactory {
  createNotification() {
    throw new Error("createNotification() must be implemented");
  }

  send() {
    const notification = this.createNotification();
    notification.notifyUser();
  }
}

class EmailNotificationFactory extends NotificationFactory {
  createNotification() {
    return new EmailNotification();
  }
}

class SMSNotificationFactory extends NotificationFactory {
  createNotification() {
    return new SMSNotification();
  }
}

const emailFactory = new EmailNotificationFactory();
const smsFactory = new SMSNotificationFactory();

emailFactory.send();
smsFactory.send();

module.exports = { NotificationFactory, EmailNotificationFactory, SMSNotificationFactory };
