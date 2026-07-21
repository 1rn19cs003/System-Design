import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'LLD Capstone: Parking Lot — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.*;

public class ParkingLotDemo {
    enum SpotSize { SMALL, MEDIUM, LARGE }

    static final Map<SpotSize, Integer> RATE_PER_HOUR = Map.of(
        SpotSize.SMALL, 2,
        SpotSize.MEDIUM, 3,
        SpotSize.LARGE, 5
    );

    abstract static class Vehicle {
        String name;
        int hours;
        Vehicle(String name, int hours) { this.name = name; this.hours = hours; }
        abstract SpotSize requiredSize();
    }

    static class Motorcycle extends Vehicle {
        Motorcycle(String name, int hours) { super(name, hours); }
        SpotSize requiredSize() { return SpotSize.SMALL; }
    }

    static class Car extends Vehicle {
        Car(String name, int hours) { super(name, hours); }
        SpotSize requiredSize() { return SpotSize.MEDIUM; }
    }

    static class Bus extends Vehicle {
        Bus(String name, int hours) { super(name, hours); }
        SpotSize requiredSize() { return SpotSize.LARGE; }
    }

    static class ParkingSpot {
        String spotId;
        SpotSize size;
        boolean occupied = false;
        ParkingSpot(String spotId, SpotSize size) { this.spotId = spotId; this.size = size; }
    }

    static class ParkingLot {
        List<ParkingSpot> spots;
        ParkingLot(List<ParkingSpot> spots) { this.spots = spots; }

        ParkingSpot park(Vehicle vehicle) {
            ParkingSpot best = null;
            for (ParkingSpot spot : spots) {
                if (spot.occupied || spot.size.ordinal() < vehicle.requiredSize().ordinal()) continue;
                if (best == null || spot.size.ordinal() < best.size.ordinal()) {
                    best = spot;
                }
            }
            if (best != null) best.occupied = true;
            return best;
        }
    }

    public static void main(String[] args) {
        List<ParkingSpot> spots = new ArrayList<>(List.of(
            new ParkingSpot("S1", SpotSize.SMALL),
            new ParkingSpot("S2", SpotSize.SMALL),
            new ParkingSpot("M1", SpotSize.MEDIUM),
            new ParkingSpot("M2", SpotSize.MEDIUM),
            new ParkingSpot("L1", SpotSize.LARGE)
        ));
        ParkingLot lot = new ParkingLot(spots);

        List<Vehicle> vehicles = List.of(
            new Motorcycle("Motorcycle A", 2),
            new Car("Car A", 3),
            new Bus("Bus A", 1),
            new Motorcycle("Motorcycle B", 4),
            new Car("Car B", 2),
            new Bus("Bus B", 3)
        );

        int totalRevenue = 0;
        int parkedCount = 0;
        for (Vehicle vehicle : vehicles) {
            ParkingSpot spot = lot.park(vehicle);
            if (spot == null) {
                System.out.printf("%s: REJECTED (no %s-or-larger spot free)%n",
                    vehicle.name, vehicle.requiredSize().toString().toLowerCase());
                continue;
            }
            int fee = vehicle.hours * RATE_PER_HOUR.get(spot.size);
            totalRevenue += fee;
            parkedCount++;
            System.out.printf("%s: parked in %s (%s) for %dh, fee=$%d%n",
                vehicle.name, spot.spotId, spot.size, vehicle.hours, fee);
        }
        System.out.printf("Parked %d/%d vehicles, total revenue=$%d%n", parkedCount, vehicles.size(), totalRevenue);
    }
}`,
    output: `Motorcycle A: parked in S1 (SMALL) for 2h, fee=$4
Car A: parked in M1 (MEDIUM) for 3h, fee=$9
Bus A: parked in L1 (LARGE) for 1h, fee=$5
Motorcycle B: parked in S2 (SMALL) for 4h, fee=$8
Car B: parked in M2 (MEDIUM) for 2h, fee=$6
Bus B: REJECTED (no large-or-larger spot free)
Parked 5/6 vehicles, total revenue=$32`,
  },
  python: {
    code: `from abc import ABC, abstractmethod
from enum import IntEnum


class SpotSize(IntEnum):
    SMALL = 1
    MEDIUM = 2
    LARGE = 3


RATE_PER_HOUR = {SpotSize.SMALL: 2, SpotSize.MEDIUM: 3, SpotSize.LARGE: 5}


