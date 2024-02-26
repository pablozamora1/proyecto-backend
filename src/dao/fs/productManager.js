import { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./src/models/products.json";
  }

  // FUNCION PARA LEER EL ARCHIVO JSON
  async readFiles() {
    try {
      const products = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(products);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }
  // FUNCION PARA ESCRIBIR EL ARCHIVO JSON
  async writeProduct(product) {
    try {
      await fs.writeFile(this.path, JSON.stringify(product, null, 2));
    } catch (error) {
      console.log("Error al escribir el archivo", error);
    }
  }

  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const arrayProductos = await this.readFiles();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      if (arrayProductos.some((item) => item.code === code)) {
        console.log("El código debe ser único");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      }

      newProduct.id = nanoid(3);

      arrayProductos.push(newProduct);
      await this.writeProduct(arrayProductos);
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }


  // FUNCION PARA OBTENER LOS PRODUCTOS
  async getProducts() {
    try {
      return await this.readFiles();
    } catch (error) {
      console.log("Error al traer los archivo", error);
    }
  }
  // FUNCION PARA BUSCAR UN PRODUCTO POR ID
  async getProductById(pid) {
    try {
      const arrayProd = await this.readFiles();
      const find = arrayProd.find((item) => item.id == pid);

      if (!find) {
        console.log("producto no encontrado");
      } else {
        console.log("producto encontrado");
        return find;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // FUNCION PARA ACTUALIZAR UN PRODUCTO
  async updateProduct(pid, updatedProduct) {
    try {
      const productById = await this.getProductById(pid);
      if (!productById) return "No se encontró el producto";
      await this.deleteProduct(pid);
      const arrayProd = await this.readFiles();
      const productUpdated = [{ ...updatedProduct, id: pid }, ...arrayProd];
      await fs.writeFile(this.path, JSON.stringify(productUpdated, null, 2));
      return "Producto Atualizado";
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  // FUNCION PARA ELIMINAR UN PRODUCTO
  async deleteProduct(pid) {
    try {
      const productDelete = await this.readFiles();
      const productFilter = productDelete.filter((item) => item.id != pid);
      await fs.writeFile(this.path, JSON.stringify(productFilter, null, 2));
      return "producto eliminado";
    } catch (error) {
      console.log("no se puede eliminar el producto", error);
    }
  }
}
export default ProductManager;
