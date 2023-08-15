// call the modules you'd need 

const express = require('express');
require("./config/database");
const editorRoute = require("./routes/editorRoutes")
const writerRoute = require('./routes/writerRoutes')
const taskRoute = require('./routes/taskRouter')
const commentRoute = require("./routes/commentRouter")
const cors = require("cors")
const fileUpload = require('express-fileupload')
const morgan = require ("morgan")


// give your port a number

const PORT = 5697;

const app = express();
app.use(cors({origin:"*"}))
app.use(morgan("dev"))
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(fileUpload({useTempFiles: true}));

app.use("/api", editorRoute)
app.use("/api", writerRoute)
app.use("/api", taskRoute)
app.use("/api", commentRoute)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})
