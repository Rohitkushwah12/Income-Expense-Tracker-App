const mongoose = require("mongoose");

// connect
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Db Connected Successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

dbConnect();
