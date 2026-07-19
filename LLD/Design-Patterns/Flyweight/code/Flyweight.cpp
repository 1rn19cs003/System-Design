// Flyweight Pattern — sharing tree type data (intrinsic) across many tree instances.
// Compile: g++ -std=c++14 Flyweight.cpp -o flyweight
// Run:     ./flyweight

#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// The Flyweight: shared, immutable intrinsic state.
class TreeType {
public:
    TreeType(std::string name, std::string color, std::string texture)
        : name_(std::move(name)), color_(std::move(color)), texture_(std::move(texture)) {}

    void render(int x, int y) const {
        // x, y are extrinsic state, passed in rather than stored here.
        std::cout << "Rendering " << name_ << " (" << color_ << ", " << texture_ << ") at (" << x << "," << y << ")" << std::endl;
    }

private:
    std::string name_, color_, texture_;
};

// The Flyweight Factory: caches one TreeType per unique combination.
class TreeTypeFactory {
public:
    static TreeType* getTreeType(const std::string& name, const std::string& color, const std::string& texture) {
        std::string key = name + "-" + color + "-" + texture;
        auto it = cache_.find(key);
        if (it == cache_.end()) {
            std::cout << "Creating new TreeType for: " << key << std::endl;
            auto result = cache_.emplace(key, std::make_unique<TreeType>(name, color, texture));
            return result.first->second.get();
        }
        return it->second.get();
    }

    static size_t cacheSize() { return cache_.size(); }

private:
    static std::unordered_map<std::string, std::unique_ptr<TreeType>> cache_;
};

std::unordered_map<std::string, std::unique_ptr<TreeType>> TreeTypeFactory::cache_;

// Tree only stores extrinsic state + a pointer to its shared TreeType.
class Tree {
public:
    Tree(int x, int y, TreeType* type) : x_(x), y_(y), type_(type) {}

    void render() const { type_->render(x_, y_); }

private:
    int x_, y_;
    TreeType* type_;
};

int main() {
    Tree forest[] = {
        Tree(10, 20, TreeTypeFactory::getTreeType("Oak", "Green", "Rough")),
        Tree(30, 40, TreeTypeFactory::getTreeType("Oak", "Green", "Rough")),
        Tree(50, 60, TreeTypeFactory::getTreeType("Pine", "DarkGreen", "Smooth")),
    };

    for (const auto& tree : forest) tree.render();

    std::cout << "Trees created: 3, TreeType flyweights cached: " << TreeTypeFactory::cacheSize() << std::endl;

    return 0;
}
