export function renderSneakers(sneakers, tableBody) {
    tableBody.innerHTML = "";
    sneakers.forEach(sneaker => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sneaker.id}</td>
            <td>${sneaker.name}</td>
            <td>${sneaker.description || ""}</td>
            <td>${sneaker.category}</td>
            <td>${sneaker.stock}</td>
            <td>${sneaker.image}</td>
            <td>
                <button class="btn-edit" data-id="${sneaker.id}">Editar</button>
                <button class="btn-delete" data-id="${sneaker.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

export function resetForm(form, submitBtn) {
    form.reset();
    if (submitBtn) submitBtn.textContent = "Agregar";
}

export function fillForm(form, sneaker, submitBtn) {
    form.querySelector("#name").value = sneaker.name;
    form.querySelector("#description").value = sneaker.description || "";
    form.querySelector("#category").value = sneaker.category;
    form.querySelector("#price").value = sneaker.price;
    form.querySelector("#stock").value = sneaker.stock;
    form.querySelector("#image").value = sneaker.image;
    if (submitBtn) submitBtn.textContent = "Guardar cambios";
}