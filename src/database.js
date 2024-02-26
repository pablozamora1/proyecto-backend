import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://123:123@cluster0.jat9yqh.mongodb.net/ecomerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("coneccion exitosa");
  })
  .catch(() => {
    console.log("error de coneccion de base de datos");
  });
