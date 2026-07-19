/**
 * Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
 * Run: node chain_of_responsibility.js
 */

class ApprovalHandler {
  setNext(handler) {
    this.next = handler;
    return handler;
  }
}

class TeamLead extends ApprovalHandler {
  handle(amount) {
    if (amount <= 1000) {
      console.log(`TeamLead approved expense of $${amount}`);
    } else if (this.next) {
      console.log(`TeamLead cannot approve $${amount} — escalating.`);
      this.next.handle(amount);
    } else {
      console.log(`No handler could approve $${amount}`);
    }
  }
}

class Manager extends ApprovalHandler {
  handle(amount) {
    if (amount <= 5000) {
      console.log(`Manager approved expense of $${amount}`);
    } else if (this.next) {
      console.log(`Manager cannot approve $${amount} — escalating.`);
      this.next.handle(amount);
    } else {
      console.log(`No handler could approve $${amount}`);
    }
  }
}

class Director extends ApprovalHandler {
  handle(amount) {
    if (amount <= 20000) {
      console.log(`Director approved expense of $${amount}`);
    } else if (this.next) {
      this.next.handle(amount);
    } else {
      console.log(`No handler could approve $${amount} — needs CEO sign-off.`);
    }
  }
}

const teamLead = new TeamLead();
const manager = new Manager();
const director = new Director();

teamLead.setNext(manager).setNext(director);

console.log("Requesting approval for $500:");
teamLead.handle(500);

console.log("Requesting approval for $3000:");
teamLead.handle(3000);

console.log("Requesting approval for $18000:");
teamLead.handle(18000);

console.log("Requesting approval for $50000:");
teamLead.handle(50000);

module.exports = { TeamLead, Manager, Director };
