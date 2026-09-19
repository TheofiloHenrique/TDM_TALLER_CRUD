const API_URL = "/api/sneakers";

// Cabecera reutilizada por POST y PUT
const JSON_HEADERS = { "Content-Type": "application/json" };

async function request(url, options) {
    
    const res = await fetch(url, options);

    if (!res.ok) {
        
        let message = `Error ${res.status}`;
        
        try {
            const body = await res.json();
            if (body.error) message = body.error;
        } catch {
            // La respuesta no era JSON (ej. estamos sin conexión): dejamos el mensaje genérico.
        }
        throw new Error(message);
    }

    return res.json();
}

export function getAllSneakers() {
    return request(API_URL);
}

export function getSneaker(id) {
    return request(`${API_URL}/${id}`);
}

export function createSneaker(data) {
    return request(API_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function updateSneaker(id, data) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function deleteSneaker(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}