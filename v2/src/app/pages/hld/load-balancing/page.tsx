import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Load Balancing — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.io.*;
import java.net.*;
import java.util.*;

public class LoadBalancer {
    static final String HOST = "127.0.0.1";
    static final int[] BACKEND_PORTS = {9301, 9302, 9303};
    static final int NUM_REQUESTS = 9;

    static void runBackend(int port) {
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);
                out.write(("pong-from-" + port).getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void roundRobin(int requests) throws IOException {
        Map<Integer, Integer> counts = new LinkedHashMap<>();
        for (int p : BACKEND_PORTS) counts.put(p, 0);
        for (int i = 0; i < requests; i++) {
            int port = BACKEND_PORTS[i % BACKEND_PORTS.length];
            long start = System.nanoTime();
            Socket socket = new Socket(HOST, port);
            OutputStream out = socket.getOutputStream();
            InputStream in = socket.getInputStream();
            out.write("ping".getBytes());
            out.flush();
            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            double latencyMs = (System.nanoTime() - start) / 1_000_000.0;
            socket.close();
            String response = new String(buffer, 0, read);
            counts.put(port, counts.get(port) + 1);
            System.out.printf("Request %d: routed to %d, got '%s' in %.2f ms%n", i + 1, port, response, latencyMs);
        }
        StringBuilder sb = new StringBuilder("Distribution:");
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            sb.append(" backend-").append(e.getKey()).append("=").append(e.getValue());
        }
        System.out.println(sb);
    }

    public static void main(String[] args) throws Exception {
        for (int port : BACKEND_PORTS) {
            int p = port;
            new Thread(() -> runBackend(p)).start();
        }
        Thread.sleep(300);
        roundRobin(NUM_REQUESTS);
    }
}`,
    output: `Request 1: routed to 9301, got 'pong-from-9301' in 0.61 ms
Request 2: routed to 9302, got 'pong-from-9302' in 0.48 ms
Request 3: routed to 9303, got 'pong-from-9303' in 0.45 ms
...
Distribution: backend-9301=3 backend-9302=3 backend-9303=3

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import socket
import threading
import time

HOST = "127.0.0.1"
BACKEND_PORTS = [9001, 9002, 9003]
NUM_REQUESTS = 9

def run_backend(port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, port))
    server_socket.listen(1)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if not data:
            conn.close()
            continue
        conn.sendall(f"pong-from-{port}".encode())
        conn.close()

def round_robin(requests):
    counts = {p: 0 for p in BACKEND_PORTS}
    index = 0
    for i in range(requests):
        port = BACKEND_PORTS[index % len(BACKEND_PORTS)]
        index += 1
        start = time.perf_counter()
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, port))
        client_socket.sendall(b"ping")
        response = client_socket.recv(1024).decode()
        client_socket.close()
        latency_ms = (time.perf_counter() - start) * 1000
        counts[port] += 1
        print(f"Request {i + 1}: routed to {port}, got '{response}' in {latency_ms:.2f} ms")
    print("Distribution:", {f"backend-{p}": c for p, c in counts.items()})

if __name__ == "__main__":
    for port in BACKEND_PORTS:
        threading.Thread(target=run_backend, args=(port,), daemon=True).start()
    time.sleep(0.3)
    round_robin(NUM_REQUESTS)`,
    output: `Request 1: routed to 9001, got 'pong-from-9001' in 4.31 ms
Request 2: routed to 9002, got 'pong-from-9002' in 1.62 ms
Request 3: routed to 9003, got 'pong-from-9003' in 1.55 ms
Request 4: routed to 9001, got 'pong-from-9001' in 0.50 ms
Request 5: routed to 9002, got 'pong-from-9002' in 0.56 ms
Request 6: routed to 9003, got 'pong-from-9003' in 0.41 ms
Request 7: routed to 9001, got 'pong-from-9001' in 0.50 ms
Request 8: routed to 9002, got 'pong-from-9002' in 0.44 ms
Request 9: routed to 9003, got 'pong-from-9003' in 0.49 ms
Distribution: {'backend-9001': 3, 'backend-9002': 3, 'backend-9003': 3}`,
  },
  javascript: {
    code: `const net = require("net");

const HOST = "127.0.0.1";
const BACKEND_PORTS = [9101, 9102, 9103];
const NUM_REQUESTS = 9;

