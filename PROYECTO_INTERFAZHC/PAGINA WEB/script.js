const cards = document.querySelectorAll('.card');
const categories = document.querySelectorAll('.category');
const submitButton = document.getElementById('submit-button');
let draggedCard = null;
let classifications = {};

// Inicializar categorías vacías
categories.forEach(category => {
    classifications[category.dataset.category] = [];
});

// Evento para arrastrar tarjetas
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        setTimeout(() => card.classList.add('hidden'), 0);
    });

    card.addEventListener('dragend', () => {
        draggedCard.classList.remove('hidden');
        draggedCard = null;
    });
});

// Permitir "drop" en categorías
categories.forEach(category => {
    category.addEventListener('dragover', (e) => e.preventDefault());

    category.addEventListener('dragenter', () => {
        category.classList.add('hovered');
    });

    category.addEventListener('dragleave', () => {
        category.classList.remove('hovered');
    });

    category.addEventListener('drop', () => {
        category.classList.remove('hovered');
        if (draggedCard) {
            category.appendChild(draggedCard);

            const categoryName = category.dataset.category;
            const cardName = draggedCard.dataset.name;

            // Actualizar clasificaciones
            if (!classifications[categoryName].includes(cardName)) {
                classifications[categoryName].push(cardName);
            }
        }
    });
});

// Descargar clasificaciones como archivo Excel
submitButton.addEventListener('click', () => {
    // Verificar si hay clasificaciones antes de generar el archivo
    if (Object.keys(classifications).length === 0) {
        alert("Por favor clasifica todas las imágenes.");
        return;
    }

    const workbook = XLSX.utils.book_new();
    const data = [];

    // Crear la lista de clasificaciones
    for (const category in classifications) {
        classifications[category].forEach(item => {
            data.push({ "Categoría": category, "Imagen": item });
        });
    }

    // Convertir los datos a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clasificaciones");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "clasificaciones.xlsx");
});
