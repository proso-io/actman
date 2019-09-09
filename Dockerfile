FROM openjdk:8-alpine

COPY target/uberjar/actman.jar /actman/app.jar

EXPOSE 3000

CMD ["java", "-jar", "/actman/app.jar"]
