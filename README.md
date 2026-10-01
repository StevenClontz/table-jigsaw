# Table Jigsaw

A drag-and-drop "fill in the table" study game for any table of data. Open `index.html` in a browser. It runs as a single file with no build step.

- **📂 Load JSON** (or drag a `.json` file onto the page) to use your own table. The last loaded table is remembered in this browser.
- **⬇️ Download JSON** saves the current table, which is handy as a starting template.
- **↩ Sample Data** restores the built-in example.

## JSON format

Only `columns` and `rows` are required.

```json
{
  "title": "Spanish Verbs",
  "columns": [
    { "key": "spanish", "label": "Spanish" },
    { "key": "english", "label": "English" }
  ],
  "rows": [
    { "spanish": "hablar", "english": "to speak" },
    { "spanish": "comer", "english": "to eat" },
    { "spanish": "vivir", "english": "to live" }
  ]
}
```

### Top-level fields

| Field          | Required | Description |
| -------------- | -------- | ----------- |
| `title`        | no       | Page heading and browser tab title. |
| `instructions` | no       | Text shown under the title. |
| `source`       | no       | Citation shown at the bottom of the page (plain text). |
| `columns`      | yes      | Array of column definitions (see below). |
| `rows`         | yes      | Array of row objects, keyed by column `key`. Values are strings or numbers; `\n` makes a line break. |
| `difficulty`   | no       | Overrides how many blanks each level creates, e.g. `{ "easy": { "min": 3, "max": 5 } }`. Values ≤ 1 are fractions of the fillable cells; the defaults are easy 15–25%, medium 30–40%, hard 50–60%, expert 70–80%. |

### Column fields

| Field      | Description |
| ---------- | ----------- |
| `key`      | Required, unique. The property name used in each row. |
| `label`    | Header text (defaults to `key`). |
| `width`    | CSS width, e.g. `"25%"`. |
| `align`    | CSS text alignment, e.g. `"center"`. |
| `group`    | If `true`, the value lives on the row and spans all of the row's `subrows`. |
| `reusable` | If `true`, the same answer may fill several blanks (e.g. a category like "Europe"), so its answer chip can be used more than once. |

### Grouped rows

A row can contain `subrows`. Its `group` columns are then shown once, spanning the sub-rows, and the other columns are read from each sub-row:

```json
{
  "columns": [
    { "key": "country", "label": "Country", "group": true },
    { "key": "city", "label": "City" },
    { "key": "role", "label": "Role", "reusable": true }
  ],
  "rows": [
    { "country": "France", "city": "Paris", "role": "Capital" },
    { "country": "South Africa", "subrows": [
        { "city": "Pretoria", "role": "Executive capital" },
        { "city": "Cape Town", "role": "Legislative capital" }
    ] }
  ]
}
```
