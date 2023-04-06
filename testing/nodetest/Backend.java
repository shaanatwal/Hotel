import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Backend {

  private Socket socket;
  private PrintWriter out;
  private BufferedReader in;
  private BufferedReader reader;

  public Backend() {
    try {
      // Connect to Node.js server
      socket = new Socket("localhost", 3000);
      System.out.println("Connected to Node.js server");

      // Create input and output streams
      out = new PrintWriter(socket.getOutputStream(), true);
      in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
      reader = new BufferedReader(new InputStreamReader(System.in));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void start() {
    try {
      while (true) {
        // Prompt user for input
        System.out.print("Enter message (type 'exit' to quit): ");
        String message = reader.readLine();

        if (message.equalsIgnoreCase("exit")) {
          break;
        }

        // Send message to Node.js server
        System.out.println("Sending to Node.js: " + message);
        out.println(message);

        // Read response from Node.js server
        // Read response from Node.js server
        BufferedReader in = new BufferedReader(
          new InputStreamReader(socket.getInputStream())
        );
        String response;
        while ((response = in.readLine()) != null) {
          System.out.println("Received from Node.js: " + response);
        }
        System.out.println("?");
      }

      // Close connections
      out.close();
      in.close();
      socket.close();
      System.out.println("Connection closed");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) {
    Backend backend = new Backend();
    backend.start();
  }
}
