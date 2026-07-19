import java.io.*;
import java.net.*;
import java.util.*;

public class LoadBalancer {
    static final String HOST = "127.0.0.1";
    static final int[] BACKEND_PORTS = {9301, 9302, 9303};
    static final int NUM_REQUESTS = 9;

    static void runBackend(int port) {
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);
                out.write(("pong-from-" + port).getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void roundRobin(int requests) throws IOException {
        Map<Integer, Integer> counts = new LinkedHashMap<>();
        for (int p : BACKEND_PORTS) counts.put(p, 0);
        for (int i = 0; i < requests; i++) {
            int port = BACKEND_PORTS[i % BACKEND_PORTS.length];
            long start = System.nanoTime();
            Socket socket = new Socket(HOST, port);
            OutputStream out = socket.getOutputStream();
            InputStream in = socket.getInputStream();
            out.write("ping".getBytes());
            out.flush();
            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            double latencyMs = (System.nanoTime() - start) / 1_000_000.0;
            socket.close();
            String response = new String(buffer, 0, read);
            counts.put(port, counts.get(port) + 1);
            System.out.printf("Request %d: routed to %d, got '%s' in %.2f ms%n", i + 1, port, response, latencyMs);
        }
        StringBuilder sb = new StringBuilder("Distribution:");
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            sb.append(" backend-").append(e.getKey()).append("=").append(e.getValue());
        }
        System.out.println(sb);
    }

    public static void main(String[] args) throws Exception {
        for (int port : BACKEND_PORTS) {
            int p = port;
            new Thread(() -> runBackend(p)).start();
        }
        Thread.sleep(300);
        roundRobin(NUM_REQUESTS);
    }
}
