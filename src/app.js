import express from "express";
import routerProducts from "./routes/productsRoute.js";
import cartsRoute from "./routes/cartsRoute.js";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import { Server } from 'socket.io';
import { ProductManager } from "./ProductManager.js";
import { Router } from "express";

const app = express();
const port = 8080;
const productManager = new ProductManager();
const realTimeProducts = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", routerProducts)
app.use("/api/carts/", cartsRoute)
app.use("/api/realtimeproducts",realTimeProducts)
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

const server = app.listen(port, () => console.log("Listending in port :", port))
export const io = new Server(server)

io.on('connection', socket => {

  console.log("Cliente Conectado!")

  socket.on('realTimeProducts', async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit('productos', products);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
  });
})

realTimeProducts.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products: products });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});
