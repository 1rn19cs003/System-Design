import java.util.*;

public class Indexing {
    static final int NUM_RECORDS = 200_000;
    static final int NUM_LOOKUPS = 500;

    static class Row {
        int id;
        String name;
        Row(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    static List<Row> buildTable(int n) {
        List<Row> table = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            table.add(new Row(i, "user-" + i));
        }
        return table;
    }

    static Map<Integer, Row> buildIndex(List<Row> table) {
        Map<Integer, Row> index = new HashMap<>();
        for (Row row : table) {
            index.put(row.id, row);
        }
        return index;
    }

    static Row linearScanLookup(List<Row> table, int targetId) {
        for (Row row : table) {
            if (row.id == targetId) return row;
        }
        return null;
    }

    static Row indexedLookup(Map<Integer, Row> index, int targetId) {
        return index.get(targetId);
    }

    public static void main(String[] args) {
        List<Row> table = buildTable(NUM_RECORDS);
        Map<Integer, Row> index = buildIndex(table);

        Random rng = new Random(42);
        int[] lookupIds = new int[NUM_LOOKUPS];
        for (int i = 0; i < NUM_LOOKUPS; i++) {
            lookupIds[i] = rng.nextInt(NUM_RECORDS);
        }

        long start = System.nanoTime();
        for (int target : lookupIds) linearScanLookup(table, target);
        double linearMs = (System.nanoTime() - start) / 1_000_000.0;

        start = System.nanoTime();
        for (int target : lookupIds) indexedLookup(index, target);
        double indexedMs = (System.nanoTime() - start) / 1_000_000.0;

        System.out.println(NUM_RECORDS + " records, " + NUM_LOOKUPS + " lookups");
        System.out.printf("Linear scan (no index): %.2f ms%n", linearMs);
        System.out.printf("Indexed lookup (hash index): %.2f ms%n", indexedMs);
        System.out.printf("Speedup from indexing: %.1fx%n", linearMs / indexedMs);
    }
}
