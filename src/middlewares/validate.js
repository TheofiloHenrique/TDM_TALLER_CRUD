export const CATEGORIES = ["Masculino", "Femenino", "Infantil"];

export function validateSneaker(req, res, next) {
    const body = req.body ?? {};
    const isPut = req.method === "PUT"; 
    const errors = [];

    for (const field of ["price", "stock"]) {
        const value = body[field];
        if (value === undefined) {
            if (!isPut) errors.push(`${field} es obligatorio`);
            continue;
        }
        
        const raw = String(value).trim();
        const n = raw === "" ? NaN : Number(raw);
        
        if (!Number.isFinite(n) || n < 0) {
            errors.push(`${field} debe ser un número mayor o igual a 0`);
        } else {
            body[field] = n; 
        }
    }

    if (body.category === undefined) {
        if (!isPut) errors.push("Category es obligatorio");
    } else if (!CATEGORIES.includes(body.category)) {
        errors.push(`Category debe ser uno de: ${CATEGORIES.join(", ")}`);
    }

    for (const field of ["name", "description"]) {
        if (body[field] !== undefined && typeof body[field] !== "string") {
            errors.push(`${field} debe ser texto`);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(". "), errors });
    }
    next();
}