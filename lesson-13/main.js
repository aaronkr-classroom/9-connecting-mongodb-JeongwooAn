// main.js
"use strict";

const port = 3000,
  express = require("express"),
  layouts = require("express-ejs-layouts"),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  app = express(),
  MongoDB = require("mongodb").MongoClient, // @TODO: 몽고DB 모듈의 요청
  dbURL = "mongodb://localhost:27017/",
  dbName = "recipe_db";

// @TODO: 로컬 MongoDB 데이터베이스 서버 연결 설정
MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  let db = client.db(dbName); // 몽고 DB 서버로의 recipe_db 데이터베이스 연결 취득
  db.collection("contacts")
    .find()
    .toArray((error, data) => {
      // contacts 컬렉션의 모든 레코드 찾기
      if (error) throw error;
      console.log(data); // 콘솔에 결과 출력
    });

  db.collection("contacts").insertOne(
    {
      name: "Eunmi",
      relationship: "Mother",
      location: "Cheonan",
    },
    (error, result) => {
      // 데이터베이스에 새 정보 삽입
      if (error) throw error;
      console.log(result); // 삽입 결과 출력
    }
  );
});

app.set("port", process.env.PORT || port);
app.set("view engine", "ejs");

app.use(layouts);
app.use(express.static("public"));

app.get("/", homeController.getHomePage);
app.get("/name/:myName", homeController.respondWithName2);

/**
 * Listing 11.4 (p. 169)
 * 사용자 정의 메시지를 통한 에러와 없는 라우트 처리
 */
app.use(errorController.logErrors);
app.use(errorController.resNotFound); // main.js에 에러 처리 미들웨어 추가
app.use(errorController.resInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
