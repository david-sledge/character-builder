import org.scalatest._
import java.io.InputStream

class HelloSpec extends FunSuite with DiagrammedAssertions {
  test("Hello should start with H") {
    assert("Hello".startsWith("H"))

    
  }
}
