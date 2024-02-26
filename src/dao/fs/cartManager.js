import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./productManager.js";

const allProducts = new ProductManager();
class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }

  // FUNCION PARA LEER EL ARCHIVO JSON
  async readCart() {
    try {
      const cart = await fs.readFile(this.path, "utf-8");
      return JSON.parse(cart);
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }
  // FUNCION PARA ESCRIBIR CARRITOS AL ARCHIVO JSON
  async writeCart(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.log("Error al escribir el archivo", error);
    }
  }

  // FUNCION PARA AGREGAR CARRITOS AL ARCHIVO JSON
  async addCart() {
    try {
      const oCart = await this.readCart();
      const id = nanoid();
      const carts = [{ id: id, products: [] }, ...oCart];
      await this.writeCart(carts);
      return "Carrito Añadido";
    } catch (error) {
      console.log("Error al escribir el archivo", error);
    }
  }

  // FUNCION PARA BUSCAR UN CARRITO POR ID
  async getCartById(cId) {
    try {
      const arrayCart = await this.readCart();
      const find = arrayCart.find((item) => item.id == cId);

      if (!find) {
        console.log("carrito no encontrado");
        return "Carrito No encontrado";
      } else {
        console.log("carrito encontrado");
        return find;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }
  // FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
  async addToCart(idCart, idProduct) {
    try {
      const cartById = await this.getCartById(idCart);
      if (!cartById) return "carrito no encontrado";
      const productById = await allProducts.getProductById(idProduct);
      if (!productById) return "Producto no encontrado";

      const allCarts = await this.readCart();
      const filterCarts = allCarts.filter((item) => item.id != idCart);

      if (cartById.products.some((item) => item.id == idProduct)) {
        const moreProductCart = cartById.products.find(
          (item) => item.id == idProduct
        );
        moreProductCart.quantity++;
        console.log(moreProductCart.quantity);
        const allCarts = [cartById, ...filterCarts];
        await this.writeCart(allCarts);
        return "Se sumo el producto al carrito";
      }

      cartById.products.push({ id: productById.id, quantity: 1 });

      const productCart = [cartById, ...filterCarts];
      await this.writeCart(productCart);

      return "producto agregado al carrito";
    } catch (error) {
      console.log("Error al agregar un carrito al archivo", error);
    }
  }
}

export default CartManager;
