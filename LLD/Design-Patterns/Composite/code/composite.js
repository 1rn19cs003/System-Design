/**
 * Composite Pattern — file system, uniform getSize() across files and folders.
 * Run: node composite.js
 */

class FileLeaf {
  constructor(name, sizeKB) {
    this.name = name;
    this.sizeKB = sizeKB;
  }

  getSize() {
    return this.sizeKB;
  }

  print(indent = "") {
    console.log(`${indent}- ${this.name} (${this.sizeKB}KB)`);
  }
}

class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  add(component) {
    this.children.push(component);
  }

  getSize() {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = "") {
    console.log(`${indent}+ ${this.name}/ (${this.getSize()}KB total)`);
    this.children.forEach(child => child.print(indent + "  "));
  }
}

const root = new Folder("project");
const src = new Folder("src");
src.add(new FileLeaf("main.js", 12));
src.add(new FileLeaf("utils.js", 5));

const docs = new Folder("docs");
docs.add(new FileLeaf("readme.md", 3));

root.add(src);
root.add(docs);
root.add(new FileLeaf("package.json", 2));

root.print();
console.log(`Total size: ${root.getSize()}KB`);

module.exports = { FileLeaf, Folder };
