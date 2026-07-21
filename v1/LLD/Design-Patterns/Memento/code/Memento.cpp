// Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
// Compile: g++ -std=c++14 Memento.cpp -o memento
// Run:     ./memento

#include <iostream>
#include <string>
#include <vector>

class TextEditor;

// The Memento — only TextEditor is a friend, so History can't read its contents.
class EditorMemento {
public:
    friend class TextEditor;

    explicit EditorMemento(std::string content) : content_(std::move(content)) {}

private:
    std::string content_;
};

class TextEditor {
public:
    void type(const std::string& text) {
        content_ += text;
    }

    const std::string& getContent() const {
        return content_;
    }

    EditorMemento save() const {
        return EditorMemento(content_);
    }

    void restore(const EditorMemento& memento) {
        content_ = memento.content_;
    }

private:
    std::string content_;
};

class History {
public:
    void push(const EditorMemento& memento) {
        stack_.push_back(memento);
    }

    EditorMemento pop() {
        EditorMemento last = stack_.back();
        stack_.pop_back();
        return last;
    }

private:
    std::vector<EditorMemento> stack_;
};

int main() {
    TextEditor editor;
    History history;

    editor.type("Hello");
    history.push(editor.save());
    std::cout << "Content: " << editor.getContent() << std::endl;

    editor.type(", world");
    history.push(editor.save());
    std::cout << "Content: " << editor.getContent() << std::endl;

    editor.type("!!! (typo)");
    std::cout << "Content: " << editor.getContent() << std::endl;

    std::cout << "Undo:" << std::endl;
    editor.restore(history.pop());
    std::cout << "Content: " << editor.getContent() << std::endl;

    std::cout << "Undo again:" << std::endl;
    editor.restore(history.pop());
    std::cout << "Content: " << editor.getContent() << std::endl;

    return 0;
}
