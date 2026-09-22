import { getAllSneakers, getSneaker } from "./services/api.js";

import {
    renderCatalogCards,
    renderCatalogLoading,
    renderCatalogEmpty,
    renderCatalogNoResults,
    renderCatalogError,
    showToast
} from "./ui/ui.js";

const catalogContainer = document.getElementById("catalogContainer");
const detailModal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModal");
const offlineBanner = document.getElementById("offlineBanner");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

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

/**
 * Verifica si existe algún filtro activo.
 */
function hasActiveFilters() {
    return Boolean(
        searchInput?.value.trim() ||
        categoryFilter?.value 
    );
}

/**
 * Carga los sneakers aplicando los filtros actuales.
 */
async function loadCatalog() {
    renderCatalogLoading(catalogContainer);

    try {
        const sneakers = await getAllSneakers({
            q: searchInput?.value ?? "",
            category: categoryFilter?.value ?? "",
            sort: sortFilter?.value ?? ""
        });

        if (sneakers.length === 0) {
            if (hasActiveFilters()) {
                renderCatalogNoResults(catalogContainer);
            } else {
                renderCatalogEmpty(catalogContainer);
            }

            return;
        }

        renderCatalogCards(
            sneakers,
            catalogContainer
        );
    } catch (err) {
        console.error("Error cargando el catálogo:", err);

        renderCatalogError(catalogContainer);

        if (offlineBanner) {
            offlineBanner.classList.remove("hidden");
        }

        showToast(
            "No se pudo cargar el catálogo."
        );
    }
}

/**
 * Abre el modal con el detalle de un sneaker.
 */
async function openSneakerDetail(id) {
    try {
        const sneaker = await getSneaker(id);

        modalName.textContent =
            sneaker.name ?? "Sin nombre";

        modalImg.src =
            sneaker.image ?? "";

        modalImg.alt =
            sneaker.name ?? "Sneaker";

        modalCategory.textContent =
            `Categoría: ${sneaker.category ?? "Sin categoría"}`;

        modalDescription.textContent =
            sneaker.description ?? "Sin descripción";

        modalPrice.textContent =
            `Precio: $ ${sneaker.price ?? 0}`;

        modalStock.textContent =
            `Stock disponible: ${sneaker.stock ?? 0}`;

        detailModal.classList.remove("hidden");
        detailModal.style.display = "flex";
    } catch (err) {
        console.error(
            "Error cargando detalle del sneaker:",
            err
        );

        showToast(
            "No se pudo cargar la información detallada."
        );
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

/**
 * Recarga el catálogo cuando cambia cualquier filtro.
 */
function handleFiltersChange() {
    loadCatalog();
}

/**
 * Eventos de búsqueda y filtros.
 */
if (searchInput) {
    searchInput.addEventListener(
        "input",
        handleFiltersChange
    );
}

if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        handleFiltersChange
    );
}

if (sortFilter) {
    sortFilter.addEventListener(
        "change",
        handleFiltersChange
    );
}

/**
 * Evento para abrir el detalle de un sneaker.
 */
if (catalogContainer) {
    catalogContainer.addEventListener(
        "click",
        (event) => {
            const button =
                event.target.closest(".btn-detail");

            if (!button) return;

            const id = Number(button.dataset.id);

            if (!Number.isInteger(id)) {
                showToast(
                    "Identificador de sneaker inválido."
                );
                return;
            }

            openSneakerDetail(id);
        }
    );
}

/**
 * Evento para cerrar el modal.
 */
if (closeModalBtn) {
    closeModalBtn.addEventListener(
        "click",
        closeModal
    );
}

/**
 * Cierra el modal al hacer clic fuera de su contenido.
 */
if (detailModal) {
    detailModal.addEventListener(
        "click",
        (event) => {
            if (event.target === detailModal) {
                closeModal();
            }
        }
    );
}

window.addEventListener(
    "online",
    updateOnlineStatus
);

window.addEventListener(
    "offline",
    updateOnlineStatus
);

updateOnlineStatus();

loadCatalog();