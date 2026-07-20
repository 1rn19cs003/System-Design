import type { Metadata } from 'next';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata: Metadata = {
  title: 'HLD Fundamentals — System Design Architectures',
  description:
    'Client-server model, DNS resolution, HTTP over TCP, latency vs throughput, and system design trade-offs.',
};

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'plain-english', label: 'In Plain English' },
  { id: 'theory', label: 'Theory & Diagrams' },
  { id: 'trade-offs', label: 'Trade-offs' },
  { id: 'real-world', label: 'Real-World Examples' },
  { id: 'interview-questions', label: 'Interview Questions' },
  { id: 'code', label: 'Code & Output' },
];

const snippets = {
  java: {
    code: `import java.io.*;
import java.net.*;

public class LatencyThroughput {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 8901;
    private static final int NUM_REQUESTS = 5;

    public static void main(String[] args) throws Exception {
        Thread serverThread = new Thread(() -> {
            try (ServerSocket serverSocket = new ServerSocket(PORT)) {
                try (Socket clientSocket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                     PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
                    for (int i = 0; i < NUM_REQUESTS; i++) {
                        in.readLine();
                        out.println("pong");
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        serverThread.start();
        Thread.sleep(300);

        try (Socket socket = new Socket(HOST, PORT);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            double[] latencies = new double[NUM_REQUESTS];
            long overallStart = System.nanoTime();

            for (int i = 0; i < NUM_REQUESTS; i++) {
                long requestStart = System.nanoTime();
                out.println("ping");
                in.readLine();
                long requestEnd = System.nanoTime();
                double latencyMs = (requestEnd - requestStart) / 1_000_000.0;
                latencies[i] = latencyMs;
                System.out.printf("Request %d: received 'pong' in %.2f ms%n", i + 1, latencyMs);
            }

            long overallEnd = System.nanoTime();
            serverThread.join();

            double totalSeconds = (overallEnd - overallStart) / 1_000_000_000.0;
            double sum = 0;
            for (double l : latencies) sum += l;
            double avgLatency = sum / NUM_REQUESTS;
            double throughput = NUM_REQUESTS / totalSeconds;

            System.out.printf("Average latency: %.2f ms%n", avgLatency);
            System.out.printf("Throughput: %.2f requests/sec%n", throughput);
        }
    }
}`,
    output: `Request 1: received 'pong' in 1.42 ms
Request 2: received 'pong' in 0.18 ms
Request 3: received 'pong' in 0.16 ms
Request 4: received 'pong' in 0.15 ms
Request 5: received 'pong' in 0.14 ms
Average latency: 0.41 ms
Throughput: 2380.95 requests/sec`,
  },
  python: {
    code: `import socket
import time
import threading

HOST = "127.0.0.1"
PORT = 8902
NUM_REQUESTS = 5

def run_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(1)
    conn, addr = server_socket.accept()
    for _ in range(NUM_REQUESTS):
        data = conn.recv(1024)
        if not data:
            break
        conn.sendall(b"pong\n")
    conn.close()
    server_socket.close()

def run_client():
    time.sleep(0.3)
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((HOST, PORT))
    latencies = []
    overall_start = time.perf_counter()

    for i in range(NUM_REQUESTS):
        req_start = time.perf_counter()
        client_socket.sendall(b"ping\n")
        response = client_socket.recv(1024)
        req_end = time.perf_counter()
        latency_ms = (req_end - req_start) * 1000.0
        latencies.append(latency_ms)
        print(f"Request {i + 1}: received '{response.decode().strip()}' in {latency_ms:.2f} ms")

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
};

export default function HLDFundamentalsPage() {
  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs items={[{ label: 'HLD', href: '/' }, { label: 'Fundamentals' }]} />

        <h1 id="overview">HLD Fundamentals</h1>
        <p>
          Client-server architecture, DNS resolution, HTTP vs HTTPS, and the core metric pair of
          system design: <strong>latency</strong> versus <strong>throughput</strong>.
        </p>

        <section id="plain-english">
          <h2>In Plain English</h2>
          <p>
            Every web application at its core is a conversation between a client (browser, phone app)
            and a server over a network. <strong>Latency</strong> is how long one request takes to come
            back (delay). <strong>Throughput</strong> is how many requests the system can complete per
            second (volume).
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/hld-fundamentals/restaurant-analogy.svg"
              alt="Ordering pizza by phone analogy mapped to Client/DNS/Server"
            />
            <figcaption>Every web request is this exact story, just over a network</figcaption>
          </figure>
        </section>

        <section id="theory">
          <h2>Theory &amp; Diagrams</h2>

          <h3>How your browser resolves a domain name into an IP address (DNS)</h3>
          <p>
            A client knows a name (<code>api.example.com</code>), not an IP. DNS translates the name
            into an address before any connection opens.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/hld-fundamentals/dns-resolution.svg"
              alt="DNS Resolution Flowchart"
            />
            <figcaption>How your browser resolves a domain name into an IP address</figcaption>
          </figure>

          <h3>HTTP over TCP</h3>
          <p>
            HTTP defines the request/response shape, while TCP guarantees bytes arrive in order.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/hld-fundamentals/request-response.svg"
              alt="TCP & HTTP Request Response Sequence Diagram"
            />
            <figcaption>Every step here adds to one request&apos;s total latency</figcaption>
          </figure>

          <h3>Latency vs. Throughput</h3>
          <figure>
            <img
              className="diagram-img"
              src="/assets/hld-fundamentals/latency-vs-throughput.svg"
              alt="Latency vs Throughput Chart"
            />
            <figcaption>Same client, two different things to optimize for</figcaption>
          </figure>
        </section>

        <section id="trade-offs">
          <h2>Trade-offs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="callout" style={{ background: '#eef8f0', borderColor: '#bfe3c6' }}>
              <div style={{ fontWeight: 600, color: '#2f8f4e', marginBottom: '6px' }}>✓ Optimize for Latency when</div>
              <ul>
                <li>User experience is interactive (autocomplete, search, real-time gaming).</li>
                <li>Each millisecond directly impacts conversion rates.</li>
              </ul>
            </div>
            <div className="callout" style={{ background: '#fdedec', borderColor: '#f3bcb8' }}>
              <div style={{ fontWeight: 600, color: '#c0392b', marginBottom: '6px' }}>✕ Optimize for Throughput when</div>
              <ul>
                <li>Batch data processing, analytics ingestion, or video encoding.</li>
                <li>Maximizing hardware utilization outweighs per-item latency.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="interview-questions">
          <h2>Interview Questions</h2>
          <details className="qa" style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '12px', padding: '12px 16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              What happens when you type google.com in your browser?
            </summary>
            <p style={{ marginTop: '8px' }}>
              Browser checks local DNS cache &rarr; OS cache &rarr; Recursive Resolver &rarr; Root DNS &rarr; TLD Server (.com) &rarr; Authoritative DNS Server &rarr; IP returned &rarr; TCP Handshake (SYN, SYN-ACK, ACK) &rarr; TLS Handshake &rarr; HTTP GET Request &rarr; Server responds with HTML.
            </p>
          </details>
        </section>

        <section id="code">
          <h2>Code &amp; Output</h2>
          <p>
            Demonstrating TCP client-server ping-pong to measure round-trip latency and throughput in code.
          </p>
          <CodeTerminal snippets={snippets} defaultLang="java" />
        </section>
      </main>
    </div>
  );
}
