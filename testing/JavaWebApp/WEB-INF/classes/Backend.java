import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Backend extends HttpServlet {

  protected void doPost(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    String message = request.getParameter("message");
    String responseMessage = "Received message: " + message;
    response.setContentType("text/plain");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();
    out.write(responseMessage);
  }
}
