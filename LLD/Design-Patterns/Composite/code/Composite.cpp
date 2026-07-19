// Composite Pattern — file system, uniform getSize() across files and folders.
// Compile: g++ -std=c++14 Composite.cpp -o composite
// Run:     ./composite

#include <iostream>
#include <string>
#include <vector>
#include <memory>

class FileSystemComponent {
public:
    virtual int getSize() const = 0;
    virtual void print(const std::string& indent) const = 0;
    virtual ~FileSystemComponent() = default;
};

class FileLeaf : public FileSystemComponent {
public:
    FileLeaf(std::string name, int sizeKB) : name_(std::move(name)), sizeKB_(sizeKB) {}

    int getSize() const override { return sizeKB_; }

    void print(const std::string& indent) const override {
        std::cout << indent << "- " << name_ << " (" << sizeKB_ << "KB)" << std::endl;
    }

private:
    std::string name_;
    int sizeKB_;
};

class Folder : public FileSystemComponent {
public:
    explicit Folder(std::string name) : name_(std::move(name)) {}

    void add(std::unique_ptr<FileSystemComponent> component) {
        children_.push_back(std::move(component));
    }

    int getSize() const override {
        int total = 0;
        for (const auto& child : children_) total += child->getSize();
        return total;
    }

    void print(const std::string& indent) const override {
        std::cout << indent << "+ " << name_ << "/ (" << getSize() << "KB total)" << std::endl;
        for (const auto& child : children_) child->print(indent + "  ");
    }

private:
    std::string name_;
    std::vector<std::unique_ptr<FileSystemComponent>> children_;
};

int main() {
    auto root = std::make_unique<Folder>("project");
    auto src = std::make_unique<Folder>("src");
    src->add(std::make_unique<FileLeaf>("main.cpp", 12));
    src->add(std::make_unique<FileLeaf>("utils.cpp", 5));

    auto docs = std::make_unique<Folder>("docs");
    docs->add(std::make_unique<FileLeaf>("readme.md", 3));

    root->add(std::move(src));
    root->add(std::move(docs));
    root->add(std::make_unique<FileLeaf>("CMakeLists.txt", 2));

    root->print("");
    std::cout << "Total size: " << root->getSize() << "KB" << std::endl;

    return 0;
}
