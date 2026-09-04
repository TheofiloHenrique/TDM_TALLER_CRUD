import { getAllSneakers, getSneaker , createSneaker , deleteSneaker , updateSneaker } from "./services/api.js";
import { resetForm , fillForm , renderSneakers } from "./ui/ui.js";

const tableBody = document.getElementById("sneakersTable");
const form = document.getElementById("sneakerForm");
const submitBtn = document.getElementById("submitBtn");

let editId = null;

//Eventos de tabla (delegación)
tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if(!btn) return;

    const id = Number(btn.dataset.id);

    if(btn.classList.contains("btn-delete")) {
        try {
            await deleteSneaker(id);
            loadSneakers();
        } catch (err) {
            console.error("Error eliminando:", err);
            alert("No se pudo eliminar el sneaker.");
        }
    } else if(btn.classList.contains("btn-edit")) {
        try {
            if(editId === id) {
                resetForm(form, submitBtn);
                editId = null;
                return;
            }
            const item = await getSneaker(id);
            fillForm(form, item, submitBtn);
            editId = id;
        } catch (err) {
            console.error("Error cargando sneaker:", err);
            alert("No se pudo cargar el sneaker para edición.");
        }
    }
});

//Envío del form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const description = form.querySelector("#description").value;
    const category = form.querySelector("#category").value;
    const price = form.querySelector("#price").value;
    const stock = form.querySelector("#stock").value;
    const image = form.querySelector("#image").value;

    if(!name) {
        alert("El campo nombre es obligatorio");
        return;
    }

    try {
        if(editId) {
            await updateSneaker(editId, { name, description , category , price , stock , image });
            editId = null;
        } else {
            await createSneaker({ name, description , category , price , stock , image});
        }

        resetForm(form, submitBtn);
        loadSneakers();
    } catch (err) {
        console.error("Error guardando sneaker:", err);
        alert("No se pudo guardar el sneaker.");
    }
});

//Cargar todos los tenis de inicio
async function loadSneakers() {
    try {
        const items = await getAllSneakers();
        renderSneakers(items, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los sneakers.");
    }
}

loadSneakers();