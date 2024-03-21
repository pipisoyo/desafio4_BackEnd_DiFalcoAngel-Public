import cartsModel from "../models/carts.js"


export default class CartsManager {

    getCartById = async (id) =>{

        let result = await cartsModel.findById(id)
        return result
    }
    createCart = async () => {
        let result = await cartsModel.create({})
        return result
    }

    addProduct = async (cid, pid, quantity) => {
        let cart = await cartsModel.findById(cid)
        let product = cart.products.find((product) => {
            return product.product.toString() === pid
        })
        if (product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        return await cart.save();
    }


    deleteProduct = async (cid, pid) => {
        let cart = await cartsModel.findById(cid)
        let product = cart.products.findIndex((product) => product.product.toString() === pid)

        if(product === 0){
            console.log("Producto no encontrado")
        }else{
            cart.product.splice(product,1)
        }

        return await cart.save();
    }
}