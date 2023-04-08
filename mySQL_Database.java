import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class mySQL_Database {

  private static final String URL =
    "jdbc:mysql://localhost:3306/hotel_deliverable";
  private static final String USERNAME = "root";
  private static final String PASSWORD = "Mikasa044";

  public static Connection getConnection() throws SQLException {
    Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
    return conn;
}
}
