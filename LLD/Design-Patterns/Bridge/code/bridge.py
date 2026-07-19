"""
Bridge Pattern — Shape abstraction bridged to a Renderer implementor.
Run: python bridge.py
"""

from abc import ABC, abstractmethod


class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius):
        ...

    @abstractmethod
    def render_square(self, side):
        ...


class OpenGLRenderer(Renderer):
    def render_circle(self, radius):
        print(f"[OpenGL] drawing circle, radius={radius}")

    def render_square(self, side):
        print(f"[OpenGL] drawing square, side={side}")


class DirectXRenderer(Renderer):
    def render_circle(self, radius):
        print(f"[DirectX] drawing circle, radius={radius}")

    def render_square(self, side):
        print(f"[DirectX] drawing square, side={side}")


class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self.renderer = renderer

    @abstractmethod
    def draw(self):
        ...


class Circle(Shape):
    def __init__(self, renderer, radius):
        super().__init__(renderer)
        self.radius = radius

    def draw(self):
        self.renderer.render_circle(self.radius)


class Square(Shape):
    def __init__(self, renderer, side):
        super().__init__(renderer)
        self.side = side

    def draw(self):
        self.renderer.render_square(self.side)


if __name__ == "__main__":
    opengl_circle = Circle(OpenGLRenderer(), 5.0)
    directx_square = Square(DirectXRenderer(), 3.0)

    opengl_circle.draw()
    directx_square.draw()
