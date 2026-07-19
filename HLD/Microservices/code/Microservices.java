import java.io.*;
import java.net.*;

public class Microservices {
    static final String HOST = "127.0.0.1";
    static final int PAYMENT_PORT = 9701;
    static final int ORDER_PORT = 9702;
    static final int NUM_REQUESTS = 5;

    static void runPaymentService() {
        try (ServerSocket serverSocket = new ServerSocket(PAYMENT_PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);
                out.write("payment-approved".getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runOrderService() {
        try (ServerSocket serverSocket = new ServerSocket(ORDER_PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                InputStream in = clientSocket.getInputStream();
                OutputStream out = clientSocket.getOutputStream();
                byte[] buffer = new byte[1024];
                in.read(buffer);

                long paymentStart = System.nanoTime();
                Socket paymentSocket = new Socket(HOST, PAYMENT_PORT);
                OutputStream paymentOut = paymentSocket.getOutputStream();
                InputStream paymentIn = paymentSocket.getInputStream();
                paymentOut.write("charge-card".getBytes());
                paymentOut.flush();
                byte[] paymentBuffer = new byte[1024];
                int read = paymentIn.read(paymentBuffer);
                paymentSocket.close();
                double paymentMs = (System.nanoTime() - paymentStart) / 1_000_000.0;

                String paymentResponse = new String(paymentBuffer, 0, read);
                String reply = "order-confirmed(" + paymentResponse + ")|" + String.format("%.2f", paymentMs);
                out.write(reply.getBytes());
                out.flush();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void runClient(int requests) throws IOException {
        for (int i = 0; i < requests; i++) {
            long start = System.nanoTime();
            Socket socket = new Socket(HOST, ORDER_PORT);
            OutputStream out = socket.getOutputStream();
            InputStream in = socket.getInputStream();
            out.write("place-order".getBytes());
            out.flush();
            byte[] buffer = new byte[1024];
            int read = in.read(buffer);
            socket.close();
            double totalMs = (System.nanoTime() - start) / 1_000_000.0;
            String response = new String(buffer, 0, read);
            System.out.printf("Request %d: %s, total=%.2f ms%n", i + 1, response, totalMs);
        }
    }

    public static void main(String[] args) throws Exception {
        new Thread(Microservices::runPaymentService).start();
        new Thread(Microservices::runOrderService).start();
        Thread.sleep(300);
        runClient(NUM_REQUESTS);
    }
}
