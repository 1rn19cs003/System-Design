// Builder Pattern — assembling a Computer with optional parts.
// Compile: javac Builder.java
// Run:     java Builder

class Computer {
    private final String cpu;
    private final int ramGB;
    private final int storageGB;
    private final boolean hasGPU;

    private Computer(ComputerBuilder builder) {
        this.cpu = builder.cpu;
        this.ramGB = builder.ramGB;
        this.storageGB = builder.storageGB;
        this.hasGPU = builder.hasGPU;
    }

    public String toString() {
        return "Computer{cpu=" + cpu + ", ramGB=" + ramGB +
               ", storageGB=" + storageGB + ", hasGPU=" + hasGPU + "}";
    }

    static class ComputerBuilder {
        private String cpu;
        private int ramGB;
        private int storageGB;
        private boolean hasGPU = false;

        ComputerBuilder setCPU(String cpu) {
            this.cpu = cpu;
            return this;
        }

        ComputerBuilder setRAM(int ramGB) {
            this.ramGB = ramGB;
            return this;
        }

        ComputerBuilder setStorage(int storageGB) {
            this.storageGB = storageGB;
            return this;
        }

        ComputerBuilder addGPU() {
            this.hasGPU = true;
            return this;
        }

        Computer build() {
            return new Computer(this);
        }
    }
}

public class Builder {
    public static void main(String[] args) {
        Computer officePC = new Computer.ComputerBuilder()
                .setCPU("Intel i5")
                .setRAM(16)
                .setStorage(512)
                .build();

        Computer gamingPC = new Computer.ComputerBuilder()
                .setCPU("Intel i9")
                .setRAM(32)
                .setStorage(2000)
                .addGPU()
                .build();

        System.out.println(officePC);
        System.out.println(gamingPC);
    }
}
