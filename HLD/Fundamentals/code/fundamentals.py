"""
HLD Fundamentals — a real TCP client-server pair measuring latency and throughput.
Run: python fundamentals.py

This is not a simulation: an actual socket server and client talk over 127.0.0.1,
and every latency number printed is a real measured round-trip time.
"""

import socket
import threading
import time

HOST = "127.0.0.1"
PORT = 8901
NUM_REQUESTS = 5


def run_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(1)

    conn, _ = server_socket.accept()
    for _ in range(NUM_REQUESTS):
        data = conn.recv(1024)
        if not data:
            break
        conn.sendall(b"pong")
    conn.close()
    server_socket.close()


def run_client():
    time.sleep(0.3)  # let the server start listening first
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((HOST, PORT))

    latencies = []
    overall_start = time.perf_counter()

    for i in range(NUM_REQUESTS):
        request_start = time.perf_counter()
        client_socket.sendall(b"ping")
        response = client_socket.recv(1024)
        request_end = time.perf_counter()

        latency_ms = (request_end - request_start) * 1000
        latencies.append(latency_ms)
        print(f"Request {i + 1}: received '{response.decode()}' in {latency_ms:.2f} ms")

    overall_end = time.perf_counter()
    client_socket.close()

    total_seconds = overall_end - overall_start
    avg_latency = sum(latencies) / len(latencies)
    throughput = NUM_REQUESTS / total_seconds

    print(f"Average latency: {avg_latency:.2f} ms")
    print(f"Throughput: {throughput:.2f} requests/sec")


if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
    run_client()
    server_thread.join()
