import socket
import threading
import time

HOST = "127.0.0.1"
BACKEND_PORTS = [9001, 9002, 9003]
NUM_REQUESTS = 9

def run_backend(port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, port))
    server_socket.listen(1)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if not data:
            conn.close()
            continue
        conn.sendall(f"pong-from-{port}".encode())
        conn.close()

def round_robin(requests):
    counts = {p: 0 for p in BACKEND_PORTS}
    index = 0
    for i in range(requests):
        port = BACKEND_PORTS[index % len(BACKEND_PORTS)]
        index += 1
        start = time.perf_counter()
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, port))
        client_socket.sendall(b"ping")
        response = client_socket.recv(1024).decode()
        client_socket.close()
        latency_ms = (time.perf_counter() - start) * 1000
        counts[port] += 1
        print(f"Request {i + 1}: routed to {port}, got '{response}' in {latency_ms:.2f} ms")
    print("Distribution:", {f"backend-{p}": c for p, c in counts.items()})

if __name__ == "__main__":
    for port in BACKEND_PORTS:
        threading.Thread(target=run_backend, args=(port,), daemon=True).start()
    time.sleep(0.3)
    round_robin(NUM_REQUESTS)
