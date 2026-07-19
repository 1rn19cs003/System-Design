// Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
// Compile: javac Memento.java
// Run:     java Memento

import java.util.ArrayDeque;
import java.util.Deque;

// The Memento — immutable snapshot, readable only by TextEditor.
class EditorMemento {
    private final String content;

    EditorMemento(String content) {
        this.content = content;
    }

    private String getContent() {
        return content;
    }

    // Package-private access point used only by TextEditor.
    String read() {
        return getContent();
    }
}

class TextEditor {
    private String content = "";

    void type(String text) {
        content += text;
    }

    String getContent() {
        return content;
    }

    EditorMemento save() {
        return new EditorMemento(content);
    }

    void restore(EditorMemento memento) {
        content = memento.read();
    }
}

class History {
    private Deque<EditorMemento> history = new ArrayDeque<>();

    void push(EditorMemento memento) {
        history.push(memento);
    }

    EditorMemento pop() {
        return history.pop();
    }
}

public class Memento {
    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        History history = new History();

        editor.type("Hello");
        history.push(editor.save());
        System.out.println("Content: " + editor.getContent());

        editor.type(", world");
        history.push(editor.save());
        System.out.println("Content: " + editor.getContent());

        editor.type("!!! (typo)");
        System.out.println("Content: " + editor.getContent());

        System.out.println("Undo:");
        editor.restore(history.pop());
        System.out.println("Content: " + editor.getContent());

        System.out.println("Undo again:");
        editor.restore(history.pop());
        System.out.println("Content: " + editor.getContent());
    }
}
