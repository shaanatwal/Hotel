import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) throws SQLException {
    Query query = new Query();
    ResultSet resultSet = query.executeQuery("SELECT hotel_name FROM Hotel");

    List<String> hotelNames = new ArrayList<>();
    while (resultSet.next()) {
      String hotelName = resultSet.getString("hotel_name");
      hotelNames.add(hotelName);
    }

    // print out the list of hotel names
    System.out.println(hotelNames);

    query.close();
  }
}
