"""
State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
Run: python state.py
"""

from abc import ABC, abstractmethod


class DocumentState(ABC):
    @abstractmethod
    def publish(self, document):
        ...

    @abstractmethod
    def name(self):
        ...


class DraftState(DocumentState):
    def publish(self, document):
        print("Draft submitted for moderation.")
        document.set_state(ModerationState())

    def name(self):
        return "Draft"


class ModerationState(DocumentState):
    def publish(self, document):
        print("Moderator approved — publishing document.")
        document.set_state(PublishedState())

    def name(self):
        return "Moderation"


class PublishedState(DocumentState):
    def publish(self, document):
        print("Already published — publish() has no further effect.")

    def name(self):
        return "Published"


class Document:
    def __init__(self):
        self.state = DraftState()

    def set_state(self, state: DocumentState):
        self.state = state

    def publish(self):
        self.state.publish(self)

    def current_state(self):
        return self.state.name()


if __name__ == "__main__":
    doc = Document()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")
