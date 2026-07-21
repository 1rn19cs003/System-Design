// Bridge Pattern — Shape abstraction bridged to a Renderer implementor.
// Compile: g++ -std=c++14 Bridge.cpp -o bridge
// Run:     ./bridge

#include <iostream>
#include <memory>

class Renderer {
public:
    virtual void renderCircle(float radius) = 0;
    virtual void renderSquare(float side) = 0;
    virtual ~Renderer() = default;
};

class OpenGLRenderer : public Renderer {
public:
    void renderCircle(float radius) override {
        std::cout << "[OpenGL] drawing circle, radius=" << radius << std::endl;
    }
    void renderSquare(float side) override {
        std::cout << "[OpenGL] drawing square, side=" << side << std::endl;
    }
};

class DirectXRenderer : public Renderer {
public:
    void renderCircle(float radius) override {
        std::cout << "[DirectX] drawing circle, radius=" << radius << std::endl;
    }
    void renderSquare(float side) override {
        std::cout << "[DirectX] drawing square, side=" << side << std::endl;
    }
};

class Shape {
public:
    explicit Shape(Renderer& renderer) : renderer_(renderer) {}
    virtual void draw() = 0;
    virtual ~Shape() = default;

protected:
    Renderer& renderer_;
};

class Circle : public Shape {
public:
    Circle(Renderer& renderer, float radius) : Shape(renderer), radius_(radius) {}
    void draw() override { renderer_.renderCircle(radius_); }

private:
    float radius_;
};

class Square : public Shape {
public:
    Square(Renderer& renderer, float side) : Shape(renderer), side_(side) {}
    void draw() override { renderer_.renderSquare(side_); }

private:
    float side_;
};

int main() {
    OpenGLRenderer openGL;
    DirectXRenderer directX;

    Circle openGLCircle(openGL, 5.0f);
    Square directXSquare(directX, 3.0f);

    openGLCircle.draw();
    directXSquare.draw();

    return 0;
}
