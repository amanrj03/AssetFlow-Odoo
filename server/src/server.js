require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log("========================================");
  console.log("🚀 AssetFlow Backend Started");
  console.log(`🌐 Server : http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log("========================================");
});
