// call the modules you'd need 

const express = require('express');
require("./config/database");
const editorRoute = require("./routes/editorRoutes")
const writerRoute = require('./routes/writerRoutes')
const cors = require("cors")


// give your port a number

const PORT = 5697;

const app = express();
app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"))

app.use("/api", editorRoute)
app.use("/api", writerRoute)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})
