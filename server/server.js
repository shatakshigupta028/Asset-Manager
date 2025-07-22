require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/search",  require("./routes/searchRoutes"));

sequelize.sync({ alter: true })  
  .then(() => {
    console.log("✅ DB synced");
    app.listen(process.env.PORT || 5050, () => {
      console.log("🚀 Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync DB:", err);
  });