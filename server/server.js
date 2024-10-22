import express from 'express';
import cors from 'cors';
import connectionToDB from './ConfigDb/dbConnection.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Set Cross-Origin-Opener-Policy header for all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(cors());

app.use(express.json());

connectionToDB();

app.use("/api/v1/user", userRoutes);

app.get('/', (req, res) => {
  res.send('Home');
});
app.get("/h", (req, res) => {
  res.json({ message: "Welcome to the API" });
});


app.all('*', (req, res) => {
  res.status(400).send("OOPS!! 404 page not found");
});

app.use(errorMiddleware); // Use error middleware

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
