import ProductManager from "../dao/services/productManager.js"
import express from "express"
import { io } from '../app.js';


const productManager = new ProductManager()
const productsRouter = express.Router()


productsRouter.get("/", async (req, res) => {

    try {
        let limit = req.query.limit
        let data = await productManager.getAll(limit)
        res.json({ data })
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).send("Error al obtener los productos");
    }
})

productsRouter.get("/:_id", async (req, res) => {

    try {
        let id = req.params._id
        let data = await productManager.getById(id)
        res.json({ data })
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al obtener el producto");
    }
})

productsRouter.post("/", async (req, res) => {

    try {
        const newProduct = req.body
        let result = await productManager.addProduct(newProduct)
        res.json({ result })
        let data = await productManager.getAll()
        io.emit('products', data);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error al agregar el producto");
    }
})

productsRouter.post("/insert", async (req, res) => {

    try {
        const product = req.body
        let result = await productManager.addProducts(product)
        res.json({ result })
        let data = await productManager.getAll()
        io.emit('products', data);
    } catch (error) {
        console.error("Error al insertar el documento:", error);
        res.status(500).send("Error al instertar el documento");
    }
})

productsRouter.put("/:_id", async (req, res) => {

    try {
        let id = req.params._id
        let upDateProduct = req.body
        let result = await productManager.updateProduct(id, upDateProduct)
        res.json({ result })
        let data = await productManager.getAll()
        io.emit('products', data);
    } catch (error) {
        console.error("Error al editar el producto:", error);
        res.status(500).send("Error al editar el producto");
    }
})

productsRouter.delete("/:_id", async (req, res) => {

    try {
        let id = req.params._id
        let result = await productManager.delateProduct(id)
        res.json({ result })
        let data = await productManager.getAll()
        io.emit('products', data);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error al eliminar el producto");
    }
})

export default productsRouter

//primer