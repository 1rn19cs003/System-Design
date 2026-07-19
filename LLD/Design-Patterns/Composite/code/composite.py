"""
Composite Pattern — file system, uniform size() across files and folders.
Run: python composite.py
"""

from abc import ABC, abstractmethod


class FileSystemComponent(ABC):
    @abstractmethod
    def get_size(self):
        ...

    @abstractmethod
    def print_tree(self, indent=""):
        ...


class FileLeaf(FileSystemComponent):
    def __init__(self, name, size_kb):
        self.name = name
        self.size_kb = size_kb

    def get_size(self):
        return self.size_kb

    def print_tree(self, indent=""):
        print(f"{indent}- {self.name} ({self.size_kb}KB)")


class Folder(FileSystemComponent):
    def __init__(self, name):
        self.name = name
        self.children = []

    def add(self, component: FileSystemComponent):
        self.children.append(component)

    def get_size(self):
        return sum(child.get_size() for child in self.children)

    def print_tree(self, indent=""):
        print(f"{indent}+ {self.name}/ ({self.get_size()}KB total)")
        for child in self.children:
            child.print_tree(indent + "  ")


if __name__ == "__main__":
    root = Folder("project")
    src = Folder("src")
    src.add(FileLeaf("main.py", 12))
    src.add(FileLeaf("utils.py", 5))

    docs = Folder("docs")
    docs.add(FileLeaf("readme.md", 3))

    root.add(src)
    root.add(docs)
    root.add(FileLeaf("setup.cfg", 2))

    root.print_tree()
    print(f"Total size: {root.get_size()}KB")
