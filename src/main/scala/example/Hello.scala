package example

import scala.annotation.tailrec

object Hello extends App {
  println("Hello")

  def pipeCharacters(streamReader: java.io.InputStreamReader, xmlWriter: javax.xml.stream.XMLStreamWriter, bufSize: Int = 4096) = {
    val charArray = new Array[Char](bufSize)

    @tailrec
    def f(): Unit = {
      val numBytes = streamReader.read(charArray)

      if (numBytes >= 0) {
        xmlWriter.writeCharacters(charArray, 0, numBytes)
        f();
      }
    }

    f();
  }
}
