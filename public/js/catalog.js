import { getAllSneakers, getSneaker } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const detailModal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModal");

//Elementos del modal para mostrar los detalles del sneaker
const modalName = document.getElementById("modalName");
const modalImg = document.getElementById("modalImg");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");

//Cargar y renderizar las tarjetas del catálogo dinámicamente
async function loadCatalog() {
    try {
        const sneakers = await getAllSneakers();
        renderCatalogCards(sneakers);
    } catch (err) {
        console.error("Error cargando el catálogo:", err);
        alert("No se pudieron cargar los sneakers del catálogo.");
    }
}

//Función para pintar las tarjetas en el DOM
function renderCatalogCards(sneakers) {
    catalogContainer.innerHTML = "";
    
    sneakers.forEach(sneaker => {
        const card = document.createElement("div");
        card.className = "sneaker-card";
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${sneaker.image}" alt="${sneaker.name}">
            </div>
            <div class="card-content">
                <span class="card-category">${sneaker.category}</span>
                <h3>${sneaker.name}</h3>
                <p class="card-price">$ ${sneaker.price}</p>
                <button class="btn-detail" data-id="${sneaker.id}">Ver Detalle</button>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

//Evento de delegación para abrir el modal al hacer clic en "Ver Detalle"
catalogContainer.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if(!btn || !btn.classList.contains("btn-detail")) return;

    const id = Number(btn.dataset.id);

    try {
        const sneaker = await getSneaker(id);
        
        //Rellenar el modal con la información del sneaker consultado por ID
        modalName.textContent = sneaker.name;
        modalImg.src = sneaker.image;
        modalCategory.textContent = `Categoría: ${sneaker.category}`;
        modalDescription.textContent = sneaker.description;
        modalPrice.textContent = `Precio: $ ${sneaker.price}`;
        modalStock.textContent = `Stock disponible: ${sneaker.stock}`;

        // Mostrar el modal
        detailModal.style.display = "flex";
    } catch (err) {
        console.error("Error cargando detalle del sneaker:", err);
        alert("No se pudo cargar la información detallada.");
    }
});

//Eventos para cerrar el modal
closeModalBtn.addEventListener("click", () => {
    detailModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === detailModal) {
        detailModal.style.display = "none";
    }
});

loadCatalog();