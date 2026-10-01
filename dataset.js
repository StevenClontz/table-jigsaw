// Shared by index.html (the game) and instructor.html (the designer)

const SAMPLE_DATASET = {
    title: "World Capitals",
    instructions: "Drag and drop the answer options to fill in the blanks.",
    columns: [
        { key: "country", label: "Country", width: "25%", group: true },
        { key: "continent", label: "Continent", width: "20%", group: true, reusable: true },
        { key: "city", label: "City", width: "25%" },
        { key: "role", label: "Role", width: "30%", reusable: true }
    ],
    rows: [
        { country: "France", continent: "Europe", city: "Paris", role: "Capital" },
        {
            country: "South Africa", continent: "Africa",
            subrows: [
                { city: "Pretoria", role: "Executive capital" },
                { city: "Cape Town", role: "Legislative capital" },
                { city: "Bloemfontein", role: "Judicial capital" }
            ]
        },
        { country: "Japan", continent: "Asia", city: "Tokyo", role: "Capital" },
        {
            country: "Bolivia", continent: "South America",
            subrows: [
                { city: "Sucre", role: "Constitutional capital" },
                { city: "La Paz", role: "Seat of government" }
            ]
        },
        { country: "Kenya", continent: "Africa", city: "Nairobi", role: "Capital" },
        { country: "Canada", continent: "North America", city: "Ottawa", role: "Capital" },
        {
            country: "Netherlands", continent: "Europe",
            subrows: [
                { city: "Amsterdam", role: "Constitutional capital" },
                { city: "The Hague", role: "Seat of government" }
            ]
        },
        { country: "Australia", continent: "Oceania", city: "Canberra", role: "Capital" }
    ]
};

const STORAGE_KEY = 'tableJigsaw.dataset';

function validateDataset(ds) {
    if (!ds || typeof ds !== 'object' || Array.isArray(ds)) {
        throw new Error('The JSON must be an object with "columns" and "rows".');
    }
    if (!Array.isArray(ds.columns) || ds.columns.length === 0) {
        throw new Error('"columns" must be a non-empty array.');
    }
    const keys = new Set();
    ds.columns.forEach((col, i) => {
        if (!col || typeof col.key !== 'string' || !col.key) {
            throw new Error(`Column ${i + 1} needs a string "key".`);
        }
        if (keys.has(col.key)) {
            throw new Error(`Duplicate column key "${col.key}".`);
        }
        keys.add(col.key);
    });
    if (!Array.isArray(ds.rows) || ds.rows.length === 0) {
        throw new Error('"rows" must be a non-empty array.');
    }
    const checkValue = (value, where) => {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'number') {
            throw new Error(`${where} must be a string or number.`);
        }
    };
    ds.rows.forEach((row, r) => {
        if (!row || typeof row !== 'object') {
            throw new Error(`Row ${r + 1} must be an object.`);
        }
        if (row.subrows !== undefined && (!Array.isArray(row.subrows) || row.subrows.length === 0)) {
            throw new Error(`Row ${r + 1}: "subrows" must be a non-empty array.`);
        }
        ds.columns.forEach(col => {
            if (col.group || !row.subrows) {
                checkValue(row[col.key], `Row ${r + 1}, column "${col.key}"`);
            } else {
                row.subrows.forEach((sub, s) => {
                    checkValue(sub && sub[col.key], `Row ${r + 1}, subrow ${s + 1}, column "${col.key}"`);
                });
            }
        });
    });
    return ds;
}

function downloadJSON(obj, title) {
    const json = JSON.stringify(obj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = (title || 'table-jigsaw').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'table-jigsaw';
    a.href = url;
    a.download = `${slug}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
