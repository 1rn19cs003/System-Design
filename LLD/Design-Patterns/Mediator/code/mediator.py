"""
Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
Run: python mediator.py
"""


class ChatRoom:
    def __init__(self):
        self.users = []

    def add_user(self, user):
        self.users.append(user)

    def send_message(self, message, sender):
        for user in self.users:
            if user is not sender:
                user.receive(message, sender.name)


class User:
    def __init__(self, name, mediator: ChatRoom):
        self.name = name
        self.mediator = mediator

    def send(self, message):
        print(f"{self.name} sends: {message}")
        self.mediator.send_message(message, self)

    def receive(self, message, from_name):
        print(f"{self.name} received from {from_name}: {message}")


if __name__ == "__main__":
    chat_room = ChatRoom()

    alice = User("Alice", chat_room)
    bob = User("Bob", chat_room)
    carol = User("Carol", chat_room)

    chat_room.add_user(alice)
    chat_room.add_user(bob)
    chat_room.add_user(carol)

    alice.send("Hey everyone!")
    bob.send("Hi Alice!")
