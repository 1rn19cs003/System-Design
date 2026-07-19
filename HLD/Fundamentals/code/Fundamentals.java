// HLD Fundamentals — a real TCP client-server pair measuring latency and throughput.
// Compile: javac Fundamentals.java
// Run:     java Fundamentals
//
// This is not a simulation: an actual socket server and client talk over 127.0.0.1,
// and every latency number printed is a real measured round-trip time.

import java.io.*;
import java.net.*;
import java.util.*;

public class Fundamentals {
    static final String HOST = "127.0.0.1";
    static final int PORT = 8904;
    static final int NUM_REQUESTS = 5;

    static void runServer() {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            Socket clientSocket = serverSocket.accept();
            InputStream in = clientSocket.getInputStream();
            OutputStream out = clientSocket.getOutputStream();

            byte[] buffer = new byte[1024];
            for (int i = 0; i < NUM_REQUESTS; i++) {
                int read = in.read(buffer);
                if (read <= 0) break;
                out.write("pong".getBytes());
                out.flush();
            }
            clientSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runClient() throws IOException, InterruptedException {
        Thread.sleep(300); // let the server start listening first

        Socket socket = new Socket(HOST, PORT);
        InputStream in = socket.getInputStream();
        OutputStream out = socket.getOutputStream();

        List<Double> latencies = new ArrayList<>();
        long overallStart = System.nanoTime();

        for (int i = 0; i < NUM_REQUESTS; i++) {
            long requestStart = System.nanoTime();
            out.write("ping".getBytes());
            out.flush();

            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            long requestEnd = System.nanoTime();

            double latencyMs = (requestEnd - requestStart) / 1_000_000.0;
            latencies.add(latencyMs);
            String response = new String(buffer, 0, read);
            System.out.printf("Request %d: received '%s' in %.2f ms%n", i + 1, response, latencyMs);
        }

        long overallEnd = System.nanoTime();
        socket.close();

        double totalSeconds = (overallEnd - overallStart) / 1_000_000_000.0;
        double avgLatency = latencies.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double throughput = NUM_REQUESTS / totalSeconds;

        System.out.printf("Average latency: %.2f ms%n", avgLatency);
        System.out.printf("Throughput: %.2f requests/sec%n", throughput);
    }

    public static void main(String[] args) throws Exception {
        Thread serverThread = new Thread(Fundamentals::runServer);
        serverThread.start();
        runClient();
        serverThread.join();
    }
}
