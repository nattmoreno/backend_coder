import fs from "fs";

export class ProductManager {
    static idCounter = 0;

    constructor(path) {
        this.path = path;
        this.products = this.getProducts();
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.path, "utf-8");
            const products = JSON.parse(data);
            ProductManager.idCounter = products.length;
            return products;
        } catch (error) {
            console.error("❌ Error al leer el archivo");
            return [];
        }
    }

    addProduct(product) {
        // this.getProducts();
        if (this.getProductByCode(product.code)) {
            console.warn(`❌ Ya existe un producto con el código ${product.code}`);
            return;
        }

        try {
            product.id = ++ProductManager.idCounter;
            this.products.push(product);
            const products = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, products);
            console.log("✔ Product added successfully");
        } catch (error) {
            console.error("❌ Error adding product");
        }
    }

    getProductByCode(code) {
        // this.getProducts();
        return this.products.find((product) => product.code === code);
    }

    getProductById(id) {
        // this.getProducts();
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            console.error("❌ Product not found");
            return null;
        }
        return product;
    }

    updateProductById(id, product) {
        // this.getProducts();
        // Se recibe el ID del producto a actualizar
        // y el producto con los cambios realizados para enviar al archivo.
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            console.error(`❌ Product id ${id} not found`);
            return null;
        }

        try {
            // Al producto a actualizar se le asigna el ID correspondiente
            product.id = id;
            this.products[index] = product;

            const products = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, products);

            console.log("✔ Producto actualizado con éxito");
            return product;
        } catch (error) {
            console.error("❌ Error al actualizar el producto");
        }
    }

    deleteProductById(id) {
        // this.getProducts();
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
            console.warn(`❌ No se encontró el producto con id ${id}`);
        }

        try {
            this.products.splice(index, 1);
            const products = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, products);
            return "✔ Producto eliminado con éxito";
        } catch (error) {
            console.error("❌ Error al eliminar el producto");
        }
    }
}
