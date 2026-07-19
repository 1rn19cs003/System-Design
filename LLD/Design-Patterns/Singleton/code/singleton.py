"""
Singleton Pattern — implemented with a metaclass so any class using
SingletonMeta automatically becomes a singleton.
Run: python singleton.py
"""

import threading


class SingletonMeta(type):
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        # double-checked locking, same idea as the Java version
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]


class Singleton(metaclass=SingletonMeta):
    def __init__(self):
        self.request_count = 0
        print("Singleton instance created.")

    def log_request(self):
        self.request_count += 1
        print(f"Handled request #{self.request_count}")


if __name__ == "__main__":
    a = Singleton()
    b = Singleton()

    a.log_request()
    b.log_request()

    print("a is b:", a is b)  # True -> same instance
