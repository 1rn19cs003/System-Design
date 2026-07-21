import java.util.*;
import java.util.concurrent.*;

public class MessageQueue {
    static final int NUM_MESSAGES = 20;
    static final int PROCESSING_MS = 50;

    static double processWithWorkers(int numWorkers, Map<String, Integer> processedBy) throws InterruptedException {
        ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
        for (int i = 0; i < NUM_MESSAGES; i++) {
            queue.add("message-" + i);
        }
        Map<String, Integer> results = new ConcurrentHashMap<>();

        long start = System.nanoTime();
        Thread[] threads = new Thread[numWorkers];
        for (int w = 0; w < numWorkers; w++) {
            final int workerId = w;
            threads[w] = new Thread(() -> {
                String message;
                while ((message = queue.poll()) != null) {
                    try {
                        Thread.sleep(PROCESSING_MS);
                    } catch (InterruptedException ignored) {
                    }
                    results.put(message, workerId);
                }
            });
            threads[w].start();
        }
        for (Thread t : threads) t.join();
        processedBy.putAll(results);
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    public static void main(String[] args) throws InterruptedException {
        Map<String, Integer> processedBy1 = new HashMap<>();
        double elapsed1 = processWithWorkers(1, processedBy1);
        System.out.printf("1 consumer:  %d messages in %.1f ms%n", NUM_MESSAGES, elapsed1);

        Map<String, Integer> processedBy3 = new HashMap<>();
        double elapsed3 = processWithWorkers(3, processedBy3);
        Map<Integer, Integer> counts = new TreeMap<>();
        for (int workerId : processedBy3.values()) {
            counts.merge(workerId, 1, Integer::sum);
        }
        System.out.printf("3 consumers: %d messages in %.1f ms%n", NUM_MESSAGES, elapsed3);
        System.out.println("Messages per worker: " + counts);
        System.out.printf("Speedup from 3 concurrent consumers: %.2fx%n", elapsed1 / elapsed3);
    }
}
