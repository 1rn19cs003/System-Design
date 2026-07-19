/**
 * Prototype Pattern — cloning a game Enemy, demonstrating deep copy of a nested field.
 * Run: node prototype.js
 */

class Stats {
  constructor(health, damage) {
    this.health = health;
    this.damage = damage;
  }

  deepCopy() {
    return new Stats(this.health, this.damage);
  }
}

class Enemy {
  constructor(type, stats) {
    this.type = type;
    this.stats = stats;
  }

  // Deep copy: stats gets its own independent copy, not a shared reference.
  clone() {
    return new Enemy(this.type, this.stats.deepCopy());
  }

  toString() {
    return `${this.type}{health=${this.stats.health}, damage=${this.stats.damage}}`;
  }
}

const orcPrototype = new Enemy("Orc", new Stats(100, 15));

const orc1 = orcPrototype.clone();
const orc2 = orcPrototype.clone();

// Mutate orc1's stats — orc2 and the prototype must stay unaffected.
orc1.stats.health = 40;

console.log("Prototype:", orcPrototype.toString());
console.log("orc1 (damaged):", orc1.toString());
console.log("orc2 (untouched):", orc2.toString());

module.exports = { Enemy, Stats };