class Vehicle(ABC):
    def __init__(self, name, hours):
        self.name = name
        self.hours = hours

    @abstractmethod
    def required_size(self):
        pass


class Motorcycle(Vehicle):
    def required_size(self):
        return SpotSize.SMALL


class Car(Vehicle):
    def required_size(self):
        return SpotSize.MEDIUM


class Bus(Vehicle):
    def required_size(self):
        return SpotSize.LARGE


class ParkingSpot:
    def __init__(self, spot_id, size):
        self.spot_id = spot_id
        self.size = size
        self.occupied = False


class ParkingLot:
    def __init__(self, spots):
        self.spots = spots

    def park(self, vehicle):
        candidates = [s for s in self.spots if not s.occupied and s.size >= vehicle.required_size()]
        if not candidates:
            return None
        best = min(candidates, key=lambda s: s.size)
        best.occupied = True
        return best


def main():
    spots = [
        ParkingSpot("S1", SpotSize.SMALL),
        ParkingSpot("S2", SpotSize.SMALL),
        ParkingSpot("M1", SpotSize.MEDIUM),
        ParkingSpot("M2", SpotSize.MEDIUM),
        ParkingSpot("L1", SpotSize.LARGE),
    ]
    lot = ParkingLot(spots)

    vehicles = [
        Motorcycle("Motorcycle A", 2),
        Car("Car A", 3),
        Bus("Bus A", 1),
        Motorcycle("Motorcycle B", 4),
        Car("Car B", 2),
        Bus("Bus B", 3),
    ]

    total_revenue = 0
    parked_count = 0
    for vehicle in vehicles:
        spot = lot.park(vehicle)
        if spot is None:
            print(f"{vehicle.name}: REJECTED (no {vehicle.required_size().name.lower()}-or-larger spot free)")
            continue
        fee = vehicle.hours * RATE_PER_HOUR[spot.size]
        total_revenue += fee
        parked_count += 1
        print(f"{vehicle.name}: parked in {spot.spot_id} ({spot.size.name}) for {vehicle.hours}h, fee=\${fee}")

    print(f"Parked {parked_count}/{len(vehicles)} vehicles, total revenue=\${total_revenue}")


if __name__ == "__main__":
    main()`,
    output: `Motorcycle A: parked in S1 (SMALL) for 2h, fee=$4
Car A: parked in M1 (MEDIUM) for 3h, fee=$9
Bus A: parked in L1 (LARGE) for 1h, fee=$5
Motorcycle B: parked in S2 (SMALL) for 4h, fee=$8
Car B: parked in M2 (MEDIUM) for 2h, fee=$6
Bus B: REJECTED (no large-or-larger spot free)
Parked 5/6 vehicles, total revenue=$32`,
  },
  javascript: {
    code: `const SpotSize = { SMALL: 1, MEDIUM: 2, LARGE: 3 };
const SIZE_NAME = { 1: "SMALL", 2: "MEDIUM", 3: "LARGE" };
const RATE_PER_HOUR = { 1: 2, 2: 3, 3: 5 };

class Vehicle {
  constructor(name, hours) {
    this.name = name;
    this.hours = hours;
  }
}
class Motorcycle extends Vehicle {
  requiredSize() { return SpotSize.SMALL; }
}
class Car extends Vehicle {
  requiredSize() { return SpotSize.MEDIUM; }
}
class Bus extends Vehicle {
  requiredSize() { return SpotSize.LARGE; }
}

class ParkingSpot {
  constructor(spotId, size) {
    this.spotId = spotId;
    this.size = size;
    this.occupied = false;
  }
}

class ParkingLot {
  constructor(spots) {
    this.spots = spots;
  }
  park(vehicle) {
    let best = null;
    for (const spot of this.spots) {
      if (spot.occupied || spot.size < vehicle.requiredSize()) continue;
      if (best === null || spot.size < best.size) best = spot;
    }
    if (best) best.occupied = true;
    return best;
  }
}

const spots = [
  new ParkingSpot("S1", SpotSize.SMALL),
  new ParkingSpot("S2", SpotSize.SMALL),
  new ParkingSpot("M1", SpotSize.MEDIUM),
  new ParkingSpot("M2", SpotSize.MEDIUM),
  new ParkingSpot("L1", SpotSize.LARGE),
];
const lot = new ParkingLot(spots);

