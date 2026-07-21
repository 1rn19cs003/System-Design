"""
Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
Run: python chain_of_responsibility.py
"""

from abc import ABC, abstractmethod


class ApprovalHandler(ABC):
    def __init__(self):
        self.next = None

    def set_next(self, handler):
        self.next = handler
        return handler

    @abstractmethod
    def handle(self, amount):
        ...


class TeamLead(ApprovalHandler):
    def handle(self, amount):
        if amount <= 1000:
            print(f"TeamLead approved expense of ${amount}")
        elif self.next:
            print(f"TeamLead cannot approve ${amount} — escalating.")
            self.next.handle(amount)
        else:
            print(f"No handler could approve ${amount}")


class Manager(ApprovalHandler):
    def handle(self, amount):
        if amount <= 5000:
            print(f"Manager approved expense of ${amount}")
        elif self.next:
            print(f"Manager cannot approve ${amount} — escalating.")
            self.next.handle(amount)
        else:
            print(f"No handler could approve ${amount}")


class Director(ApprovalHandler):
    def handle(self, amount):
        if amount <= 20000:
            print(f"Director approved expense of ${amount}")
        elif self.next:
            self.next.handle(amount)
        else:
            print(f"No handler could approve ${amount} — needs CEO sign-off.")


if __name__ == "__main__":
    team_lead = TeamLead()
    manager = Manager()
    director = Director()

    team_lead.set_next(manager).set_next(director)

    print("Requesting approval for $500:")
    team_lead.handle(500)

    print("Requesting approval for $3000:")
    team_lead.handle(3000)

    print("Requesting approval for $18000:")
    team_lead.handle(18000)

    print("Requesting approval for $50000:")
    team_lead.handle(50000)
