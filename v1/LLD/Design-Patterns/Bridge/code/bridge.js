/**
 * Bridge Pattern — Shape abstraction bridged to a Renderer implementor.
 * Run: node bridge.js
 */

class OpenGLRenderer {
  renderCircle(radius) {
    console.log(`[OpenGL] drawing circle, radius=${radius}`);
  }
  renderSquare(side) {
    console.log(`[OpenGL] drawing square, side=${side}`);
  }
}

class DirectXRenderer {
  renderCircle(radius) {
    console.log(`[DirectX] drawing circle, radius=${radius}`);
  }
  renderSquare(side) {
    console.log(`[DirectX] drawing square, side=${side}`);
  }
}

class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }
}

class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }
  draw() {
    this.renderer.renderCircle(this.radius);
  }
}

class Square extends Shape {
  constructor(renderer, side) {
    super(renderer);
    this.side = side;
  }
  draw() {
    this.renderer.renderSquare(this.side);
  }
}

const openGLCircle = new Circle(new OpenGLRenderer(), 5.0);
const directXSquare = new Square(new DirectXRenderer(), 3.0);

openGLCircle.draw();
directXSquare.draw();

module.exports = { Circle, Square, OpenGLRenderer, DirectXRenderer };
