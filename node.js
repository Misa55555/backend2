/* const fs = require(`fs`)

fs.writeFileSync("./texto.txt", "buenas buenas buenas!")

if(fs.existsSync("./texto.txt")) {
    let contenido = fs.readFileSync("./texto.txt","utf-8")

    fs.appendFileSync("./texto.txt","muy mal")
    contenido = fs.readFileSync("./texto.txt","utf-8")
    console.log(contenido)
    fs.unlinkSync("./texto.txt")
}
else {
    console.log(false)
} */ 

//path ---- JSON  ---- asyinc -- prub/testt

const fs = require('fs');


class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path) == false) {
            fs.writeFileSync(path, JSON.stringify([]));   //DIF MET, ==
        };
    }
    static getNewId(lastProduct) {  //MLSSU
        if (!lastProduct) {
            return 1;
        } else {
            return lastProduct.id + 1;
        }
    }
    async getProducts() {
        let products = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(products);
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();
        let codes = products.map(p => p.code)

        if (codes.includes(code)) {
            console.log('Este producto ya existe');
            return;
        }
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Complete todos los campos');
            return
        }
        let lastProduct = products[products.length - 1]
        let newId = ProductManager.getNewId(lastProduct);
        products.push({ title: title, description: description, price: price, thumbnail: thumbnail, code: code, stock: stock, id: newId });
        fs.writeFileSync(this.path, JSON.stringify(products));  //mucho errores
    }

    async getProductById(id) {
        let products = await this.getProducts();
        let product = products.find(p => p.id === id); 
        if (product) {
            return product;
        }
        console.error('No existe el producto');
    }
    async updateProduct(id, updatedProduct) {
        let products = await this.getProducts();
        let productIndex = products.findIndex(p => p.id == id); //unica forma? :,c
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
    async deleteProduct(id) {
        let products = await this.getProducts();  //...
        let productIndex = products.findIndex(p => p.id == id);
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
}

/*Pruba */ 

(async function main() {
    try {
        const productManager = new ProductManager('./productos.txt');
        
        //productos para el testing del método addProduct
        await productManager.addProduct("Papas","con chocolate relleno",900,"https://www.divinacocina.es/wp-content/uploads/dulce-de-leche-en-el-croondas.jpg","abc",23);
        await productManager.addProduct("Zanahorias","ralladas con azucar",800,"https://thumbs.dreamstime.com/b/zanahorias-ralladas-13638726.jpg","abcd",256);
        await productManager.addProduct("arroz con leche","incluye dulce de leche",1000,"https://img-global.cpcdn.com/recipes/73d9c9c8b6423779/1200x630cq70/photo.jpg","abcde",56);
        await productManager.addProduct("arollado de papa","aceitunas negras y violetas",170,"https://cloudfront-us-east-1.images.arcpublishing.com/radiomitre/5OCQM5GYP5ALXO4VPLURIR5XPY.jpg","abcdef",32);
        
        //getProducts
        let resultProducts = await productManager.getProducts();
        console.log(resultProducts);
        
        //getProductsById
        console.log(await productManager.getProductById(1));
        productManager.getProductById(5);

        //updateProduct
        await productManager.updateProduct(2, { price: 50 });
        console.log(await productManager.getProductById(2));
        
        //deleteProduct
        await productManager.deleteProduct(1)
        console.log(await productManager.getProducts());
    } catch (err) {
        console.error(err);
    }
})();

