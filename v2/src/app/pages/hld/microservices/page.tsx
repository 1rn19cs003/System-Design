import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Microservices — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.io.*;
import java.net.*;

public class Microservices {
    static final String HOST = "127.0.0.1";
    static final int PAYMENT_PORT = 9701;
    static final int ORDER_PORT = 9702;
    static final int NUM_REQUESTS = 5;

    static void runPaymentService() {
        try (ServerSocket serverSocket = new ServerSocket(PAYMENT_PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);
                out.write("payment-approved".getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runOrderService() {
        try (ServerSocket serverSocket = new ServerSocket(ORDER_PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);

                long paymentStart = System.nanoTime();
                Socket paymentSocket = new Socket(HOST, PAYMENT_PORT);
                OutputStream paymentOut = paymentSocket.getOutputStream();
                InputStream paymentIn = paymentSocket.getInputStream();
                paymentOut.write("charge-card".getBytes());
                paymentOut.flush();
                byte[] paymentBuffer = new byte[1024];
                int read = paymentIn.read(paymentBuffer);
                paymentSocket.close();
                double paymentMs = (System.nanoTime() - paymentStart) / 1_000_000.0;

                String paymentResponse = new String(paymentBuffer, 0, read);
                String reply = "order-confirmed(" + paymentResponse + ")|" + String.format("%.2f", paymentMs);
                out.write(reply.getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runClient(int requests) throws IOException {
        for (int i = 0; i < requests; i++) {
            long start = System.nanoTime();
            Socket socket = new Socket(HOST, ORDER_PORT);
            OutputStream out = socket.getOutputStream();
            InputStream in = socket.getInputStream();
            out.write("place-order".getBytes());
            out.flush();
            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            socket.close();
            double totalMs = (System.nanoTime() - start) / 1_000_000.0;
            String response = new String(buffer, 0, read);
            System.out.printf("Request %d: %s, total=%.2f ms%n", i + 1, response, totalMs);
        }
    }

    public static void main(String[] args) throws Exception {
        new Thread(Microservices::runPaymentService).start();
        new Thread(Microservices::runOrderService).start();
        Thread.sleep(300);
        runClient(NUM_REQUESTS);
    }
}`,
    output: `Request 1: order-confirmed(payment-approved)|2.14, total=4.87 ms
Request 2: order-confirmed(payment-approved)|0.71, total=1.35 ms
Request 3: order-confirmed(payment-approved)|0.68, total=1.29 ms
Request 4: order-confirmed(payment-approved)|0.65, total=1.22 ms
Request 5: order-confirmed(payment-approved)|0.60, total=1.10 ms

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import socket
import threading
import time

HOST = "127.0.0.1"
PAYMENT_PORT = 9401
ORDER_PORT = 9402
NUM_REQUESTS = 5

def run_payment_service():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PAYMENT_PORT))
    server_socket.listen(5)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if data:
            conn.sendall(b"payment-approved")
        conn.close()

def run_order_service():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, ORDER_PORT))
    server_socket.listen(5)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if data:
            payment_start = time.perf_counter()
            payment_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            payment_socket.connect((HOST, PAYMENT_PORT))
            payment_socket.sendall(b"charge-card")
            payment_response = payment_socket.recv(1024).decode()
            payment_socket.close()
            payment_ms = (time.perf_counter() - payment_start) * 1000
            reply = f"order-confirmed({payment_response})|{payment_ms:.2f}"
            conn.sendall(reply.encode())
        conn.close()

def run_client(requests):
    for i in range(requests):
        start = time.perf_counter()
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, ORDER_PORT))
        client_socket.sendall(b"place-order")
        response = client_socket.recv(1024).decode()
        client_socket.close()
        total_ms = (time.perf_counter() - start) * 1000
        reply, payment_ms = response.split("|")
        print(f"Request {i + 1}: {reply}, total={total_ms:.2f} ms (payment hop={payment_ms} ms)")

if __name__ == "__main__":
    threading.Thread(target=run_payment_service, daemon=True).start()
    threading.Thread(target=run_order_service, daemon=True).start()
    time.sleep(0.3)
    run_client(NUM_REQUESTS)`,
    output: `Request 1: order-confirmed(payment-approved), total=17.83 ms (payment hop=2.78 ms)
Request 2: order-confirmed(payment-approved), total=1.67 ms (payment hop=0.65 ms)
Request 3: order-confirmed(payment-approved), total=1.49 ms (payment hop=0.49 ms)
Request 4: order-confirmed(payment-approved), total=1.28 ms (payment hop=0.49 ms)
Request 5: order-confirmed(payment-approved), total=1.04 ms (payment hop=0.53 ms)`,
  },
  javascript: {
    code: `const net = require("net");

const HOST = "127.0.0.1";
const PAYMENT_PORT = 9501;
const ORDER_PORT = 9502;
const NUM_REQUESTS = 5;

net.createServer((socket) => {
  socket.on("data", () => {
    socket.write("payment-approved");
  });
}).listen(PAYMENT_PORT, HOST);

