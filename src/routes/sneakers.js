import { Router } from "express";
import { getAllSneakers, findSneaker, insertSneaker, modifySneaker, removeSneaker } from "../db/db.js";

/**
 * Un Router de Express es un "mini servidor" que luego montamos en /api/sneakers.
 * Compara esto con el archivo anterior: ya no parseamos req.url a mano,
 * ni acumulamos el body con req.on("data"), ni escribimos las cabeceras.
 */
const router = Router();

/**
 * Middleware propio: valida que el :id de la URL sea un número.
 * Al registrarlo con router.param() se ejecuta en TODAS las rutas que usen :id.
 */
router.param("id", (req, res, next, value) => {
    const id = Number(value);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El id debe ser un número entero" });
    }
    req.sneakerId = id;
    next();
});

// GET /api/sneakers
router.get("/", (req, res) => {
    res.json(getAllSneakers());
});

// GET /api/sneakers/:id
router.get("/:id", (req, res) => {
    const sneaker = findSneaker(req.sneakerId);
    if (!sneaker) return res.status(404).json({ error: "sneaker no encontrado" });
    res.json(sneaker);
});

// POST /api/sneakers
router.post("/", async (req, res) => {
    const { name, description, category, price, stock, image } = req.body ?? {};

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "El campo 'name' es obligatorio" });
    }

    const nuevo = await insertSneaker({ name: name.trim(), description: description?.trim(), 
        category: category.trim() ?? "",price: price, stock: stock, image: image ?? "" });
    res.status(201).json(nuevo);
});

// PUT /api/sneakers/:id
router.put("/:id", async (req, res) => {
    const { name, description, category, price, stock, image } = req.body ?? {};

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({ error: "El campo 'name' no puede quedar vacío" });
    }

    // Solo mandamos los campos que vinieron en el body: así un PUT con
    // { description } no borra el name que ya tenía el sneaker.
    const changes = {};
    if (name !== undefined) changes.name = name.trim();
    if (description !== undefined) changes.description = description.trim();
    if (category !== undefined) changes.category = category.trim();
    if (price !== undefined) changes.price = price.trim();
    if (stock !== undefined) changes.stock = stock;
    if (image !== undefined) changes.image = image;

    const actualizado = await modifySneaker(req.sneakerId, changes);
    if (!actualizado) return res.status(404).json({ error: "Sneaker no encontrado" });
    res.json(actualizado);
});

// DELETE /api/sneakers/:id
router.delete("/:id", async (req, res) => {
    const eliminado = await removeSneaker(req.sneakerId);
    if (!eliminado) return res.status(404).json({ error: "Sneaker no encontrado" });
    res.json({ mensaje: "Sneaker eliminado", id: req.sneakerId });
});

export default router;