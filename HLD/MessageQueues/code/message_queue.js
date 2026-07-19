const NUM_MESSAGES = 20;
const PROCESSING_MS = 50;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processWithWorkers(numWorkers) {
  const queue = [];
  for (let i = 0; i < NUM_MESSAGES; i++) queue.push(`message-${i}`);

  const processedBy = {};

  async function worker(workerId) {
    while (queue.length > 0) {
      const message = queue.shift();
      if (message === undefined) return;
      await sleep(PROCESSING_MS);
      processedBy[message] = workerId;
    }
  }

  const start = process.hrtime.bigint();
  const workers = [];
  for (let w = 0; w < numWorkers; w++) workers.push(worker(w));
  await Promise.all(workers);
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { elapsedMs, processedBy };
}

(async () => {
  const { elapsedMs: elapsed1 } = await processWithWorkers(1);
  console.log(`1 consumer:  ${NUM_MESSAGES} messages in ${elapsed1.toFixed(1)} ms`);

  const { elapsedMs: elapsed3, processedBy } = await processWithWorkers(3);
  const counts = {};
  for (const workerId of Object.values(processedBy)) {
    counts[workerId] = (counts[workerId] || 0) + 1;
  }
  console.log(`3 consumers: ${NUM_MESSAGES} messages in ${elapsed3.toFixed(1)} ms`);
  console.log("Messages per worker:", counts);
  console.log(`Speedup from 3 concurrent consumers: ${(elapsed1 / elapsed3).toFixed(2)}x`);
})();
