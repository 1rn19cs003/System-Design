"""
Prototype Pattern — cloning a game Enemy, demonstrating deep copy of a nested field.
Run: python prototype.py
"""

import copy


class Stats:
    def __init__(self, health, damage):
        self.health = health
        self.damage = damage


class Enemy:
    def __init__(self, enemy_type, stats):
        self.type = enemy_type
        self.stats = stats

    def clone(self):
        # copy.deepcopy recursively clones nested objects (like `stats`)
        # instead of sharing references with the original.
        return copy.deepcopy(self)

    def __repr__(self):
        return f"{self.type}{{health={self.stats.health}, damage={self.stats.damage}}}"


if __name__ == "__main__":
    orc_prototype = Enemy("Orc", Stats(100, 15))

    orc1 = orc_prototype.clone()
    orc2 = orc_prototype.clone()

    # Mutate orc1's stats — orc2 and the prototype must stay unaffected.
    orc1.stats.health = 40

    print("Prototype:", orc_prototype)
    print("orc1 (damaged):", orc1)
    print("orc2 (untouched):", orc2)
