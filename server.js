const cors = require("cors");
const express = require("express");
const adminsRoutes = require("./routes/admins");
const shopRoutes = require("./routes/shops");
const businessOwnersRoutes = require("./routes/businessOwners");
const bookingsRoutes = require("./routes/bookings");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/admins", adminsRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/businessOwners", businessOwnersRoutes);
app.use("/api/bookings", bookingsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
