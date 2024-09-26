const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error(err);
            return res.status(500).send("Unable to read directory");
        }
        console.log(files); // Logs the files in the console
        res.render("index", { files }); // Pass the files array to EJS
    });
});

app.get("/file/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error(err);
            return res.status(404).send("File not found");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.post("/create", function(req, res) {
    const filename = `${req.body.title.split(' ').join('_')}.txt`; // Replace spaces with underscores
    fs.writeFile(`./files/${filename}`, req.body.details, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Unable to create file");
        }
        res.redirect('/'); // Redirect to home after creating the file
    });
});

app.listen(4000, function() {
    console.log("App is running on port 4000");
});
