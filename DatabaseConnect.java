import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnect {
    private static final String URL = "jdbc:mysql://localhost:3306/mydatabase";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "mypassword";

    public static void main(String[] args) {
        Connection conn = null;

        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            System.out.println("Connected to the database.");
        } catch (ClassNotFoundException e) {
            System.out.println("Could not load JDBC driver.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Could not connect to the database.");
            e.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                    System.out.println("Connection closed.");
                }
            } catch (SQLException e) {
                System.out.println("Could not close the connection.");
                e.printStackTrace();
            }
        }
    }
}