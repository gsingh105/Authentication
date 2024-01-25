var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phno: String,
    password: String
});

var User = mongoose.model('User', userSchema);


app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var newUser = new User({
        name: name,
        email: email,
        phno: phno,
        password: password
    });

    newUser.save((err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving user');
        } else {
            console.log("User Registered Successfully");
            return res.redirect('signup_success.html');
        }
    });
});


app.post("/login", (req, res) => {
    var loginEmail = req.body.loginEmail;
    var loginPassword = req.body.loginPassword;

    User.findOne({ email: loginEmail, password: loginPassword }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error during login');
        } else if (!user) {
            res.status(401).send('Invalid credentials');
        } else {
            console.log("Login Successful");
            return res.redirect('login_success.html');
        }
    });
});


app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('login.html');
});


app.get("/signup", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('signup.html');
});


app.get("/login", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
});
