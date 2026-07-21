import socket
import threading
import time

HOST = "127.0.0.1"
PAYMENT_PORT = 9401
ORDER_PORT = 9402
NUM_REQUESTS = 5

def run_payment_service():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PAYMENT_PORT))
    server_socket.listen(5)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if data:
            conn.sendall(b"payment-approved")
        conn.close()

def run_order_service():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, ORDER_PORT))
    server_socket.listen(5)
    while True:
        conn, _ = server_socket.accept()
        data = conn.recv(1024)
        if data:
            payment_start = time.perf_counter()
            payment_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            payment_socket.connect((HOST, PAYMENT_PORT))
            payment_socket.sendall(b"charge-card")
            payment_response = payment_socket.recv(1024).decode()
            payment_socket.close()
            payment_ms = (time.perf_counter() - payment_start) * 1000
            reply = f"order-confirmed({payment_response})|{payment_ms:.2f}"
            conn.sendall(reply.encode())
        conn.close()

def run_client(requests):
    for i in range(requests):
        start = time.perf_counter()
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, ORDER_PORT))
        client_socket.sendall(b"place-order")
        response = client_socket.recv(1024).decode()
        client_socket.close()
        total_ms = (time.perf_counter() - start) * 1000
        reply, payment_ms = response.split("|")
        print(f"Request {i + 1}: {reply}, total={total_ms:.2f} ms (payment hop={payment_ms} ms)")

if __name__ == "__main__":
    threading.Thread(target=run_payment_service, daemon=True).start()
    threading.Thread(target=run_order_service, daemon=True).start()
    time.sleep(0.3)
    run_client(NUM_REQUESTS)
