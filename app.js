import express, { json } from "express";
import { ProductManager } from "./ProductManager.js";

const port = 8080;
const productManager = new ProductManager("./productos.json");

const app = express();

// Middleware para leer el body de las peticiones
// (ya que estaba me puse a practicar esto)
app.use(json());

// Endpoint para obtener todos los productos con límite opcional
// Para ver todos los productos: http://localhost:8080/products
// Aplicando un límite a los productos: http://localhost:8080/products?limit=3
app.get("/products", async (req, res) => {
    try {
        let products = productManager.getProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

// Endpoint para obtener un producto por su id
//  Modo de ejecucion: http://localhost:8080/products/3
app.get("/products/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
