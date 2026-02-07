import app from "./app.js";
import "dotenv/config";
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`the server is running on the PORT:${PORT}`);
});
