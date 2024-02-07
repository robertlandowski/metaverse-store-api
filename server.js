const cors = require("cors");
const express = require("express");
const adminsRoutes = require("./routes/admins");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/admins", adminsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
