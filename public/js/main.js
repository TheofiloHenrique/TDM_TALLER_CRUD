import { getAllSneakers, getSneaker, createSneaker, deleteSneaker, updateSneaker } from "./services/api.js";
import { resetForm, fillForm, renderSneakers } from "./ui/ui.js";

const tableBody = document.getElementById("sneakersTable");
const form = document.getElementById("sneakerForm");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const offlineBanner = document.getElementById("offlineBanner");

let editID = null;

// Controlar visibilidad del banner offline en tiempo real
function updateOnlineStatus() {
    if (!offlineBanner) return;
    if (navigator.onLine) {
        offlineBanner.classList.add("hidden");
    } else {
        offlineBanner.classList.remove("hidden");
    }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus(); // Ejecutar al cargar

/** Vuelve al modo "crear". */
function stopEditing() {
    editID = null;
    if (form && submitBtn && cancelBtn) {
        resetForm(form, submitBtn, cancelBtn);
    }
}

// Eventos de tabla (delegación) - Protegido si tableBody no existe en la página
if (tableBody) {
    tableBody.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);

        if (btn.classList.contains("btn-delete")) {
            if (!navigator.onLine) {
                showToast("No disponible sin conexión: No puedes eliminar registros sin internet.");
                return;
            }

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
                if (editID === id) {
                    stopEditing();
                    return;
                }
                const sneaker = await getSneaker(id);
                if (form && submitBtn && cancelBtn) {
                    fillForm(form, sneaker, submitBtn, cancelBtn);
                }
                editID = id;
            } catch (err) {
                console.error("Error cargando sneaker:", err);
                showToast(err.message);
            }
        }
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", stopEditing);
}

// Envío del form
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!navigator.onLine) {
            showToast("No disponible sin conexión: No puedes crear ni editar registros sin internet.");
            return;
        }

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
                await updateSneaker(editID, { name, description, category, price, stock, image });
                showToast("Cambios guardados", "success");
            } else {
                await createSneaker({ name, description, category, price, stock, image });
                showToast("Item agregado", "success");
            }

            stopEditing();
            loadSneakers();
        } catch (err) {
            console.error("Error guardando sneaker:", err);
            showToast(err.message);
        }
    });
}

// Cargar al inicio
async function loadSneakers() {
    if (!tableBody) return;
    try {
        const sneakers = await getAllSneakers();
        renderSneakers(sneakers, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        if (typeof showToast === "function") {
            showToast(err.message);
        }
    }
}

loadSneakers();