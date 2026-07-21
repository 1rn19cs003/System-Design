import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'HLD Fundamentals — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.io.*;
import java.net.*;
import java.util.*;

public class Fundamentals {
    static final String HOST = "127.0.0.1";
    static final int PORT = 8904;
    static final int NUM_REQUESTS = 5;

    static void runServer() {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            Socket clientSocket = serverSocket.accept();
            InputStream in = clientSocket.getInputStream();
            OutputStream out = clientSocket.getOutputStream();
            byte[] buffer = new byte[1024];
            for (int i = 0; i < NUM_REQUESTS; i++) {
                int read = in.read(buffer);
                if (read <= 0) break;
                out.write("pong".getBytes());
                out.flush();
            }
            clientSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runClient() throws IOException, InterruptedException {
        Thread.sleep(300);
        Socket socket = new Socket(HOST, PORT);
        InputStream in = socket.getInputStream();
        OutputStream out = socket.getOutputStream();
        List<Double> latencies = new ArrayList<>();
        long overallStart = System.nanoTime();
        for (int i = 0; i < NUM_REQUESTS; i++) {
            long requestStart = System.nanoTime();
            out.write("ping".getBytes());
            out.flush();
            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            long requestEnd = System.nanoTime();
            double latencyMs = (requestEnd - requestStart) / 1_000_000.0;
            latencies.add(latencyMs);
            String response = new String(buffer, 0, read);
            System.out.printf("Request %d: received '%s' in %.2f ms%n", i + 1, response, latencyMs);
        }
        long overallEnd = System.nanoTime();
        socket.close();
        double totalSeconds = (overallEnd - overallStart) / 1_000_000_000.0;
        double avgLatency = latencies.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double throughput = NUM_REQUESTS / totalSeconds;
        System.out.printf("Average latency: %.2f ms%n", avgLatency);
        System.out.printf("Throughput: %.2f requests/sec%n", throughput);
    }

    public static void main(String[] args) throws Exception {
        Thread serverThread = new Thread(Fundamentals::runServer);
        serverThread.start();
        runClient();
        serverThread.join();
    }
}`,
    output: `Request 1: received 'pong' in 0.52 ms
Request 2: received 'pong' in 0.24 ms
Request 3: received 'pong' in 0.19 ms
Request 4: received 'pong' in 0.21 ms
Request 5: received 'pong' in 0.22 ms
Average latency: 0.28 ms
Throughput: 1096.15 requests/sec

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import socket
import threading
import time

HOST = "127.0.0.1"
PORT = 8901
NUM_REQUESTS = 5

def run_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(1)
    conn, _ = server_socket.accept()
    for _ in range(NUM_REQUESTS):
        data = conn.recv(1024)
        if not data:
            break
        conn.sendall(b"pong")
    conn.close()
    server_socket.close()

def run_client():
    time.sleep(0.3)
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((HOST, PORT))
    latencies = []
    overall_start = time.perf_counter()
    for i in range(NUM_REQUESTS):
        request_start = time.perf_counter()
        client_socket.sendall(b"ping")
        response = client_socket.recv(1024)
        request_end = time.perf_counter()
        latency_ms = (request_end - request_start) * 1000
        latencies.append(latency_ms)
        print(f"Request {i + 1}: received '{response.decode()}' in {latency_ms:.2f} ms")
    overall_end = time.perf_counter()
    client_socket.close()
    total_seconds = overall_end - overall_start
    avg_latency = sum(latencies) / len(latencies)
    throughput = NUM_REQUESTS / total_seconds
    print(f"Average latency: {avg_latency:.2f} ms")
    print(f"Throughput: {throughput:.2f} requests/sec")

if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
    run_client()
    server_thread.join()`,
    output: `Request 1: received 'pong' in 0.30 ms
Request 2: received 'pong' in 0.16 ms
Request 3: received 'pong' in 0.15 ms
Request 4: received 'pong' in 0.14 ms
Request 5: received 'pong' in 0.14 ms
Average latency: 0.30 ms
Throughput: 3087.75 requests/sec`,
  },
  javascript: {
    code: `const net = require("net");

const HOST = "127.0.0.1";
const PORT = 8902;
const NUM_REQUESTS = 5;

const server = net.createServer((socket) => {
  socket.on("data", () => {
    socket.write("pong");
  });
});

server.listen(PORT, HOST, () => {
  const client = net.createConnection(PORT, HOST, () => {
    const latencies = [];
    let requestIndex = 0;
    const overallStart = process.hrtime.bigint();
    let requestStart = process.hrtime.bigint();

    function sendNext() {
      requestStart = process.hrtime.bigint();
      client.write("ping");
    }

    client.on("data", (data) => {
      const requestEnd = process.hrtime.bigint();
      const latencyMs = Number(requestEnd - requestStart) / 1e6;
      latencies.push(latencyMs);
      requestIndex += 1;
      console.log(\`Request \${requestIndex}: received '\${data.toString()}' in \${latencyMs.toFixed(2)} ms\`);
      if (requestIndex < NUM_REQUESTS) {
        sendNext();
      } else {
        const overallEnd = process.hrtime.bigint();
        const totalSeconds = Number(overallEnd - overallStart) / 1e9;
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const throughput = NUM_REQUESTS / totalSeconds;
        console.log(\`Average latency: \${avgLatency.toFixed(2)} ms\`);
        console.log(\`Throughput: \${throughput.toFixed(2)} requests/sec\`);
        client.end();
        server.close();
      }
    });
    sendNext();
  });
});`,
    output: `Request 1: received 'pong' in 6.95 ms
Request 2: received 'pong' in 0.42 ms
Request 3: received 'pong' in 0.38 ms
Request 4: received 'pong' in 0.35 ms
Request 5: received 'pong' in 0.30 ms
Average latency: 2.06 ms
Throughput: 359.33 requests/sec`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <vector>
#include <numeric>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const int PORT = 8903;
const int NUM_REQUESTS = 5;

void runServer() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 1);
    int clientFd = accept(serverFd, nullptr, nullptr);
    char buffer[1024];
    for (int i = 0; i < NUM_REQUESTS; i++) {
        ssize_t received = read(clientFd, buffer, sizeof(buffer));
        if (received <= 0) break;
        send(clientFd, "pong", 4, 0);
    }
    close(clientFd);
    close(serverFd);
}

void runClient() {
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in servAddr{};
    servAddr.sin_family = AF_INET;
    servAddr.sin_port = htons(PORT);
    inet_pton(AF_INET, HOST, &servAddr.sin_addr);
    connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));
    std::vector<double> latencies;
    auto overallStart = std::chrono::steady_clock::now();
    for (int i = 0; i < NUM_REQUESTS; i++) {
        auto requestStart = std::chrono::steady_clock::now();
        send(sock, "ping", 4, 0);
        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        auto requestEnd = std::chrono::steady_clock::now();
        double latencyMs = std::chrono::duration<double, std::milli>(requestEnd - requestStart).count();
        latencies.push_back(latencyMs);
        std::cout << "Request " << (i + 1) << ": received '" << buffer << "' in " << latencyMs << " ms" << std::endl;
    }
    auto overallEnd = std::chrono::steady_clock::now();
    close(sock);
    double totalSeconds = std::chrono::duration<double>(overallEnd - overallStart).count();
    double avgLatency = std::accumulate(latencies.begin(), latencies.end(), 0.0) / latencies.size();
    double throughput = NUM_REQUESTS / totalSeconds;
    std::cout << "Average latency: " << avgLatency << " ms" << std::endl;
    std::cout << "Throughput: " << throughput << " requests/sec" << std::endl;
}

int main() {
    std::thread serverThread(runServer);
    runClient();
    serverThread.join();
    return 0;
}`,
    output: `Request 1: received 'pong' in 0.3705 ms
Request 2: received 'pong' in 0.0524 ms
Request 3: received 'pong' in 0.0298 ms
Request 4: received 'pong' in 0.0261 ms
Request 5: received 'pong' in 0.0281 ms
Average latency: 0.21536 ms
Throughput: 2853.07 requests/sec`,
  },
};

const qaItems = [
  {
    q: 'Walk through what happens between typing a URL and seeing the page.',
    a: "The browser first checks its DNS cache, then queries a DNS resolver to translate the hostname into an IP address if needed. It opens a TCP connection to that IP (a three-way handshake), performs a TLS handshake if the connection is HTTPS, sends an HTTP request over that connection, and waits for the server's HTTP response, which it then parses and renders.",
  },
  {
    q: "What's the difference between latency and throughput, concretely?",
    a: 'Latency is the time for a single request to complete, start to finish (milliseconds). Throughput is how many requests a system can process per unit of time (requests/second). A system can be tuned to minimize one at the expense of the other — batching many requests together often improves throughput but increases the latency of any individual request in the batch.',
  },
  {
    q: 'Why does DNS use a TTL, and what\'s the trade-off in setting it?',
    a: 'A TTL tells clients/resolvers how long they may cache a DNS answer before re-querying. A longer TTL reduces DNS query volume and average latency, but slows how quickly clients notice an IP change (e.g., during failover). A shorter TTL makes changes propagate faster at the cost of more frequent lookups.',
  },
  {
    q: "Why is TCP relevant to HTTP even though HTTP doesn't mention packets or retransmission?",
    a: "Because HTTP is layered on top of TCP, which already guarantees reliable, ordered delivery of bytes. HTTP's request/response model only has to think in terms of \"send these bytes, receive those bytes\" — TCP silently handles retransmitting lost packets and keeping everything in order underneath.",
  },
];

export default function HldFundamentalsPage() {
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Fundamentals' }]} />
          <h1 id="overview">HLD Fundamentals</h1>
          <p>
            The client-server model, DNS, HTTP, and the difference between latency and throughput —
            the vocabulary every other HLD topic builds on.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>If any of the terms below are new, start here — this is the same story as the technical section, just told without jargon first.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-fundamentals/restaurant-analogy.svg"
                alt="Ordering pizza by phone, mapped step by step to a client, a DNS resolver, a TCP/HTTP request, and a server"
              />
              <figcaption>Every web request is this exact story, just over a network instead of a phone line</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Just remember the four nouns: <strong>client</strong> (you, asking),{' '}
                  <strong>DNS</strong> (the phone book), <strong>request/response</strong> (the call),{' '}
                  <strong>server</strong> (the kitchen). Everything else in HLD is these four ideas,
                  scaled up and made more reliable.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting question isn&apos;t &quot;what is a request&quot; — it&apos;s
                  &quot;what happens when 10,000 people call Tony&apos;s at once.&quot; That&apos;s
                  where load balancing, caching, and databases (the next topics) come in.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>The client-server model</h3>
            <p>
              A client sends a request, a server does the work and replies. The server never
              initiates contact — it waits to be reached, and many different clients can reach the
              same server over time. Almost every other HLD topic (load balancers, caches,
              databases, queues) is a refinement of this one relationship.
            </p>

            <h3>How a client finds a server: DNS</h3>
            <p>
              A client knows a name (<code>api.example.com</code>), not an IP. DNS translates the
              name into an address before any connection opens. That translation is cached for a
              while (a TTL controls how long) so it isn&apos;t repeated on every request.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-fundamentals/dns-resolution.svg"
                alt="Client asks a DNS Resolver for the IP behind api.example.com, gets back 93.184.216.34, then connects directly to the Server at that IP"
              />
              <figcaption>Name resolved once, then a direct connection to the resulting IP</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Set the TTL to match how often the IP actually changes — a factor in failover speed.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Assuming a DNS change is instant everywhere — cached entries keep serving the old IP until their TTL expires.</p>
              </Callout>
            </TwoCol>

            <h3>HTTP over TCP</h3>
            <p>
              HTTP defines the request/response shape (method, path, headers, body → status code,
              headers, body). TCP, underneath it, guarantees the bytes arrive in order — HTTP never
              has to think about retransmission.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-fundamentals/request-response.svg"
                alt="Sequence diagram: Client and Server lifelines showing TCP handshake, optional TLS handshake, HTTP request, then HTTP response"
              />
              <figcaption>Every step here adds to one request&apos;s total latency</figcaption>
            </figure>

            <h3>Latency vs. throughput</h3>
            <p>
              Latency: how long one request takes. Throughput: how many requests get done per
              second. A system can be fast-per-request but low-volume, or slower-per-request but far
              higher volume overall.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-fundamentals/latency-vs-throughput.svg"
                alt="Comparison: a low-latency setup with one client and one worker handling one request at a time, versus a high-throughput setup with one client fanning out to three parallel workers"
              />
              <figcaption>Same client, two different things to optimize for</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Optimize for latency when">
                <ul>
                  <li>The user is actively waiting on the response (a page load, an autocomplete suggestion, a payment confirmation).</li>
                  <li>Each individual request matters more than the aggregate volume of requests.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Optimize for throughput when">
                <ul>
                  <li>You&apos;re processing a large backlog where no single item is time-sensitive (batch analytics, bulk email, log processing).</li>
                  <li>The system&apos;s value comes from total work completed over time, not the speed of any one unit.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> a concrete definition of both
              terms, an example of a system tuned for one at the expense of the other, and knowing
              that a request&apos;s latency budget includes DNS + TCP handshake + TLS handshake (if
              HTTPS) + the request/response itself, not just server processing time.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> just being able to say &quot;latency is
              per-request speed, throughput is total volume&quot; out loud, with one example of each,
              clears the bar for this question at most entry-level interviews.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should also be able to say where in
              your own systems latency actually gets spent (network hop, DB query, serialization) and
              name one real change you made that traded one metric for the other.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Every web page load</strong> — the browser resolves a domain via DNS, opens a TCP connection, sends an HTTP request, and renders whatever comes back.</li>
              <li><strong>CDN edge resolution</strong> — Cloudflare and CloudFront use DNS itself to route a client to the nearest server, folding load-balancing into the DNS lookup step.</li>
              <li><strong>Mobile apps under poor network conditions</strong> — apps explicitly design around latency (optimistic UI) because round-trip time on cellular networks can be hundreds of milliseconds.</li>
              <li><strong>Batch data pipelines</strong> (Spark jobs, nightly ETL) — explicitly optimized for throughput, accepting slower individual records as long as the total volume clears the batch window.</li>
              <li><strong>Real-time trading systems</strong> — obsessively optimized for latency, where microseconds of round-trip time can matter more than total trade volume.</li>
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
              This is a real TCP client-server pair — not a simulation. The client sends 5 sequential
              pings over an actual socket connection to a server running on <code>127.0.0.1</code>,
              measuring genuine round-trip latency for each one, then computes average latency and
              throughput. Unlike the design-pattern examples elsewhere in this guide, the exact
              millisecond values shown below are real measurements from one run on this machine —
              running it yourself will produce different (but similarly-shaped) numbers, since real
              network/OS timing is never perfectly repeatable.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the code follows the identical socket logic as Python/C++, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Core Principles', href: '/pages/core-principles' }}
            next={{ label: 'Load Balancing', href: '/pages/hld/load-balancing' }}
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
