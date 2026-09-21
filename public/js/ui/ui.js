/**
 * Escapa texto antes de insertarlo en HTML.
 * Evita que datos provenientes del usuario o de la API
 * sean interpretados como código HTML.
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

/**
 * Renderiza la tabla de gestión de sneakers.
 */
export function renderSneakers(sneakers, tableBody) {
    if (!tableBody) return;

    if (sneakers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-4 py-10 text-center text-sm text-slate-400 dark:text-zinc-500">
                    Todavía no hay sneakers. Agrega el primero con el formulario de arriba.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = sneakers
        .map(
            (sneaker) => `
                <tr class="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                    <td class="px-4 py-3 font-mono text-xs text-gray-400">
                        ${escapeHtml(sneaker.id)}
                    </td>

                    <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        ${escapeHtml(sneaker.name)}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        ${escapeHtml(sneaker.description) || "—"}
                    </td>

                    <td class="px-4 py-3">
                        <span class="badge">
                            ${escapeHtml(sneaker.category) || "—"}
                        </span>
                    </td>

                    <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        $ ${escapeHtml(sneaker.price)}
                    </td>

                    <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
                        ${escapeHtml(sneaker.stock)}
                    </td>

                    <td class="px-4 py-3">
                        ${
                            sneaker.image
                                ? `
                                    <a
                                        href="${escapeHtml(sneaker.image)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-orange-500 hover:text-orange-400 hover:underline text-sm"
                                    >
                                        Ver imagen
                                    </a>
                                `
                                : "—"
                        }
                    </td>

                    <td class="px-4 py-3">
                        <div class="flex justify-end gap-2">
                            <button
                                type="button"
                                class="btn btn-outline !px-3 !py-1.5 text-xs btn-edit"
                                data-id="${escapeHtml(sneaker.id)}"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn !px-3 !py-1.5 text-xs bg-red-600 text-white hover:bg-red-500 btn-delete"
                                data-id="${escapeHtml(sneaker.id)}"
                            >
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `
        )
        .join("");
}

/**
 * Renderiza las tarjetas del catálogo.
 */
export function renderCatalogCards(sneakers, catalogContainer) {
    if (!catalogContainer) return;

    if (sneakers.length === 0) {
        catalogContainer.innerHTML = `
            <div class="col-span-full py-12 text-center">
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    No hay sneakers disponibles.
                </p>

                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Prueba con otros filtros o términos de búsqueda.
                </p>
            </div>
        `;
        return;
    }

    catalogContainer.innerHTML = sneakers
        .map(
            (sneaker) => `
                <article class="card">
                    <div>
                        <div class="card-image-wrapper">
                            ${
                                sneaker.image
                                    ? `
                                        <img
                                            src="${escapeHtml(sneaker.image)}"
                                            alt="${escapeHtml(sneaker.name)}"
                                            loading="lazy"
                                        >
                                    `
                                    : `
                                        <div class="flex h-full items-center justify-center text-sm text-gray-400">
                                            Sin imagen
                                        </div>
                                    `
                            }
                        </div>

                        <span class="badge">
                            ${escapeHtml(sneaker.category) || "Sin categoría"}
                        </span>

                        <h3 class="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            ${escapeHtml(sneaker.name)}
                        </h3>

                        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            ${escapeHtml(sneaker.description) || "Sin descripción"}
                        </p>

                        <p class="mt-4 text-xl font-bold text-orange-500">
                            $ ${escapeHtml(sneaker.price)}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="btn btn-primary mt-5 w-full btn-detail"
                        data-id="${escapeHtml(sneaker.id)}"
                    >
                        Ver detalle
                    </button>
                </article>
            `
        )
        .join("");
}

/**
 * Rellena el formulario con los datos del sneaker seleccionado.
 */
export function fillForm(form, sneaker, submitBtn, cancelBtn) {
    form.querySelector("#name").value = sneaker.name ?? "";
    form.querySelector("#description").value = sneaker.description ?? "";
    form.querySelector("#category").value = sneaker.category ?? "";
    form.querySelector("#price").value = sneaker.price ?? "";
    form.querySelector("#stock").value = sneaker.stock ?? "";
    form.querySelector("#image").value = sneaker.image ?? "";

    if (submitBtn) {
        submitBtn.textContent = "Guardar cambios";
    }

    if (cancelBtn) {
        cancelBtn.hidden = false;
    }
}

/**
 * Limpia el formulario y devuelve el botón al estado inicial.
 */
export function resetForm(form, submitBtn, cancelBtn) {
    form.reset();

    if (submitBtn) {
        submitBtn.textContent = "Agregar";
    }

    if (cancelBtn) {
        cancelBtn.hidden = true;
    }
}

/**
 * Muestra un aviso flotante.
 * Reemplaza los alert() del navegador.
 */
export function showToast(message, type = "error") {
    const colors = {
        error: "bg-red-600",
        success: "bg-emerald-600"
    };

    const toast = document.createElement("div");

    toast.className = `
        fixed bottom-5 left-1/2 z-50
        -translate-x-1/2
        rounded-lg
        px-4 py-2
        text-sm
        font-medium
        text-white
        shadow-lg
        transition-opacity
        ${colors[type] ?? colors.error}
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2200);

    setTimeout(() => {
        toast.remove();
    }, 2600);
}