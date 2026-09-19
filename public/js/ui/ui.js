/**
 * Escapa texto antes de meterlo en el HTML. Sin esto, un sneaker llamado <img src=x onerror=alert(1)> ejecutaría código.
 * Regla: nunca inyectes datos del usuario sin escapar.
 */
function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]
    );
}

export function renderSneakers(sneakers, tableBody) {
    if (sneakers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-10 text-center text-sm text-slate-400">
                    Todavía no hay sneakers. Agrega el primero con el formulario de arriba.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = sneakers
        .map(
            (sneaker) => `
            <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-mono text-xs text-slate-400">${sneaker.id}</td>
                <td class="px-4 py-3 font-medium">${escapeHtml(sneaker.name)}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(sneaker.description) || "—"}</td>
                <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                        <button class="btn btn-ghost !px-3 !py-1.5 text-xs btn-edit" data-id="${sneaker.id}">
                            Editar
                        </button>
                        <button class="btn btn-danger !px-3 !py-1.5 text-xs btn-delete" data-id="${sneaker.id}">
                            Eliminar
                        </button>
                    </div>
                </td>
            </tr>`
        )
        .join("");
}

export function resetForm(form, submitBtn, cancelBtn) {
    form.reset();
    if (submitBtn) submitBtn.textContent = "Agregar";
    if (cancelBtn) cancelBtn.hidden = true;
}

export function fillForm(form, sneaker, submitBtn, cancelBtn) {
    form.querySelector("#name").value = sneaker.name;
    form.querySelector("#description").value = sneaker.description || "";
    form.querySelector("#category").value = sneaker.category;
    form.querySelector("#price").value = sneaker.price;
    form.querySelector("#stock").value = sneaker.stock;
    form.querySelector("#image").value = sneaker.image;

    if (submitBtn) submitBtn.textContent = "Guardar cambios";
    if (cancelBtn) cancelBtn.hidden = false;
}

/**
 * Aviso flotante que reemplaza los alert(). No bloquea la página y se ve como una app de verdad.
 */
export function showToast(message, type = "error") {
    const colors = {
        error: "bg-red-600",
        success: "bg-emerald-600"
    };

    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm
        font-medium text-white shadow-lg transition-opacity ${colors[type]}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "0"), 2200);
    setTimeout(() => toast.remove(), 2600);
}