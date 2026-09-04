const API_URL = "/api/sneakers";

//Creando un tenis (POST en "/api/sneakers")
export async function createSneaker(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al crear el tenis");
    return res.json();
}

//Buscando todos los tenis ( GET en "/api/sneakers")
export async function getAllSneakers() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al buscar todos los tenis");
    return res.json();
}

//Buscando un par de tenis específico por su ID (GET en "/api/sneakers/{id}")
export async function getSneaker(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("No se encontró el tenis específico");
    return res.json();
}

//Actualizar un tenis específico por su ID (PUT en "/api/sneakers/{id}")
export async function updateSneaker(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al actualizar el tenis");
    return res.json();
}


//Excluyendo un tenis por su ID (DELETE en "/api/sneakers/{id}")
export async function deleteSneaker(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar el tenis");
    return res.json();
}