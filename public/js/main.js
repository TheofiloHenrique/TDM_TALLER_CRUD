import {getAllSneakers,getSneaker,createSneaker,deleteSneaker,updateSneaker} from "./services/api.js";

import {resetForm,fillForm,renderSneakers,showToast} from "./ui/ui.js";

const tableBody = document.getElementById("sneakersTable");
const form = document.getElementById("sneakerForm");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const offlineBanner = document.getElementById("offlineBanner");

let editID = null;

/**
 * Controla la visibilidad del aviso de conexión.
 */
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

updateOnlineStatus();

/**
 * Vuelve al modo "crear".
 */
function stopEditing() {
    editID = null;

    if (form && submitBtn && cancelBtn) {
        resetForm(form, submitBtn, cancelBtn);
    }
}

/**
 * Eventos de la tabla.
 * Se utiliza delegación de eventos para los botones
 * creados dinámicamente por renderSneakers().
 */
if (tableBody) {
    tableBody.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");

        if (!btn) return;

        const id = Number(btn.dataset.id);

        if (!Number.isInteger(id)) {
            showToast("Identificador de sneaker inválido.");
            return;
        }

        /**
         * Eliminar sneaker
         */
        if (btn.classList.contains("btn-delete")) {
            if (!navigator.onLine) {
                showToast(
                    "No disponible sin conexión: No puedes eliminar registros sin internet."
                );
                return;
            }

            try {
                await deleteSneaker(id);

                if (editID === id) {
                    stopEditing();
                }

                showToast("Sneaker eliminado", "success");

                await loadSneakers();
            } catch (err) {
                console.error("Error eliminando:", err);
                showToast(err.message);
            }

            return;
        }

        /**
         * Editar sneaker
         */
        if (btn.classList.contains("btn-edit")) {
            try {
                /**
                 * Si se vuelve a pulsar el mismo botón
                 * mientras estamos editando, se cancela la edición.
                 */
                if (editID === id) {
                    stopEditing();
                    return;
                }

                const sneaker = await getSneaker(id);

                if (form && submitBtn && cancelBtn) {
                    fillForm(
                        form,
                        sneaker,
                        submitBtn,
                        cancelBtn
                    );
                }

                editID = id;
            } catch (err) {
                console.error("Error cargando sneaker:", err);
                showToast(err.message);
            }
        }
    });
}

/**
 * Cancelar edición.
 */
if (cancelBtn) {
    cancelBtn.addEventListener("click", stopEditing);
}

/**
 * Envío del formulario.
 */
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!navigator.onLine) {
            showToast(
                "No disponible sin conexión: No puedes crear ni editar registros sin internet."
            );
            return;
        }

        const name = form.querySelector("#name").value.trim();
        const description = form
            .querySelector("#description")
            .value.trim();

        const category = form.querySelector("#category").value;
        const price = form.querySelector("#price").value;
        const stock = form.querySelector("#stock").value;
        const image = form.querySelector("#image").value.trim();

        /**
         * Validaciones básicas del cliente.
         */
        if (!name) {
            showToast("El campo nombre es obligatorio.");
            return;
        }

        if (!category) {
            showToast("Debes seleccionar una categoría.");
            return;
        }

        if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0)  {
            showToast("El precio debe ser mayor o igual a 0.");
            return;
        }

        if (stock === "" || !Number.isFinite(Number(stock)) || Number(stock) < 0) {
            showToast("El stock debe ser mayor o igual a 0.");
            return;
        }

        try {
            /**
             * Actualizar sneaker existente.
             */
            if (editID !== null) {
                await updateSneaker(editID, {
                    name,
                    description,
                    category,
                    price,
                    stock,
                    image
                });

                showToast("Cambios guardados", "success");
            } else {
                /**
                 * Crear nuevo sneaker.
                 */
                await createSneaker({
                    name,
                    description,
                    category,
                    price,
                    stock,
                    image
                });

                showToast("Sneaker agregado", "success");
            }

            stopEditing();

            await loadSneakers();
        } catch (err) {
            console.error("Error guardando sneaker:", err);
            showToast(err.message);
        }
    });
}

/**
 * Carga los sneakers desde el backend.
 */
async function loadSneakers() {
    if (!tableBody) return;

    try {
        const sneakers = await getAllSneakers();

        renderSneakers(
            sneakers,
            tableBody
        );
    } catch (err) {
        console.error("Error cargando lista:", err);
        showToast(err.message);
    }
}

loadSneakers();