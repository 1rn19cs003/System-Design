const NUM_RECORDS = 200000;
const NUM_LOOKUPS = 500;

function buildTable(n) {
  const table = new Array(n);
  for (let i = 0; i < n; i++) {
    table[i] = { id: i, name: `user-${i}` };
  }
  return table;
}

function buildIndex(table) {
  const index = new Map();
  for (const row of table) {
    index.set(row.id, row);
  }
  return index;
}

function linearScanLookup(table, targetId) {
  for (const row of table) {
    if (row.id === targetId) return row;
  }
  return null;
}

function indexedLookup(index, targetId) {
  return index.get(targetId) || null;
}

const table = buildTable(NUM_RECORDS);
const index = buildIndex(table);
const lookupIds = Array.from({ length: NUM_LOOKUPS }, () => Math.floor(Math.random() * NUM_RECORDS));

let start = process.hrtime.bigint();
for (const target of lookupIds) {
  linearScanLookup(table, target);
}
const linearTimeMs = Number(process.hrtime.bigint() - start) / 1e6;

start = process.hrtime.bigint();
for (const target of lookupIds) {
  indexedLookup(index, target);
}
const indexedTimeMs = Number(process.hrtime.bigint() - start) / 1e6;

console.log(`${NUM_RECORDS} records, ${NUM_LOOKUPS} lookups`);
console.log(`Linear scan (no index): ${linearTimeMs.toFixed(2)} ms`);
console.log(`Indexed lookup (hash index): ${indexedTimeMs.toFixed(2)} ms`);
console.log(`Speedup from indexing: ${(linearTimeMs / indexedTimeMs).toFixed(1)}x`);
