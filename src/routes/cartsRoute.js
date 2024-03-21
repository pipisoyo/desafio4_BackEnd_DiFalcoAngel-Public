import CartsManager from "../dao/services/cartManager.js";
import express from "express"

const cartsManager = new CartsManager();
const cartsRoutes = express.Router()

cartsRoutes.get("/:_id", async (req, res) => {

  const id = req.params._id;
  try {
    const cart = await cartsManager.getCartById(id);
    return res.json({ cart });
  }
  catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
})

cartsRoutes.post("/", async (req,res) => {

  try {
    const newCart = await cartsManager.createCart();
    return res.json(newCart)
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).send("Error al crear el carrito");
  }
})

cartsRoutes.post("/:cid/product/:pid/", async (req, res) => {

  const productId = req.params.pid
  const cartId = req.params.cid
  let cart = await cartsManager.getCartById(cartId);
  const quantity = 1;
  try {
    if (!cart || cart.length === 0) {
      cart = await cartsManager.createCart()
    }
    const newCart = await cartsManager.addProduct(cartId, productId, quantity)
    res.json(newCart)
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Error en la base de datos", details: error.message });
  }
});

export default cartsRoutes;