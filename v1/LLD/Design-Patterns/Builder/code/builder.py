"""
Builder Pattern — assembling a Computer with optional parts.
Run: python builder.py
"""


class Computer:
    def __init__(self, cpu, ram_gb, storage_gb, has_gpu):
        self.cpu = cpu
        self.ram_gb = ram_gb
        self.storage_gb = storage_gb
        self.has_gpu = has_gpu

    def __repr__(self):
        return (f"Computer(cpu={self.cpu}, ram_gb={self.ram_gb}, "
                f"storage_gb={self.storage_gb}, has_gpu={self.has_gpu})")


class ComputerBuilder:
    def __init__(self):
        self._cpu = None
        self._ram_gb = 0
        self._storage_gb = 0
        self._has_gpu = False

    def set_cpu(self, cpu):
        self._cpu = cpu
        return self

    def set_ram(self, ram_gb):
        self._ram_gb = ram_gb
        return self

    def set_storage(self, storage_gb):
        self._storage_gb = storage_gb
        return self

    def add_gpu(self):
        self._has_gpu = True
        return self

    def build(self):
        return Computer(self._cpu, self._ram_gb, self._storage_gb, self._has_gpu)


if __name__ == "__main__":
    office_pc = (ComputerBuilder()
                 .set_cpu("Intel i5")
                 .set_ram(16)
                 .set_storage(512)
                 .build())

    gaming_pc = (ComputerBuilder()
                 .set_cpu("Intel i9")
                 .set_ram(32)
                 .set_storage(2000)
                 .add_gpu()
                 .build())

    print(office_pc)
    print(gaming_pc)