const vehicles = [
  new Motorcycle("Motorcycle A", 2),
  new Car("Car A", 3),
  new Bus("Bus A", 1),
  new Motorcycle("Motorcycle B", 4),
  new Car("Car B", 2),
  new Bus("Bus B", 3),
];

let totalRevenue = 0;
let parkedCount = 0;
for (const vehicle of vehicles) {
  const spot = lot.park(vehicle);
  if (!spot) {
    console.log(\`\${vehicle.name}: REJECTED (no \${SIZE_NAME[vehicle.requiredSize()].toLowerCase()}-or-larger spot free)\`);
    continue;
  }
  const fee = vehicle.hours * RATE_PER_HOUR[spot.size];
  totalRevenue += fee;
  parkedCount++;
  console.log(\`\${vehicle.name}: parked in \${spot.spotId} (\${SIZE_NAME[spot.size]}) for \${vehicle.hours}h, fee=$\${fee}\`);
}
console.log(\`Parked \${parkedCount}/\${vehicles.length} vehicles, total revenue=$\${totalRevenue}\`);`,
    output: `Motorcycle A: parked in S1 (SMALL) for 2h, fee=$4
Car A: parked in M1 (MEDIUM) for 3h, fee=$9
Bus A: parked in L1 (LARGE) for 1h, fee=$5
Motorcycle B: parked in S2 (SMALL) for 4h, fee=$8
Car B: parked in M2 (MEDIUM) for 2h, fee=$6
Bus B: REJECTED (no large-or-larger spot free)
Parked 5/6 vehicles, total revenue=$32`,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <cctype>

enum class SpotSize { SMALL = 1, MEDIUM = 2, LARGE = 3 };

std::string sizeName(SpotSize size) {
    switch (size) {
        case SpotSize::SMALL: return "SMALL";
        case SpotSize::MEDIUM: return "MEDIUM";
        case SpotSize::LARGE: return "LARGE";
    }
    return "";
}

int ratePerHour(SpotSize size) {
    switch (size) {
        case SpotSize::SMALL: return 2;
        case SpotSize::MEDIUM: return 3;
        case SpotSize::LARGE: return 5;
    }
    return 0;
}

class Vehicle {
public:
    std::string name;
    int hours;
    Vehicle(std::string name, int hours) : name(std::move(name)), hours(hours) {}
    virtual SpotSize requiredSize() const = 0;
    virtual ~Vehicle() = default;
};

class Motorcycle : public Vehicle {
public:
    Motorcycle(std::string name, int hours) : Vehicle(std::move(name), hours) {}
    SpotSize requiredSize() const override { return SpotSize::SMALL; }
};
class Car : public Vehicle {
public:
    Car(std::string name, int hours) : Vehicle(std::move(name), hours) {}
    SpotSize requiredSize() const override { return SpotSize::MEDIUM; }
};
class Bus : public Vehicle {
public:
    Bus(std::string name, int hours) : Vehicle(std::move(name), hours) {}
    SpotSize requiredSize() const override { return SpotSize::LARGE; }
};

struct ParkingSpot {
    std::string spotId;
    SpotSize size;
    bool occupied = false;
    ParkingSpot(std::string spotId, SpotSize size) : spotId(std::move(spotId)), size(size) {}
};

class ParkingLot {
public:
    explicit ParkingLot(std::vector<ParkingSpot> spots) : spots(std::move(spots)) {}

    ParkingSpot* park(const Vehicle& vehicle) {
        ParkingSpot* best = nullptr;
        for (auto& spot : spots) {
            if (spot.occupied || static_cast<int>(spot.size) < static_cast<int>(vehicle.requiredSize())) continue;
            if (best == nullptr || static_cast<int>(spot.size) < static_cast<int>(best->size)) {
                best = &spot;
            }
        }
        if (best) best->occupied = true;
        return best;
    }

private:
    std::vector<ParkingSpot> spots;
};

int main() {
    std::vector<ParkingSpot> spotList = {
        ParkingSpot("S1", SpotSize::SMALL),
        ParkingSpot("S2", SpotSize::SMALL),
        ParkingSpot("M1", SpotSize::MEDIUM),
        ParkingSpot("M2", SpotSize::MEDIUM),
        ParkingSpot("L1", SpotSize::LARGE),
    };
    ParkingLot lot(spotList);

    std::vector<std::unique_ptr<Vehicle>> vehicles;
    vehicles.push_back(std::make_unique<Motorcycle>("Motorcycle A", 2));
    vehicles.push_back(std::make_unique<Car>("Car A", 3));
    vehicles.push_back(std::make_unique<Bus>("Bus A", 1));
    vehicles.push_back(std::make_unique<Motorcycle>("Motorcycle B", 4));
    vehicles.push_back(std::make_unique<Car>("Car B", 2));
    vehicles.push_back(std::make_unique<Bus>("Bus B", 3));

    int totalRevenue = 0;
    int parkedCount = 0;
    for (const auto& vehicle : vehicles) {
        ParkingSpot* spot = lot.park(*vehicle);
        if (!spot) {
            std::string req = sizeName(vehicle->requiredSize());
            for (auto& c : req) c = static_cast<char>(tolower(c));
            std::cout << vehicle->name << ": REJECTED (no " << req << "-or-larger spot free)" << std::endl;
            continue;
        }
        int fee = vehicle->hours * ratePerHour(spot->size);
        totalRevenue += fee;
        parkedCount++;
        std::cout << vehicle->name << ": parked in " << spot->spotId << " (" << sizeName(spot->size)
                   << ") for " << vehicle->hours << "h, fee=$" << fee << std::endl;
    }
    std::cout << "Parked " << parkedCount << "/" << vehicles.size()
               << " vehicles, total revenue=$" << totalRevenue << std::endl;
    return 0;
}`,
    output: `Motorcycle A: parked in S1 (SMALL) for 2h, fee=$4
Car A: parked in M1 (MEDIUM) for 3h, fee=$9
Bus A: parked in L1 (LARGE) for 1h, fee=$5
Motorcycle B: parked in S2 (SMALL) for 4h, fee=$8
Car B: parked in M2 (MEDIUM) for 2h, fee=$6
Bus B: REJECTED (no large-or-larger spot free)
Parked 5/6 vehicles, total revenue=$32`,
  },
};

const qaItems = [
  {
    q: 'How would you design the class hierarchy for a parking lot?',
    a: 'An abstract Vehicle base class with concrete subclasses (Motorcycle, Car, Bus) each defining their required spot size, a ParkingSpot class holding a size and occupied flag, and a ParkingLot that owns the spots and exposes a park(vehicle) method — keeping vehicle behavior, spot state, and lot-level assignment logic in three separate, focused classes.',
  },
  {
    q: 'Why use best-fit instead of first-fit for spot assignment?',
    a: "First-fit assigns the first spot found that's big enough, which can waste a large spot on a small vehicle if that happens to be first in the list. Best-fit scans all free spots and picks the smallest one that still fits, preserving larger spots for vehicles that actually need them — at the cost of scanning more spots per assignment.",
  },
  {
    q: "How do you handle a vehicle that can't be parked?",
    a: 'The park() method should return an explicit "no spot available" result (null, an Optional, or a rejected status) rather than throwing an unhandled exception or crashing — a full lot is an expected, ordinary outcome, not an error condition.',
  },
  {
    q: 'How would you extend this design to support multiple floors or reserved spots?',
    a: 'Add a floor or reserved attribute to ParkingSpot and filter candidates by it before applying the same best-fit logic — because the size-matching rule is already isolated in one place, extending the filtering criteria doesn\'t require touching the Vehicle hierarchy or the pricing logic at all.',
  },
];

export default function LldCapstonesPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld"
          backLabel="Back to LLD"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'plain-english', label: 'In Plain English' },
            { id: 'theory', label: 'Theory & Diagrams' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'LLD', href: '/pages/lld' }, { label: 'Capstone: Parking Lot' }]} />
          <h1 id="overview">LLD Capstone: Parking Lot</h1>
          <p>
            A worked low-level design example that pulls together a class hierarchy, a best-fit
            matching rule, and a pricing calculation — one of the most commonly asked LLD interview
            questions in its own right.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Every parking garage attendant does the same small job, over and over: match the vehicle in front of them to the smallest spot that actually fits.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-capstones/attendant-analogy.svg"
                alt="An attendant matching a motorcycle, car, or bus to the smallest available spot size that fits, out of small, medium, and large spots"
              />
              <figcaption>You hand over your key; the size-matching and pricing logic happen behind the scenes</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  This is the OOP Fundamentals car analogy applied for real: a <code>Vehicle</code>{' '}
                  hierarchy (Motorcycle, Car, Bus), a <code>ParkingSpot</code> with a size, and one
                  method that decides where each vehicle goes.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting part isn&apos;t parking a car in an obviously-sized spot —
                  it&apos;s the tie-breaking rule (always the smallest spot that still fits) and what
                  happens when nothing fits at all: a clean rejection, not a crash.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why this is a good capstone</h3>
            <p>
              A parking lot is small enough to hold in your head end to end, but it still forces real
              decisions: a <code>Vehicle</code> class hierarchy (OOP), a spot-matching rule that has
              to pick correctly under partial availability, and a pricing rule that depends on the
              spot actually assigned rather than the vehicle type.
            </p>

            <h3>Best-fit spot assignment</h3>
            <p>
              A vehicle can use any spot at least as large as it needs — a motorcycle fits in a
              small, medium, or large spot. But assigning a motorcycle to a large spot wastes it for
              the next bus that arrives. Best-fit picks the <em>smallest</em> available spot that
              still satisfies the vehicle&apos;s size requirement.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-capstones/size-matching.svg"
                alt="Top: a Bus is assigned to a free Large spot directly. Bottom: a Bus is rejected when only Small and Medium spots are free, even though space exists, because none of it is the right size."
              />
              <figcaption>Free space isn&apos;t enough — it has to be a large-enough space</figcaption>
            </figure>

            <h3>Pricing by spot, not by vehicle</h3>
            <p>
              Once a vehicle is assigned a spot, the fee is computed from that spot&apos;s hourly
              rate and the hours parked — not a flat per-vehicle-type rate. This keeps pricing logic
              decoupled from the vehicle hierarchy entirely, so a pricing change never touches{' '}
              <code>Vehicle</code> subclasses at all.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Best-fit assignment when">
                <ul>
                  <li>Spot sizes vary meaningfully and larger vehicles arrive unpredictably — wasting a large spot on a motorcycle has a real cost.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ First-fit assignment when">
                <ul>
                  <li>Spots are roughly interchangeable, or assignment speed matters more than minimizing wasted space (best-fit scans every free spot; first-fit stops at the first match).</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> a clean separation between the
              vehicle hierarchy, the spot-matching rule, and the pricing rule — and handling the
              &quot;no spot fits&quot; case explicitly instead of assuming a vehicle can always park.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> a working <code>Vehicle</code> hierarchy
              plus a correct size-matching loop, with the rejection case handled, is enough to clear
              this question at most levels.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to extend it live — add a new
              vehicle type, change the pricing rule to a flat daily cap, or make the lot support
              multiple floors — without breaking the existing structure.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Airport and stadium parking systems</strong> — real deployments use the same size-tiered spot model, often combined with reserved sections for permit holders.</li>
              <li><strong>Cloud instance scheduling</strong> — the same best-fit-bin-packing idea shows up when a scheduler assigns workloads to the smallest machine that still has enough CPU/memory free.</li>
              <li><strong>Warehouse slotting systems</strong> — items are assigned to the smallest bin size that fits, for the same reason a motorcycle shouldn&apos;t take a bus spot: wasted capacity compounds at scale.</li>
              <li><strong>Hotel room assignment</strong> — the same is-a/has-a and best-fit-matching structure applies to matching guests to room types by size and amenity requirements.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>
              A real 5-spot lot (2 Small, 2 Medium, 1 Large) receiving 6 vehicles in order. The
              best-fit assignment, the one rejection (a second bus with no Large spot left), and the
              total revenue are all computed live from the same logic described above — not scripted
              to match, so the numbers below are a genuine trace of the run.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Bus B is rejected because the only free spots left (none, in this run) don't meet its Large size requirement — the lot never mis-assigns a vehicle to a spot too small for it."
            />
          </section>

          <PageNav
            prev={{ label: 'SOLID Principles', href: '/pages/lld/solid-principles' }}
            next={{ label: 'Design Patterns: Singleton', href: '/pages/lld/design-patterns/creational/singleton' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'LLD',
          links: [
            { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
            { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
            { label: 'LLD Capstones', href: '/pages/lld/capstones' },
          ],
        }}
      />
    </>
  );
}
