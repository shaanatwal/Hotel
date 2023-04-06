import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Query {

  private Connection connection;

  public Query() throws SQLException {
    this.connection = mySQL_Database.getConnection();
  }

  public void close() throws SQLException {
    this.connection.close();
  }

  public ResultSet executeQuery(String query) throws SQLException {
    PreparedStatement statement = connection.prepareStatement(query);
    ResultSet resultSet = statement.executeQuery();
    return resultSet;
  }

  public void executeUpdate(String query) throws SQLException {
    PreparedStatement statement = connection.prepareStatement(query);
    statement.executeUpdate();
  }
}
