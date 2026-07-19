import queue
import threading
import time

NUM_MESSAGES = 20
PROCESSING_SECONDS = 0.05

def process_with_workers(num_workers):
    q = queue.Queue()
    for i in range(NUM_MESSAGES):
        q.put(f"message-{i}")

    processed_by = {}
    lock = threading.Lock()

    def worker(worker_id):
        while True:
            try:
                message = q.get_nowait()
            except queue.Empty:
                return
            time.sleep(PROCESSING_SECONDS)
            with lock:
                processed_by[message] = worker_id
            q.task_done()

    start = time.perf_counter()
    threads = [threading.Thread(target=worker, args=(w,)) for w in range(num_workers)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    elapsed = time.perf_counter() - start
    return elapsed, processed_by

if __name__ == "__main__":
    elapsed_1, _ = process_with_workers(1)
    print(f"1 consumer:  {NUM_MESSAGES} messages in {elapsed_1 * 1000:.1f} ms")

    elapsed_3, processed_by = process_with_workers(3)
    counts = {}
    for worker_id in processed_by.values():
        counts[worker_id] = counts.get(worker_id, 0) + 1
    print(f"3 consumers: {NUM_MESSAGES} messages in {elapsed_3 * 1000:.1f} ms")
    print(f"Messages per worker: {counts}")
    print(f"Speedup from 3 concurrent consumers: {elapsed_1 / elapsed_3:.2f}x")
