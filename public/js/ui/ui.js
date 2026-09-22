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
 * Renderiza el estado de carga del catálogo.
 */
export function renderCatalogLoading(catalogContainer) {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = `
        <div class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div class="card animate-pulse">
                <div class="card-image-wrapper"></div>
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-4 h-7 w-28 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-5 h-10 w-full rounded-2xl bg-gray-200 dark:bg-zinc-800"></div>
            </div>

            <div class="card animate-pulse hidden sm:flex">
                <div class="card-image-wrapper"></div>
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-4 h-7 w-28 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-5 h-10 w-full rounded-2xl bg-gray-200 dark:bg-zinc-800"></div>
            </div>

            <div class="card animate-pulse hidden lg:flex">
                <div class="card-image-wrapper"></div>
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-4 h-7 w-28 rounded bg-gray-200 dark:bg-zinc-800"></div>
                <div class="mt-5 h-10 w-full rounded-2xl bg-gray-200 dark:bg-zinc-800"></div>
            </div>

        </div>
    `;
}

/**
 * Renderiza el estado de catálogo vacío.
 * Se muestra cuando no existen sneakers en el backend.
 */
export function renderCatalogEmpty(catalogContainer) {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="text-5xl mb-4">👟</div>

            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                No hay sneakers disponibles
            </h2>

            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Todavía no hay productos registrados en el catálogo.
            </p>
        </div>
    `;
}

/**
 * Renderiza el estado de búsqueda sin resultados.
 */
export function renderCatalogNoResults(catalogContainer) {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="text-5xl mb-4">🔎</div>

            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                No hay resultados
            </h2>

            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No encontramos sneakers que coincidan con tu búsqueda o filtros.
            </p>
        </div>
    `;
}

/**
 * Renderiza el estado de error.
 */
export function renderCatalogError(catalogContainer) {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="text-5xl mb-4">⚠️</div>

            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                No se pudo cargar el catálogo
            </h2>

            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Ocurrió un problema al obtener los sneakers. Intenta nuevamente.
            </p>
        </div>
    `;
}

/**
 * Renderiza las tarjetas del catálogo.
 */
export function renderCatalogCards(sneakers, catalogContainer) {
    if (!catalogContainer) return;

    if (sneakers.length === 0) {
        renderCatalogEmpty(catalogContainer);
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

export function fillForm(form, sneaker, submitBtn, cancelBtn) {
    form.querySelector("#name").value = sneaker.name ?? "";
    form.querySelector("#description").value = sneaker.description ?? "";
    form.querySelector("#category").value = sneaker.category ?? "";
    form.querySelector("#price").value = sneaker.price ?? "";
    form.querySelector("#stock").value = sneaker.stock ?? "";
    form.querySelector("#image").value = sneaker.image ?? "";

    if (submitBtn) submitBtn.textContent = "Guardar cambios";
    if (cancelBtn) cancelBtn.hidden = false;
}

export function resetForm(form, submitBtn, cancelBtn) {
    form.reset();

    if (submitBtn) {
        submitBtn.textContent = "Agregar";
    }

    if (cancelBtn) {
        cancelBtn.hidden = true;
    }
}

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