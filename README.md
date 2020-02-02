# Flashcards demo site

## About
This is a demo site used to demonstrate experience with the Spring Boot and React frameworks.

The demo site is a simple website for making and reviewing flashcards. 

The demo site has the following features:
* Single Page Application
* Spring boot back end
* REST API for application data
* React frontend. Uses only React Hooks
* Redux for state management
* Material-UI for front-end UI components
* Front end bundling via Webpack
* Authentication using JSON Web Tokens, local storage, and a Web Filter.
* H2 in-memory database to store flashcard data (restart erases everything)
* MyBatis for Java to Database mapping
* Gradle is used for the build

Since this is a demo site, many production level features are not included.

## Running the application
If you decide to run the application remember that the database is in memory and no data will be saved once you stop running the jar.

Java is *required*. Node and Gradle will be downloaded by the gradle wrapper. To run the app, clone this project and run the following commands:
```bash
projectRoot> ./gradlew bootJar
projectRoot> java -jar ./backend/build/libs/backend.jar
```
The site will be available at http://localhost:8080

Tested on:
* Windows 10, Java 8
* Debian 9, Java 8
* All modern browsers (IE not supported)

Note the build may take up to 3 minutes as it has to download gradle, and download a local copy of node.
