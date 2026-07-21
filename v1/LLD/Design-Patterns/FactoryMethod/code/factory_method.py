"""
Factory Method Pattern — notification system example.
Run: python factory_method.py
"""

from abc import ABC, abstractmethod


class Notification(ABC):
    @abstractmethod
    def notify_user(self):
        ...


class EmailNotification(Notification):
    def notify_user(self):
        print("Sending an EMAIL notification.")


class SMSNotification(Notification):
    def notify_user(self):
        print("Sending an SMS notification.")


class NotificationFactory(ABC):
    @abstractmethod
    def create_notification(self) -> Notification:
        ...

    def send(self):
        notification = self.create_notification()
        notification.notify_user()


class EmailNotificationFactory(NotificationFactory):
    def create_notification(self) -> Notification:
        return EmailNotification()


class SMSNotificationFactory(NotificationFactory):
    def create_notification(self) -> Notification:
        return SMSNotification()


if __name__ == "__main__":
    email_factory = EmailNotificationFactory()
    sms_factory = SMSNotificationFactory()

    email_factory.send()
    sms_factory.send()
