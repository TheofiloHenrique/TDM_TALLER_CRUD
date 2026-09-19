import { getAllSneakers, getSneaker , createSneaker , deleteSneaker , updateSneaker } from "./services/api.js";
import { resetForm , fillForm , renderSneakers } from "./ui/ui.js";

const tableBody = document.getElementById("sneakersTable");
const form = document.getElementById("sneakerForm");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editID  = null;

/** Vuelve al modo "crear". */
function stopEditing() {
    editID = null;
    resetForm(form, submitBtn, cancelBtn);
}

// Eventos de tabla (delegación: un solo listener para todas las filas)
tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-delete")) {
        try {
            await deleteSneaker(id);
            if (editID === id) stopEditing();
            showToast("Sneaker eliminado", "success");
            loadSneakers();
        } catch (err) {
            console.error("Error eliminando:", err);
            showToast(err.message);
        }
    } else if (btn.classList.contains("btn-edit")) {
        try {
            // Segundo clic en el mismo botón = cancelar la edición
            if (editID === id) {
                stopEditing();
                return;
            }
            const item = await getSneaker(id);
            fillForm(form, item, submitBtn, cancelBtn);
            editID = id;
        } catch (err) {
            console.error("Error cargando item:", err);
            showToast(err.message);
        }
    }
});

cancelBtn.addEventListener("click", stopEditing);

// Envío del form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const description = form.querySelector("#description").value.trim();
    const category = form.querySelector("#category").value;
    const price = form.querySelector("#price").value;
    const stock = form.querySelector("#stock").value;
    const image = form.querySelector("#image").value;


    if (!name) {
        showToast("El campo nombre es obligatorio");
        return;
    }

    try {
        if (editID) {
            await updateSneaker(editId, { name, description , category , price , stock , image });
            showToast("Cambios guardados", "success");
        } else {
            await createSneaker({ name, description , category , price , stock , image});
            showToast("Item agregado", "success");
        }

        stopEditing();
        loadSneakers();
    } catch (err) {
        console.error("Error guardando item:", err);
        showToast(err.message);
    }
});

// Cargar al inicio
async function loadSneakers() {
    try {
        const sneakers = await getAllSneakers();
        renderSneakers(sneakers, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        showToast(err.message);
    }
}

loadSneakers();