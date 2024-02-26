import express, { urlencoded, json } from "express";
import { engine } from "express-handlebars";
import productsRouter from "./src/routes/products.router.js";
import cartRouter from "./src/routes/cart.router.js";
import ProductManager from "./src/dao/db/product-manager-db.js";
const product = new ProductManager();
import { Server } from "socket.io";

import "./src/database.js";

import viewsRouter from "./src/routes/views.router.js";

const app = express();
const PUERTO = 8080;

//Middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static("./src/public"));

// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use("/", viewsRouter);

//routing
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/realtimeproducts", viewsRouter);

//Listen
const server = app.listen(PUERTO, () => {
  console.log(`escuchando en el http://localhost:${PUERTO}`);
});

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  //Envia el array de productos al cliente que se conectó:
  socket.emit("productos", await product.getProducts());

  //Recibe el evento "eliminarProducto" desde el cliente:
  socket.on("eliminarProducto", async (id) => {
    await product.deleteProduct(id);
    //Envia el array de productos actualizado a todos los productos:
    io.sockets.emit("productos", await product.getProducts());
  });

  //Recibe el evento "agregarProducto" desde el cliente:
  socket.on("agregarProducto", async (producto) => {
    await product.addProduct(producto);
    //Envia el array de productos actualizado a todos los productos:
    io.sockets.emit("productos", await product.getProducts());
  });
});
