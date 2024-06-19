import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import providerRouter from "./routes/provider.route.js";
import parentRouter from "./routes/parent.route.js";
import ratingRouter from "./routes/rating.route.js";
import favoriteRouter from "./routes/favorite.route.js";
import bookingRouter from "./routes/booking.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

// import Provider from "./models/provider.model.js";
// import casual from "casual";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://onestepdev.onrender.com/", "http://localhost:3000",'http://1step.co.in/'],
  })
);
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Could not connect to MongoDB");
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/provider", providerRouter);
app.use("/server/parent", parentRouter);
app.use("/server/rating", ratingRouter);
app.use("/server/favorite", favoriteRouter);
app.use("/server/booking", bookingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const stateCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(stateCode).json({
    success: true,
    message,
    stateCode,
  });
});

// const getRandomOptions = (options, count) => {
//   const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
//   return shuffledOptions.slice(0, count);
// };

// const createFakeData = async () => {
//   const nameOptions = [
//     "Diagnostic Evaluation",
//     "Speech Therapy",
//     "ABA Therapy",
//     "School-Based Service",
//     "Dance Movement",
//     "Occupational Therapy",
//     "Art As Therapy",
//     "Counselling",
//   ];
//   const TherapyType = ["Virtual", "In-Clinic", "In-Home"];
//   const ProfilePic = [
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(1).jpg?alt=media&token=032946ba-15a9-4d20-95f5-98a57cdb2b5a",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(1).png?alt=media&token=16db495a-3651-4f00-89f7-4ccc02bf967f",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(2).png?alt=media&token=53c653e4-fb68-4519-af80-18dfb3e999e1",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(3).png?alt=media&token=cfdc0605-efa8-498f-8def-97cfc106cc2a",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(4).png?alt=media&token=893e528f-1733-46fb-b82c-1631923928dc",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(5).png?alt=media&token=750bf704-db2c-4073-a016-4ec808cdfa9e",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(6).png?alt=media&token=8716eba0-85b4-4a87-8e00-c27df5614f17",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(7).png?alt=media&token=7f941fb3-0103-491b-b043-75aa1eb0cbcc",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(8).png?alt=media&token=29501b7e-adc5-4cea-83dd-65148a617127",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerprofile%20(9).png?alt=media&token=6d093185-55aa-4184-a916-5d4e681c263e",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providernew%20(5).png?alt=media&token=5e1950db-7b2f-40aa-bec0-6b666a100a12",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providernew%20(4).png?alt=media&token=29d95e59-c264-4e7f-a561-e68148262524",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providernew%20(3).png?alt=media&token=10ed0b82-98fe-43b8-901d-824ee25ccf74",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providernew%20(2).png?alt=media&token=21bc24b7-71b2-4153-bd04-94d8ae0f6a51",
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providernew%20(1).png?alt=media&token=1a7e5441-13b9-48df-96f7-f0d9d050a3bd",
//   ];
//   const providerbg =
//     "https://firebasestorage.googleapis.com/v0/b/step-1d272.appspot.com/o/providerbg.png?alt=media&token=12d6d902-67f7-4013-871f-bdddbc85e7cf";
//   for (let i = 0; i < 100; i++) {
//     const cityName = ["Chennai", "Bangalore", "New Delhi","Thoothukudi","Kanyakumari"];
//     const randomName = getRandomOptions(nameOptions, 3);
//     const userReff = "66026748fbd3fc59a32f58e2";
//     const Pincode = "628001";
//     const provider = new Provider({
//       fullName: casual.full_name,
//       name: randomName,
//       email: casual.email,
//       qualification: casual.title,
//       license: casual.random,
//       experience: casual.integer(1, 20),
//       phone: Number(casual.phone.replace(/\D/g, "")),
//       address: {
//         addressLine1: casual.street,
//         country: casual.country,
//         state: casual.state,
//         city: casual.random_element(cityName),
//         street: casual.street,
//         pincode: Pincode,
//       },
//       therapytype: [casual.random_element(TherapyType)],
//       availability: {
//         morningStart: "08:00",
//         morningEnd: "12:00",
//         eveningStart: "14:00",
//         eveningEnd: "18:00",
//       },
//       regularPrice: casual.double(1, 1000),
//       description: casual.text,
//       profilePicture: casual.random_element(ProfilePic),
//       imageUrls: [providerbg],
//       userRef: userReff,
//       verified: casual.boolean,
//     });

//     await provider.save();
//   }
// };

// createFakeData();
