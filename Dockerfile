FROM swathi927/emsreppo:1.0.1 AS build
WORKDIR /app

COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

RUN mvn -f backend/pom.xml clean package -DskipTests

FROM swathi927/emsreppo:1.0.1
WORKDIR /app

COPY --from=build /app/backend/target/app.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]