import express from "express";
import path from "path";

const app = express();

app.use("/assets", express.static(path.resolve("./assets/data/")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./assets/index.html"));
});

app.get("/bundle.js", (req, res) => {
    res.sendFile(path.resolve("./dist/bundle.js"))
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
