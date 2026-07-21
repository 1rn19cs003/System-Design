/**
 * Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
 * Run: node mediator.js
 */

class ChatRoom {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  sendMessage(message, sender) {
    this.users.forEach(user => {
      if (user !== sender) {
        user.receive(message, sender.name);
      }
    });
  }
}

class User {
  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  send(message) {
    console.log(`${this.name} sends: ${message}`);
    this.mediator.sendMessage(message, this);
  }

  receive(message, fromName) {
    console.log(`${this.name} received from ${fromName}: ${message}`);
  }
}

const chatRoom = new ChatRoom();

const alice = new User("Alice", chatRoom);
const bob = new User("Bob", chatRoom);
const carol = new User("Carol", chatRoom);

chatRoom.addUser(alice);
chatRoom.addUser(bob);
chatRoom.addUser(carol);

alice.send("Hey everyone!");
bob.send("Hi Alice!");

module.exports = { ChatRoom, User };
