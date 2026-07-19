// State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
// Compile: javac State.java
// Run:     java State

interface DocumentState {
    void publish(Document document);
    String name();
}

class DraftState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Draft submitted for moderation.");
        document.setState(new ModerationState());
    }

    public String name() {
        return "Draft";
    }
}

class ModerationState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Moderator approved — publishing document.");
        document.setState(new PublishedState());
    }

    public String name() {
        return "Moderation";
    }
}

class PublishedState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Already published — publish() has no further effect.");
    }

    public String name() {
        return "Published";
    }
}

class Document {
    private DocumentState state = new DraftState();

    void setState(DocumentState state) {
        this.state = state;
    }

    void publish() {
        state.publish(this);
    }

    String currentState() {
        return state.name();
    }
}

public class State {
    public static void main(String[] args) {
        Document doc = new Document();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
    }
}