net.createServer((socket) => {
  socket.on("data", () => {
    const paymentStart = process.hrtime.bigint();
    const paymentSocket = net.createConnection(PAYMENT_PORT, HOST, () => {
      paymentSocket.write("charge-card");
    });
    paymentSocket.on("data", (paymentData) => {
      const paymentMs = Number(process.hrtime.bigint() - paymentStart) / 1e6;
      paymentSocket.end();
      const reply = \`order-confirmed(\${paymentData.toString()})|\${paymentMs.toFixed(2)}\`;
      socket.write(reply);
      socket.end();
    });
  });
}).listen(ORDER_PORT, HOST);

function sendOrder() {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const client = net.createConnection(ORDER_PORT, HOST, () => {
      client.write("place-order");
    });
    client.on("data", (data) => {
      const totalMs = Number(process.hrtime.bigint() - start) / 1e6;
      client.end();
      resolve({ response: data.toString(), totalMs });
    });
  });
}

async function runClient(requests) {
  for (let i = 0; i < requests; i++) {
    const { response, totalMs } = await sendOrder();
    const [reply, paymentMs] = response.split("|");
    console.log(\`Request \${i + 1}: \${reply}, total=\${totalMs.toFixed(2)} ms (payment hop=\${paymentMs} ms)\`);
  }
}

setTimeout(() => {
  runClient(NUM_REQUESTS);
}, 300);`,
    output: `Request 1: order-confirmed(payment-approved), total=18.55 ms (payment hop=3.65 ms)
Request 2: order-confirmed(payment-approved), total=9.18 ms (payment hop=3.26 ms)
Request 3: order-confirmed(payment-approved), total=4.00 ms (payment hop=1.10 ms)
Request 4: order-confirmed(payment-approved), total=4.16 ms (payment hop=0.98 ms)
Request 5: order-confirmed(payment-approved), total=5.18 ms (payment hop=2.58 ms)`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <cstring>
#include <sstream>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const int PAYMENT_PORT = 9601;
const int ORDER_PORT = 9602;
const int NUM_REQUESTS = 5;

void runPaymentService() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PAYMENT_PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));
        send(clientFd, "payment-approved", 17, 0);
        close(clientFd);
    }
}

void runOrderService() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(ORDER_PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));

        auto paymentStart = std::chrono::steady_clock::now();
        int paymentSock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in paymentAddr{};
        paymentAddr.sin_family = AF_INET;
        paymentAddr.sin_port = htons(PAYMENT_PORT);
        inet_pton(AF_INET, HOST, &paymentAddr.sin_addr);
        connect(paymentSock, (sockaddr*)&paymentAddr, sizeof(paymentAddr));
        send(paymentSock, "charge-card", 11, 0);
        char paymentBuffer[1024] = {0};
        read(paymentSock, paymentBuffer, sizeof(paymentBuffer));
        close(paymentSock);
        double paymentMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - paymentStart).count();

        std::ostringstream reply;
        reply << "order-confirmed(" << paymentBuffer << ")|" << paymentMs;
        std::string replyStr = reply.str();
        send(clientFd, replyStr.c_str(), replyStr.size(), 0);
        close(clientFd);
    }
}

void runClient(int requests) {
    for (int i = 0; i < requests; i++) {
        auto start = std::chrono::steady_clock::now();
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in servAddr{};
        servAddr.sin_family = AF_INET;
        servAddr.sin_port = htons(ORDER_PORT);
        inet_pton(AF_INET, HOST, &servAddr.sin_addr);
        connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));
        send(sock, "place-order", 11, 0);
        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        close(sock);
        double totalMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::string response(buffer);
        size_t sep = response.find('|');
        std::string reply = response.substr(0, sep);
        std::string paymentMs = sep == std::string::npos ? "?" : response.substr(sep + 1);
        std::cout << "Request " << (i + 1) << ": " << reply << ", total=" << totalMs
                   << " ms (payment hop=" << paymentMs << " ms)" << std::endl;
    }
}

int main() {
    std::thread(runPaymentService).detach();
    std::thread(runOrderService).detach();
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    runClient(NUM_REQUESTS);
    return 0;
}`,
    output: `Request 1: order-confirmed(payment-approved), total=4.7968 ms (payment hop=1.9905 ms)
