import express from "express";
import path from "path";
import fs from "fs";

const app = express();

app.use("/assets", express.static(path.resolve("./assets/data/")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./assets/index.html"));
});

app.get("/bundle.js", (req, res) => {
    res.sendFile(path.resolve("./dist/bundle.js"))
})

app.get("/list/:p", (req, res) => {
    const { p } = req.params;
   // list files in p
   res.json(fs.readdirSync(path.resolve(`./assets/data/${p}`)).map((f) => {
        return {
            name: f.split(".")[0],
            file: f
        }
   }))
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
