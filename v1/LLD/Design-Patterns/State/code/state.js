/**
 * State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
 * Run: node state.js
 */

class DraftState {
  publish(document) {
    console.log("Draft submitted for moderation.");
    document.setState(new ModerationState());
  }

  name() {
    return "Draft";
  }
}

class ModerationState {
  publish(document) {
    console.log("Moderator approved — publishing document.");
    document.setState(new PublishedState());
  }

  name() {
    return "Moderation";
  }
}

class PublishedState {
  publish(document) {
    console.log("Already published — publish() has no further effect.");
  }

  name() {
    return "Published";
  }
}

class Document {
  constructor() {
    this.state = new DraftState();
  }

  setState(state) {
    this.state = state;
  }

  publish() {
    this.state.publish(this);
  }

  currentState() {
    return this.state.name();
  }
}

const doc = new Document();

console.log(`Current state: ${doc.currentState()}`);
doc.publish();

console.log(`Current state: ${doc.currentState()}`);
doc.publish();

console.log(`Current state: ${doc.currentState()}`);
doc.publish();

console.log(`Current state: ${doc.currentState()}`);

module.exports = { Document, DraftState, ModerationState, PublishedState };