Request 2: order-confirmed(payment-approved), total=1.1771 ms (payment hop=0.7304 ms)
Request 3: order-confirmed(payment-approved), total=1.2333 ms (payment hop=0.7013 ms)
Request 4: order-confirmed(payment-approved), total=1.4425 ms (payment hop=0.6599 ms)
Request 5: order-confirmed(payment-approved), total=0.8619 ms (payment hop=0.4158 ms)`,
  },
};

const qaItems = [
  {
    q: "What's the core difference between a monolith and microservices?",
    a: 'A monolith is one deployable unit where modules call each other in-process. Microservices split those modules into independently deployable services that call each other over the network — real latency and real failure modes an in-process call never has.',
  },
  {
    q: 'Why does cascading latency matter in a microservices chain?',
    a: "If service A calls service B to complete a request, A's total response time includes B's full round trip on top of A's own processing. Chain several services together and a request waits on multiple sequential network hops.",
  },
  {
    q: 'What does an API gateway do?',
    a: "It's a single entry point in front of all the backend microservices, routing each request to the right service and often handling authentication, rate limiting, and logging in one place instead of duplicating them in every service.",
  },
  {
    q: "What's a real cost of splitting a monolith into microservices?",
    a: 'Operational complexity — instead of deploying and monitoring one thing, there are now many services to deploy, version, and keep API-compatible, and debugging a single user request often means tracing it across several services.',
  },
];

export default function HldMicroservicesPage() {
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Microservices' }]} />
          <h1 id="overview">Microservices</h1>
          <p>
            What changes when a monolith&apos;s in-process function calls become real network calls
            between independently deployed services.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Compare a single chef running one kitchen versus a restaurant with specialized stations.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-microservices/kitchen-stations-analogy.svg"
                alt="Left: one chef handling grill, salad, and dessert in their head inside one kitchen. Right: separate Grill, Salad, and Dessert stations passing the plate down the line to each other"
              />
              <figcaption>A monolith is one chef switching tasks; microservices are separate stations passing plates</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  One chef doing everything in their head never has to &quot;hand off&quot; anything
                  — it&apos;s instant. Separate stations are more specialized and can each get faster
                  at their one job, but now the plate has to physically travel between them.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  Every station a plate visits adds real time — that&apos;s cascading latency. And if
                  the dessert station is slammed, the whole plate waits, no matter how fast the grill
                  and salad stations were.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>What a microservice is</h3>
            <p>
              A small, independently deployable service that owns one piece of the business (orders,
              payments, inventory) and talks to other services over the network — usually HTTP or
              gRPC. No shared codebase or database with other services; that separation is the whole
              point.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-microservices/monolith-vs-microservices.svg"
                alt="Left: a monolith with Orders, Payments, and Inventory as modules inside one process, calling each other in-process. Right: the same three modules as independently deployed microservices calling each other over the network."
              />
              <figcaption>Same three responsibilities, very different call cost between them</figcaption>
            </figure>

            <h3>Cascading latency</h3>
            <p>
              When one service&apos;s handler calls another service to finish the work, the
              caller&apos;s total latency includes its own processing plus the callee&apos;s full
              round trip. Chain enough services together and a single request waits on several
              sequential network hops.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-microservices/cascading-latency.svg"
                alt="A client's order request going to the Order Service, which calls the Payment Service and waits for its response before replying to the client"
              />
              <figcaption>The client only sees one request, but pays for two network round trips</figcaption>
            </figure>

            <h3>API gateways</h3>
            <p>
              Rather than have every client know the address of every microservice, an API gateway
              sits in front of all of them as a single entry point, routing each request to the right
              backend and often handling auth, rate limiting, and logging in one place.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Split into services when">
                <ul>
                  <li>Different parts of the system need to scale, deploy, or be owned independently.</li>
                  <li>The team is large enough that one shared codebase is actively slowing everyone down.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Keep the monolith when">
                <ul>
                  <li>The team is small and the operational overhead of many services isn&apos;t worth it yet.</li>
                  <li>Request paths are latency-sensitive and can&apos;t absorb extra network hops.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that microservices aren&apos;t
              free scalability — they trade a monolith&apos;s simplicity for real network latency and
              operational overhead — and being able to explain concretely how a chain of service
              calls accumulates latency hop by hop.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> knowing that a microservice call is a real
              network call (not a free function call), and that this adds real latency and a real
              chance of failure, is the core idea interviewers check for.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to describe a real service
              boundary you worked with — what it owned, what it called, and a time a downstream
              service&apos;s slowness or downtime became your problem too.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Amazon</strong> — split its monolith into hundreds of independently deployable services, each owned by a small team, communicating over well-defined APIs.</li>
              <li><strong>Netflix</strong> — separate services for recommendations, playback, and billing, fronted by an API gateway (Zuul).</li>
              <li><strong>Uber</strong> — decomposed its original monolith into thousands of microservices as it scaled, handling trips, payments, and maps as separate systems.</li>
              <li><strong>API gateways in practice</strong> — Kong, AWS API Gateway, and Netflix&apos;s Zuul all route client requests to the right backend microservice.</li>
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
              An Order Service and a Payment Service, each a real socket server. A client sends
              &quot;place order&quot; to the Order Service, which then makes a genuine network call
              to the Payment Service before replying — the &quot;payment hop&quot; time below is
              measured from inside that real second call, not estimated.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the two-service call chain is functionally identical to the other three languages, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Message Queues', href: '/pages/hld/message-queues' }}
            next={{ label: 'Capstone: Rate Limiter', href: '/pages/hld/capstones' }}
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
