
import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { Server } from 'socket.io';
import { io } from '../app.js';

const routerProducts = Router();
const productManager = new ProductManager();



routerProducts.get("/", async ({ query }, res) => {
  try {
    const { limit } = query;
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit));
    }
    res.render('home', { products: products });
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error al obtener los productos");
  }
});

routerProducts.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products: products });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

routerProducts.get("/:pid/", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
});


routerProducts.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;


    const productData = {
      title,
      description,
      code,
      price,
      thumbnail: thumbnails || [],
      stock,
      category,
    };
    await productManager.addProduct(productData);

    const products = await productManager.getProducts();

    io.emit('products', products);
    res.status(201).json({ success: true, message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).send("Error al agregar el producto");
  }
});


routerProducts.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
      const updateSuccess = await productManager.updateProduct(pid, updatedFields);

      if (updateSuccess) {
        res.send("Producto actualizado exitosamente");
        io.emit('products', await productManager.getProducts());
      } else {
        res.status(404).send("No se encontró el producto con el id " + pid);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send("Error al actualizar el producto");
  }
});

routerProducts.delete("/:pid/", async (req, res) => {
  try {
    const { pid } = req.params;

  
    const product = await productManager.getProductById(pid);

    if (!product) {
      res.status(404).send("No se encontró el producto con el id " + pid);
      return;
    }


    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      res.status(500).send("Error al eliminar el producto");
      return;
    }

    res.send("Producto eliminado exitosamente");
    io.emit('products', await productManager.getProducts());
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error al eliminar el producto");
  }
});

export default routerProducts;