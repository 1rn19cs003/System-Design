/**
 * Flyweight Pattern — sharing tree type data (intrinsic) across many tree instances.
 * Run: node flyweight.js
 */

// The Flyweight: shared, immutable intrinsic state.
class TreeType {
  constructor(name, color, texture) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }

  render(x, y) {
    // x, y are extrinsic state, passed in rather than stored here.
    console.log(`Rendering ${this.name} (${this.color}, ${this.texture}) at (${x},${y})`);
  }
}

// The Flyweight Factory: caches one TreeType per unique combination.
class TreeTypeFactory {
  static cache = new Map();

  static getTreeType(name, color, texture) {
    const key = `${name}-${color}-${texture}`;
    if (!TreeTypeFactory.cache.has(key)) {
      console.log(`Creating new TreeType for: ${key}`);
      TreeTypeFactory.cache.set(key, new TreeType(name, color, texture));
    }
    return TreeTypeFactory.cache.get(key);
  }

  static cacheSize() {
    return TreeTypeFactory.cache.size;
  }
}

// Tree only stores extrinsic state + a reference to its shared TreeType.
class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  render() {
    this.type.render(this.x, this.y);
  }
}

const forest = [
  new Tree(10, 20, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
  new Tree(30, 40, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
  new Tree(50, 60, TreeTypeFactory.getTreeType("Pine", "DarkGreen", "Smooth")),
];

forest.forEach(tree => tree.render());

console.log(`Trees created: ${forest.length}, TreeType flyweights cached: ${TreeTypeFactory.cacheSize()}`);

module.exports = { TreeType, TreeTypeFactory, Tree };
