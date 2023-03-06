require("dotenv").config();
const express = require("express");
const cors = require("cors");
const globalErrhandler = require("./middlewares/globalErrHandler");
require("./config/dbConnect");
const accountsRoute = require("./routes/accounts/accountsRoute");
const transactionsRoute = require("./routes/transactions/transactionsRoute");
const usersRoute = require("./routes/users/usersRoute");

const app = express();

//middlewares
// pass incoming data
app.use(express.json());

//cors middleware
app.use(cors());

//routes
// users route
app.use("/api/v1/users/", usersRoute);

// account route
app.use("/api/v1/accounts", accountsRoute);

// transaction route
app.use("/api/v1/transactions", transactionsRoute);

// Error handlers
app.use(globalErrhandler);

// listen to the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
