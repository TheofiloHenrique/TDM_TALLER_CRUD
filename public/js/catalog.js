import { getAllSneakers, getSneaker } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const detailModal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModal");

// Elementos del modal para mostrar los detalles del sneaker
const modalName = document.getElementById("modalName");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");

// Cargar y renderizar las tarjetas del catálogo dinámicamente
async function loadCatalog() {
    try {
        const items = await getAllSneakers();
        renderCatalogCards(items);
    } catch (err) {
        console.error("Error cargando el catálogo:", err);
        alert("No se pudieron cargar los sneakers del catálogo.");
    }
}

// Función para pintar las tarjetas en el DOM
function renderCatalogCards(items) {
    catalogContainer.innerHTML = "";
    
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-content">
                <span class="card-category">${item.category}</span>
                <h3>${item.name}</h3>
                <p class="card-price">$ ${item.price}</p>
                <button class="btn-detail" data-id="${item.id}">Ver Detalle</button>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

// Evento de delegación para abrir el modal al hacer clic en "Ver Detalle"
catalogContainer.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if(!btn || !btn.classList.contains("btn-detail")) return;

    const id = Number(btn.dataset.id);

    try {
        const item = await getSneaker(id);
        
        // Rellenar el modal con la información del sneaker consultado por ID
        modalName.textContent = item.name;
        modalCategory.textContent = `Categoría: ${item.category}`;
        modalDescription.textContent = item.description;
        modalPrice.textContent = `Precio: $ ${item.price}`;
        modalStock.textContent = `Stock disponible: ${item.stock}`;

        // Mostrar el modal
        detailModal.style.display = "flex";
    } catch (err) {
        console.error("Error cargando detalle del sneaker:", err);
        alert("No se pudo cargar la información detallada.");
    }
});

// Eventos para cerrar el modal
closeModalBtn.addEventListener("click", () => {
    detailModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === detailModal) {
        detailModal.style.display = "none";
    }
});

// Inicializar la carga del catálogo al abrir la vista
loadCatalog();