const net = require("net");

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
      const reply = `order-confirmed(${paymentData.toString()})|${paymentMs.toFixed(2)}`;
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
    console.log(`Request ${i + 1}: ${reply}, total=${totalMs.toFixed(2)} ms (payment hop=${paymentMs} ms)`);
  }
}

setTimeout(() => {
  runClient(NUM_REQUESTS);
}, 300);
