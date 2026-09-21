import { getAllSneakers, getSneaker } from "./services/api.js";
import { renderCatalogCards, showToast } from "./ui/ui.js";

const catalogContainer = document.getElementById("catalogContainer");
const detailModal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModal");
const offlineBanner = document.getElementById("offlineBanner");

const modalName = document.getElementById("modalName");
const modalImg = document.getElementById("modalImg");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");

/**
 * Actualiza el aviso de conexión.
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

/**
 * Carga los sneakers y delega el render a ui.js.
 */
async function loadCatalog() {
    try {
        const sneakers = await getAllSneakers();
        renderCatalogCards(sneakers, catalogContainer);
    } catch (err) {
        console.error("Error cargando el catálogo:", err);

        if (offlineBanner) {
            offlineBanner.classList.remove("hidden");
        }

        showToast(
            "No se pudo cargar el catálogo. Mostrando los datos disponibles."
        );
    }
}

/**
 * Abre el modal con el detalle de un sneaker.
 */
async function openSneakerDetail(id) {
    try {
        const sneaker = await getSneaker(id);

        modalName.textContent = sneaker.name ?? "Sin nombre";
        modalImg.src = sneaker.image ?? "";
        modalImg.alt = sneaker.name ?? "Sneaker";

        modalCategory.textContent = `Categoría: ${sneaker.category ?? "Sin categoría"}`;
        modalDescription.textContent =
            sneaker.description ?? "Sin descripción";
        modalPrice.textContent = `Precio: $ ${sneaker.price ?? 0}`;
        modalStock.textContent = `Stock disponible: ${sneaker.stock ?? 0}`;

        detailModal.classList.remove("hidden");
        detailModal.style.display = "flex";
    } catch (err) {
        console.error("Error cargando detalle del sneaker:", err);
        showToast("No se pudo cargar la información detallada.");
    }
}

/**
 * Cierra el modal.
 */
function closeModal() {
    if (!detailModal) return;

    detailModal.classList.add("hidden");
    detailModal.style.display = "none";
}

if (catalogContainer) {
    catalogContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".btn-detail");

        if (!button) return;

        const id = Number(button.dataset.id);

        if (!Number.isInteger(id)) {
            showToast("Identificador de sneaker inválido.");
            return;
        }

        openSneakerDetail(id);
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}

if (detailModal) {
    detailModal.addEventListener("click", (event) => {
        if (event.target === detailModal) {
            closeModal();
        }
    });
}

updateOnlineStatus();
loadCatalog();