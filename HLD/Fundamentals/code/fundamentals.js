const net = require("net");

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
      console.log(`Request ${requestIndex}: received '${data.toString()}' in ${latencyMs.toFixed(2)} ms`);
      if (requestIndex < NUM_REQUESTS) {
        sendNext();
      } else {
        const overallEnd = process.hrtime.bigint();
        const totalSeconds = Number(overallEnd - overallStart) / 1e9;
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const throughput = NUM_REQUESTS / totalSeconds;
        console.log(`Average latency: ${avgLatency.toFixed(2)} ms`);
        console.log(`Throughput: ${throughput.toFixed(2)} requests/sec`);
        client.end();
        server.close();
      }
    });
    sendNext();
  });
});
