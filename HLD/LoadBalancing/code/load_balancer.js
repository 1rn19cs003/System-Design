const net = require("net");

const HOST = "127.0.0.1";
const BACKEND_PORTS = [9101, 9102, 9103];
const NUM_REQUESTS = 9;

function startBackend(port) {
  const server = net.createServer((socket) => {
    socket.on("data", () => {
      socket.write(`pong-from-${port}`);
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
    console.log(`Request ${i + 1}: routed to ${port}, got '${response}' in ${latencyMs.toFixed(2)} ms`);
  }
  const named = {};
  Object.keys(counts).forEach((p) => (named[`backend-${p}`] = counts[p]));
  console.log("Distribution:", named);
}

BACKEND_PORTS.forEach(startBackend);
setTimeout(() => {
  roundRobin(NUM_REQUESTS);
}, 300);
