const cors = require("cors");
const express = require("express");
const adminsRoutes = require("./routes/admins");
const shopRoutes = require("./routes/shops");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/admins", adminsRoutes);
app.use("/api/shops", shopRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
