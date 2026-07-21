// Builder Pattern — assembling a Computer with optional parts.
// Compile: g++ -std=c++14 Builder.cpp -o builder
// Run:     ./builder

#include <iostream>
#include <string>

class Computer {
public:
    std::string cpu;
    int ramGB;
    int storageGB;
    bool hasGPU;

    Computer(std::string cpu, int ramGB, int storageGB, bool hasGPU)
        : cpu(std::move(cpu)), ramGB(ramGB), storageGB(storageGB), hasGPU(hasGPU) {}

    void print() const {
        std::cout << "Computer{cpu=" << cpu << ", ramGB=" << ramGB
                   << ", storageGB=" << storageGB
                   << ", hasGPU=" << (hasGPU ? "true" : "false") << "}" << std::endl;
    }
};

class ComputerBuilder {
public:
    ComputerBuilder& setCPU(const std::string& cpu) {
        cpu_ = cpu;
        return *this;
    }

    ComputerBuilder& setRAM(int ramGB) {
        ramGB_ = ramGB;
        return *this;
    }

    ComputerBuilder& setStorage(int storageGB) {
        storageGB_ = storageGB;
        return *this;
    }

    ComputerBuilder& addGPU() {
        hasGPU_ = true;
        return *this;
    }

    Computer build() const {
        return Computer(cpu_, ramGB_, storageGB_, hasGPU_);
    }

private:
    std::string cpu_;
    int ramGB_ = 0;
    int storageGB_ = 0;
    bool hasGPU_ = false;
};

int main() {
    Computer officePC = ComputerBuilder()
        .setCPU("Intel i5")
        .setRAM(16)
        .setStorage(512)
        .build();

    Computer gamingPC = ComputerBuilder()
        .setCPU("Intel i9")
        .setRAM(32)
        .setStorage(2000)
        .addGPU()
        .build();

    officePC.print();
    gamingPC.print();

    return 0;
}
