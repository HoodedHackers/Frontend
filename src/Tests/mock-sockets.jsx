export class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = vi.fn();
    this.onmessage = vi.fn();
    this.onerror = vi.fn();
    this.onclose = vi.fn();
    this.sentMessages = [];
  }

  send(message) {
    this.sentMessages.push(message);
  }

  close() {
    this.onclose();
  }

  // Simula que el socket recibe un mensaje
  receiveMessage(data) {
    this.onmessage({ data: JSON.stringify(data) });
  }

  // Simula que el socket se abre correctamente
  triggerOpen() {
    this.onopen();
  }

  // Simula un error en la conexión del WebSocket
  triggerError(error) {
    this.onerror(error);
  }
}
