const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.authorization) {
    console.log('req.session.authorization happened')
    let token = req.session.authorization['accessToken'];
    // Verify JWT token
    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            console.log('!err happened')
            req.user = user;
            next(); // Proceed to the next middleware
        } else {
            console.log('!err did not happen')
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
} else {
    console.log('req.session.authorization did not happen')
    return res.status(403).json({ message: "User not logged in" });
}
});
 
const PORT =5000;

app.get('/user', (req, res) => {
  res.json({ message: 'User information retrieved successfully' });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
