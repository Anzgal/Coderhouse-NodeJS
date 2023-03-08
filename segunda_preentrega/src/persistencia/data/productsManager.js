import { productsModel } from "../models/product.model.js";

export default class ProductsManager {
    async getAllProducts( {limit , page}) {
        try {
            let getProds = await productsModel.paginate( {}, {limit , page});
            console.log(getProds)
            return getProds ;
        } catch (error) {
            return error;
        }
    }
    
    
    async addProduct( prod ) {
        try {
            const newProd = await productsModel.create( prod );
            return newProd;
        } catch (error) {
            console.log("Ocurrió un error al crear el producto", error);
            return {errors: "Ocurrió un error al crear el producto", ...error};
        }
    }

    async getProductById( id ) {
        try {
            const getProdById = await productsModel.find({'_id' : id });
            return getProdById;
        } catch (error) {
            return error;
        }
    }

    async updateProduct( id , field , value ) {    
        
        try {
            const editProd = productsModel.updateOne( { '_id' : id }, {$set:{ field : value}} );
            return 'prod editado ok ', editProd
        } catch (error) {
            return error;
        }
    }

    async deleteProduct( id ){
        try {
            const delProd = await productsModel.deleteOne({ '_id' : id})
            return 'Producto eliminado correctamente.'
        } catch (error) {
            return error;
        }
    }

    async deleteFile() {
        try {
            const delAll = productsModel.remove({});
        } catch (error) {
            return error;
        }
    }
}