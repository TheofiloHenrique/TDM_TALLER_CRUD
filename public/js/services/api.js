const API_URL = "/api/sneakers";

const JSON_HEADERS = {
    "Content-Type": "application/json"
};

/**
 * Realiza las peticiones HTTP a la API.
 */
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let message = `Error ${response.status}`;

        try {
            const body = await response.json();

            if (body.error) {
                message = body.error;
            }
        } catch {
            // La respuesta no contenía JSON.
        }

        throw new Error(message);
    }

    return response.json();
}

/**
 * Obtiene todos los sneakers.
 *
 * Permite combinar:
 * - q: búsqueda por nombre o descripción
 * - category: filtro por categoría
 * - sort: ordenamiento por precio
 */
export function getAllSneakers(filters = {}) {
    const params = new URLSearchParams();

    if (filters.q?.trim()) {
        params.set("q", filters.q.trim());
    }

    if (filters.category) {
        params.set("category", filters.category);
    }

    if (filters.sort) {
        params.set("sort", filters.sort);
    }

    const queryString = params.toString();

    const url = queryString
        ? `${API_URL}?${queryString}`
        : API_URL;

    return request(url);
}

/**
 * Obtiene un sneaker por ID.
 */
export function getSneaker(id) {
    return request(`${API_URL}/${id}`);
}

/**
 * Crea un nuevo sneaker.
 */
export function createSneaker(data) {
    return request(API_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

/**
 * Actualiza un sneaker existente.
 */
export function updateSneaker(id, data) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

/**
 * Elimina un sneaker.
 */
export function deleteSneaker(id) {
    return request(`${API_URL}/${id}`, {
        method: "DELETE"
    });
}