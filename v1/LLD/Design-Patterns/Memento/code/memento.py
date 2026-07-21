"""
Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
Run: python memento.py
"""


class EditorMemento:
    """The Memento — treated as opaque by History; only TextEditor reads _content."""

    def __init__(self, content):
        self._content = content


class TextEditor:
    def __init__(self):
        self.content = ""

    def type(self, text):
        self.content += text

    def save(self):
        return EditorMemento(self.content)

    def restore(self, memento: EditorMemento):
        self.content = memento._content


class History:
    def __init__(self):
        self._stack = []

    def push(self, memento):
        self._stack.append(memento)

    def pop(self):
        return self._stack.pop()


if __name__ == "__main__":
    editor = TextEditor()
    history = History()

    editor.type("Hello")
    history.push(editor.save())
    print(f"Content: {editor.content}")

    editor.type(", world")
    history.push(editor.save())
    print(f"Content: {editor.content}")

    editor.type("!!! (typo)")
    print(f"Content: {editor.content}")

    print("Undo:")
    editor.restore(history.pop())
    print(f"Content: {editor.content}")

    print("Undo again:")
    editor.restore(history.pop())
    print(f"Content: {editor.content}")
