/**
 * Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
 * Run: node memento.js
 */

class EditorMemento {
  constructor(content) {
    this._content = content; // treated as opaque by History; only TextEditor reads it
  }
}

class TextEditor {
  constructor() {
    this.content = "";
  }

  type(text) {
    this.content += text;
  }

  save() {
    return new EditorMemento(this.content);
  }

  restore(memento) {
    this.content = memento._content;
  }
}

class History {
  constructor() {
    this.stack = [];
  }

  push(memento) {
    this.stack.push(memento);
  }

  pop() {
    return this.stack.pop();
  }
}

const editor = new TextEditor();
const history = new History();

editor.type("Hello");
history.push(editor.save());
console.log(`Content: ${editor.content}`);

editor.type(", world");
history.push(editor.save());
console.log(`Content: ${editor.content}`);

editor.type("!!! (typo)");
console.log(`Content: ${editor.content}`);

console.log("Undo:");
editor.restore(history.pop());
console.log(`Content: ${editor.content}`);

console.log("Undo again:");
editor.restore(history.pop());
console.log(`Content: ${editor.content}`);

module.exports = { TextEditor, History, EditorMemento };