function startBackend(port) {
  const server = net.createServer((socket) => {
    socket.on("data", () => {
      socket.write(\`pong-from-\${port}\`);
    });
  });
  server.listen(port, HOST);
  return server;
}

function sendOne(port) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const client = net.createConnection(port, HOST, () => {
      client.write("ping");
    });
    client.on("data", (data) => {
      const latencyMs = Number(process.hrtime.bigint() - start) / 1e6;
      client.end();
      resolve({ response: data.toString(), latencyMs });
    });
  });
}

async function roundRobin(requests) {
  const counts = {};
  BACKEND_PORTS.forEach((p) => (counts[p] = 0));
  for (let i = 0; i < requests; i++) {
    const port = BACKEND_PORTS[i % BACKEND_PORTS.length];
    const { response, latencyMs } = await sendOne(port);
    counts[port] += 1;
    console.log(\`Request \${i + 1}: routed to \${port}, got '\${response}' in \${latencyMs.toFixed(2)} ms\`);
  }
  const named = {};
  Object.keys(counts).forEach((p) => (named[\`backend-\${p}\`] = counts[p]));
  console.log("Distribution:", named);
}

BACKEND_PORTS.forEach(startBackend);
setTimeout(() => {
  roundRobin(NUM_REQUESTS);
}, 300);`,
    output: `Request 1: routed to 9101, got 'pong-from-9101' in 9.16 ms
Request 2: routed to 9102, got 'pong-from-9102' in 3.51 ms
Request 3: routed to 9103, got 'pong-from-9103' in 1.98 ms
Request 4: routed to 9101, got 'pong-from-9101' in 1.54 ms
Request 5: routed to 9102, got 'pong-from-9102' in 1.22 ms
Request 6: routed to 9103, got 'pong-from-9103' in 2.40 ms
Request 7: routed to 9101, got 'pong-from-9101' in 1.06 ms
Request 8: routed to 9102, got 'pong-from-9102' in 0.90 ms
Request 9: routed to 9103, got 'pong-from-9103' in 2.14 ms
Distribution: { 'backend-9101': 3, 'backend-9102': 3, 'backend-9103': 3 }`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <vector>
#include <map>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const std::vector<int> BACKEND_PORTS = {9201, 9202, 9203};
const int NUM_REQUESTS = 9;

void runBackend(int port) {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));
        std::string reply = "pong-from-" + std::to_string(port);
        send(clientFd, reply.c_str(), reply.size(), 0);
        close(clientFd);
    }
}

void roundRobin(int requests) {
    std::map<int, int> counts;
    for (int p : BACKEND_PORTS) counts[p] = 0;
    for (int i = 0; i < requests; i++) {
        int port = BACKEND_PORTS[i % BACKEND_PORTS.size()];
        auto start = std::chrono::steady_clock::now();
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in servAddr{};
        servAddr.sin_family = AF_INET;
        servAddr.sin_port = htons(port);
        inet_pton(AF_INET, HOST, &servAddr.sin_addr);
        connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));
        send(sock, "ping", 4, 0);
        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        double latencyMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        close(sock);
        counts[port]++;
        std::cout << "Request " << (i + 1) << ": routed to " << port << ", got '" << buffer
                   << "' in " << latencyMs << " ms" << std::endl;
    }
    std::cout << "Distribution:";
    for (auto& kv : counts) {
        std::cout << " backend-" << kv.first << "=" << kv.second;
    }
    std::cout << std::endl;
}

int main() {
    for (int p : BACKEND_PORTS) {
        std::thread(runBackend, p).detach();
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    roundRobin(NUM_REQUESTS);
    return 0;
}`,
    output: `Request 1: routed to 9201, got 'pong-from-9201' in 1.5217 ms
Request 2: routed to 9202, got 'pong-from-9202' in 0.644 ms
Request 3: routed to 9203, got 'pong-from-9203' in 0.7914 ms
Request 4: routed to 9201, got 'pong-from-9201' in 0.1113 ms
Request 5: routed to 9202, got 'pong-from-9202' in 0.162 ms
Request 6: routed to 9203, got 'pong-from-9203' in 0.2146 ms
Request 7: routed to 9201, got 'pong-from-9201' in 0.3607 ms
Request 8: routed to 9202, got 'pong-from-9202' in 0.1034 ms
Request 9: routed to 9203, got 'pong-from-9203' in 0.1575 ms
Distribution: backend-9201=3 backend-9202=3 backend-9203=3`,
  },
};

const qaItems = [
  {
    q: 'How does round-robin load balancing work, and when does it fall short?',
    a: 'It cycles through backends in a fixed order, one request per backend, wrapping back to the start. It falls short when requests have very different costs — a backend can end up overloaded even though it "took its fair share" by request count, not by actual work.',
  },
  {
    q: "What's the difference between round-robin and least-connections?",
    a: "Round-robin decides purely by rotation order. Least-connections checks how many requests each backend is currently handling and picks the least-loaded one — it needs live state, round-robin doesn't.",
  },
  {
    q: 'Why does a load balancer need health checks?',
    a: 'Without them, a dead backend keeps receiving its rotation share of traffic forever, and every request routed there simply fails. A health check lets the load balancer detect the failure and stop sending traffic there until it recovers.',
  },
  {
    q: "What's the difference between Layer 4 and Layer 7 load balancing?",
    a: 'Layer 4 routes based on IP and port only, without reading the request contents — fast and protocol-agnostic. Layer 7 reads the actual HTTP request (path, headers) and can route different paths to different backend pools, at the cost of parsing every request.',
  },
];

export default function LoadBalancingPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/hld"
          backLabel="Back to HLD"
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Load Balancing' }]} />
          <h1 id="overview">Load Balancing</h1>
          <p>How a single point in front of many servers decides which one handles each request — and what happens when one of those servers goes down.</p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Picture a busy restaurant with one host at the door and several waiters inside.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-load-balancing/host-at-the-door.svg"
                alt="A restaurant host sending customers to Waiter A and Waiter B in rotation, while skipping Waiter C who is on break"
              />
              <figcaption>The host is the load balancer; each waiter is a backend server</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>Customers never pick their own waiter — they tell the host what they need, and the host decides. That&apos;s the whole idea: clients never talk to backends directly, only to the load balancer in front of them.</p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>A good host doesn&apos;t send someone to a waiter who just called in sick. That&apos;s a health check. And a host who notices one waiter is drowning in orders while another is idle — that&apos;s least-connections instead of blind rotation.</p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why a load balancer exists</h3>
            <p>One server has a ceiling — CPU, memory, open connections. Past that ceiling, more servers only help if something decides which server handles each request. That&apos;s the load balancer: clients only ever talk to it, and it forwards each request to one backend behind it.</p>

            <h3>Round-robin</h3>
            <p>Cycle through the backend list in order, wrapping back to the start. No knowledge of server load required — it distributes requests evenly when backends and request costs are roughly equal.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-load-balancing/round-robin.svg"
                alt="A load balancer receiving requests from a client and forwarding them to three backends in rotating order: request 1 to backend 1, request 2 to backend 2, request 3 to backend 3, then repeating"
              />
              <figcaption>Requests 1, 4, 7... always land on the same backend in the rotation</figcaption>
            </figure>

            <h3>Least connections</h3>
            <p>Track active requests per backend, and route the next request to whichever has the fewest. Handles uneven request costs better than round-robin, at the cost of tracking live state.</p>

            <h3>Health checks</h3>
            <p>The load balancer periodically checks each backend and stops routing to any that fail to respond. Without this, a dead backend keeps receiving its share of traffic — and every one of those requests fails.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-load-balancing/health-check-failover.svg"
                alt="A load balancer routing traffic to two healthy backends while skipping a third backend that failed its health check"
              />
              <figcaption>Traffic is rerouted around the failed backend until it passes a health check again</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Round-robin when">
                <ul>
                  <li>Backends are roughly equal in capacity and requests cost about the same to serve.</li>
                  <li>You want zero extra bookkeeping in the load balancer.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Least-connections when">
                <ul>
                  <li>Request cost varies a lot — some requests tie up a backend far longer than others.</li>
                  <li>You can afford the load balancer tracking live per-backend connection counts.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that a load balancer needs a way to
              detect a dead backend (health checks) or it keeps routing traffic into a black hole, and
              being able to name a concrete case where round-robin produces uneven load despite being
              &quot;fair&quot; by request count.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain round-robin in one sentence,
              and say why a load balancer without health checks is dangerous, covers most entry-level
              questions on this topic.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to talk about a real incident — a
              backend that stayed in rotation while unhealthy, or a hot spot from uneven request cost —
              and what you changed (health check interval, switching algorithms, sticky sessions) to fix it.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>NGINX / HAProxy</strong> — the two most common software load balancers, supporting round-robin, least-connections, and weighted variants.</li>
              <li><strong>AWS Elastic Load Balancer / Google Cloud Load Balancing</strong> — managed Layer 4/7 load balancers that also run health checks and can trigger backend auto-scaling.</li>
              <li><strong>DNS-based load balancing</strong> — returning a different backend IP for the same hostname on different queries, balancing load before a TCP connection even exists.</li>
              <li><strong>Database read replicas</strong> — spreading read queries across replicas while writes go to one primary, the same load-balancing idea applied to storage.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>A real round-robin load balancer: three backend servers run on real sockets, and the load balancer opens a genuine connection to each one in rotation for 9 requests, then prints the resulting distribution. Unlike a simulation, the 3/3/3 split below is a measured outcome of the routing logic, not a hardcoded result — and the exact millisecond values will vary run to run.</p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the code follows the identical socket logic as Python/C++, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'HLD Fundamentals', href: '/pages/hld/fundamentals' }}
            next={{ label: 'Caching', href: '/pages/hld/caching' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'HLD',
          links: [
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Capstones', href: '/pages/hld/capstones' },
          ],
        }}
      />
    </>
  );
}
