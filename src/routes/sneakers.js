const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "sneakers.json");

function readData() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function handleSneakersRoutes(req, res) {
    if (!req.url.startsWith("/api/sneakers")) return false;

    res.setHeader("Content-Type", "application/json");

    //GET /api/sneakers
    if (req.method === "GET" && req.url === "/api/sneakers") {
        res.end(JSON.stringify(readData()));
        return true;
    }

    //GET /api/sneakers/:id
    if (req.method === "GET" && req.url.startsWith("/api/sneakers/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            const item = readData().find(i => i.id === id);
            res.end(JSON.stringify(item || { error: "No encontrado" }));
            return true;
        }
    }

    //POST /api/sneakers
    if (req.method === "POST" && req.url === "/api/sneakers") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const sneakers = readData();
            const nuevo = JSON.parse(body);
            nuevo.id = sneakers.length > 0 
            ? Math.max(...sneakers.map(s => s.id)) + 1
            : 1;
            sneakers.push(nuevo);
            writeData(sneakers);
            res.end(JSON.stringify(nuevo));
        });
        return true;
    }

    //PUT /api/sneakers/:id
    if (req.method === "PUT" && req.url.startsWith("/api/sneakers/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                let sneakers = readData();
                const idx = sneakers.findIndex(i => i.id === id);

                if (idx >= 0) {
                    const updated = { ...sneakers[idx], ...JSON.parse(body), id };
                    sneakers[idx] = updated;
                    writeData(sneakers);
                    res.end(JSON.stringify(updated));
                } else {
                    res.end(JSON.stringify({ error: "No encontrado" }));
                }
            });
            return true;
        }
    }

    //DELETE /api/sneakers/:id
    if (req.method === "DELETE" && req.url.startsWith("/api/sneakers/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let sneakers = readData();
            const newsneakers = sneakers.filter(i => i.id !== id);

            if (newsneakers.length !== sneakers.length) {
                writeData(newsneakers);
                res.end(JSON.stringify({ mensaje: "Eliminado" }));
            } else {
                res.end(JSON.stringify({ error: "No encontrado" }));
            }
            return true;
        }
    }

    return false;
}

module.exports = handleSneakersRoutes;