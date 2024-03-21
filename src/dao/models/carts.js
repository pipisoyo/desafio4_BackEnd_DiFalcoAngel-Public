import mongoose from "mongoose"

const collection = "cards"

const schema = new mongoose.Schema({
    products:[{
    product :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        require:true
    },
    quantity :{
        type:Number,
        require:true
    }}]
    
})

const cartsModel =mongoose.model(collection,schema)

export default cartsModel