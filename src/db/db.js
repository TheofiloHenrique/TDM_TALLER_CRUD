import path from "node:path";
import { JSONFilePreset } from "lowdb/node";

/**
 * lowdb reemplaza el fs.readFileSync/writeFileSync que teníamos antes.
 * Sigue guardando en un JSON legible (src/data/sneakers.json), pero nos da:
 *   - lectura del archivo una sola vez al arrancar (db.data queda en memoria)
 *   - escrituras en cola, sin corromper el archivo si llegan dos peticiones juntas
 *
 * import.meta.dirname es el equivalente a __dirname cuando usamos ES Modules.
 */
const DATA_PATH = path.join(import.meta.dirname, "..", "data", "sneakers.json");

// Si el archivo no existe, lowdb lo crea con este contenido por defecto.
const defaultData = { sneakers: [] };

export const db = await JSONFilePreset(DATA_PATH, defaultData);

/** Devuelve todos los sneakers. */
export function getAllSneakers() {
    return db.data.sneakers;
}

/** Busca un sneaker por id. Devuelve undefined si no existe. */
export function findSneaker(id) {
    return db.data.sneakers.find((sneaker) => sneaker.id === id);
}

/** Crea un sneaker y lo persiste. */
export async function insertSneaker({ name, description , category , price , stock , image }) {
    const sneaker = { 
        id: Date.now(), 
        name, 
        description: description ?? "", 
        category: category ?? "" , 
        price: price ?? 0 , 
        stock: stock ?? 0 , 
        image: image ?? ""
    };
    // db.update() modifica los datos y escribe el archivo en una sola operación.
    await db.update((data) => data.sneakers.push(sneaker));
    return sneaker;
}

/** Actualiza un sneaker existente. Devuelve null si no existe. */
export async function modifySneaker(id, changes) {
    const index = db.data.sneakers.findIndex((sneaker) => sneaker.id === id);
    if (index === -1) return null;

    const updated = { ...db.data.sneakers[index], ...changes, id };
    await db.update((data) => {
        data.sneakers[index] = updated;
    });
    return updated;
}

/** Elimina un sneaker. Devuelve true si se eliminó algo. */
export async function removeSneaker(id) {
    const index = db.data.sneakers.findIndex((sneaker) => sneaker.id === id);
    if (index === -1) return false;

    await db.update((data) => data.sneakers.splice(index, 1));
    return true;
}