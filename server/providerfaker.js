import casual from 'casual';
import Provider from "../server/models/provider.model.js";
import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';

const app = Express();
app.use(Express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO).then(()=>{
  console.log("Connected to MongoDB");
})
.catch((error)=>{
  console.log("Could not connect to MongoDB");
  console.log(error);
})

app.listen(3000,()=>{
  console.log("Server is running on port 3000");
})

const getRandomOptions = (options, count) => {
  const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
  return shuffledOptions.slice(0, count);
};

const createFakeData = async () => {
  const nameOptions = [
    "Diagnostic Evaluation",
    "Speech Therapy",
    "ABA Therapy",
    "School-Based Service",
    "Dance Movement",
  ];
  for (let i = 0; i < 10; i++) {
    const cityName = "Chennai"
    const randomName = getRandomOptions(nameOptions, 3);
    const userReff = "66026748fbd3fc59a32f58e2";
    const Pincode = "628001";
    const provider = new Provider({
      fullName: casual.full_name,
      name: randomName,
      email: casual.email,
      qualification: casual.title,
      license: casual.random,
      experience: casual.integer(1, 20) + " years",
      phone: Number(casual.phone.replace(/\D/g, '')),
      address: {
        addressLine1: casual.street,
        country: casual.country,
        state: casual.state,
        city: cityName,
        street: casual.street,
        pincode: Pincode,
      },
      therapytype: [casual.word, casual.word],
      availability: {
        morningStart: "08:00",
        morningEnd: "12:00",
        eveningStart: "14:00",
        eveningEnd: "18:00",
      },
      regularPrice: casual.double(1, 1000),
      description: casual.text,
      profilePicture: casual.url,
      imageUrls: [casual.url, casual.url],
      userRef: userReff,
      verified: casual.boolean,
    });

    await provider.save();
  }
};

createFakeData();