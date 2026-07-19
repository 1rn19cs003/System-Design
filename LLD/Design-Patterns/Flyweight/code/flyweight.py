"""
Flyweight Pattern — sharing tree type data (intrinsic) across many tree instances.
Run: python flyweight.py
"""


class TreeType:
    """The Flyweight: shared, immutable intrinsic state."""

    def __init__(self, name, color, texture):
        self.name = name
        self.color = color
        self.texture = texture

    def render(self, x, y):
        # x, y are extrinsic state, passed in rather than stored here.
        print(f"Rendering {self.name} ({self.color}, {self.texture}) at ({x},{y})")


class TreeTypeFactory:
    """Caches one TreeType per unique combination of intrinsic state."""

    _cache = {}

    @classmethod
    def get_tree_type(cls, name, color, texture):
        key = (name, color, texture)
        if key not in cls._cache:
            print(f"Creating new TreeType for: {name}-{color}-{texture}")
            cls._cache[key] = TreeType(name, color, texture)
        return cls._cache[key]

    @classmethod
    def cache_size(cls):
        return len(cls._cache)


class Tree:
    """Only stores extrinsic state + a reference to its shared TreeType."""

    def __init__(self, x, y, tree_type: TreeType):
        self.x = x
        self.y = y
        self.tree_type = tree_type

    def render(self):
        self.tree_type.render(self.x, self.y)


if __name__ == "__main__":
    forest = [
        Tree(10, 20, TreeTypeFactory.get_tree_type("Oak", "Green", "Rough")),
        Tree(30, 40, TreeTypeFactory.get_tree_type("Oak", "Green", "Rough")),
        Tree(50, 60, TreeTypeFactory.get_tree_type("Pine", "DarkGreen", "Smooth")),
    ]

    for tree in forest:
        tree.render()

    print(f"Trees created: {len(forest)}, TreeType flyweights cached: {TreeTypeFactory.cache_size()}")
