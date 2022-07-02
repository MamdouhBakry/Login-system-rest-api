const mongoose = require('mongoose');

mongoose
    .connect("mongodb+srv://root:admin@cluster0.ipjag.mongodb.net/LoginSystem?retryWrites=true&w=majority", {
        UseNewUrlParser: true,
        UseUnifiedTopology: true
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((error) => {
        console.log(error);
    })