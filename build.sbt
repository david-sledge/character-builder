ThisBuild / scalaVersion := "2.13.2"
ThisBuild / organization := "io.github.david-sledge"

lazy val charBuild = (project in file("."))
  .settings(
    name := "CharacterBuilder",
    libraryDependencies++= Seq(
      "io.github.david-sledge" % "scalaioc_2.13" % "1.0.0-alpha.3",
      "javax.servlet" % "javax.servlet-api" % "3.0.1" % "provided",
      "org.scalatest" %% "scalatest" % "3.1.1" % Test,
    )
  ).enablePlugins(TomcatPlugin)
