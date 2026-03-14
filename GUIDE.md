# 📘 How to Add & Edit Questions

This guide explains how to add new questions, edit existing ones, and manage figure images for the OS Course Review website.

---

## 📁 Where Are the Questions?

All questions live in JavaScript files inside:

```
js/questions/
├── ch01.js
├── ch02.js
├── ch03.js
├── ...
└── ch10.js
```

Each file corresponds to one chapter. Open the file for the chapter you want to edit.

---

## 🆔 Question ID Format

Every question needs a **unique ID**. Follow this pattern:

```
ch{NN}_{type}_{NNN}
```

- `NN` — Chapter number, zero-padded (01, 02, ... 10)
- `type` — One of: `mcq`, `tf`, `list`, `define`, `fill`
- `NNN` — Sequential number, zero-padded (001, 002, 003, ...)

**Examples:**
- `ch01_mcq_001`
- `ch05_tf_003`
- `ch10_list_012`

> ⚠️ IDs must be unique across the entire project. If two questions share the same ID, things will break.

---

## 📝 Question Types & Templates

### MCQ (Multiple Choice)

```js
{
  id: 'ch01_mcq_001',
  chapter: 1,
  source: 'testbank',
  type: 'mcq',
  question: 'What is the main purpose of an operating system?',
  choices: [
    'To manage hardware resources and provide services to applications',
    'To compile programs',
    'To browse the internet',
    'To design user interfaces',
  ],
  answer: 0,
  hint: 'The OS acts as a resource manager and provides an environment for programs to run.',
  figure: null,
},
```

- `choices` — An array of 4, 5, or 6 options (as many as you want)
- `answer` — The **index** of the correct choice (starts at 0)
  - `0` = first choice, `1` = second, `2` = third, etc.
- `hint` — A string explaining the answer (shown after answering). Set to `null` if not needed

---

### True / False

```js
{
  id: 'ch01_tf_001',
  chapter: 1,
  source: 'testbank',
  type: 'tf',
  question: 'The operating system is the first program loaded into memory when a computer starts.',
  choices: ['True', 'False'],
  answer: 0,
  hint: 'The bootstrap program loads the OS kernel into memory during startup.',
  figure: null,
},
```

- `choices` — Always `['True', 'False']`
- `answer` — `0` for True, `1` for False
- `hint` — A string explaining the answer (shown after answering). Set to `null` if not needed

---

### List

```js
{
  id: 'ch01_list_001',
  chapter: 1,
  source: 'student',
  type: 'list',
  question: 'List the four main components of a computer system.',
  choices: null,
  answer: [
    'Hardware',
    'Operating System',
    'Application Programs',
    'Users',
  ],
  figure: null,
},
```

- `choices` — Always `null`
- `answer` — An **array of strings** (the list items)

---

### Define

```js
{
  id: 'ch01_define_001',
  chapter: 1,
  source: 'student',
  type: 'define',
  question: 'Define the term "Operating System".',
  choices: null,
  answer: 'An operating system is system software that manages computer hardware and software resources.',
  figure: null,
},
```

- `choices` — Always `null`
- `answer` — A **string** with the definition

---

### Fill in the Blank

```js
{
  id: 'ch01_fill_001',
  chapter: 1,
  source: 'testbank',
  type: 'fill',
  question: 'The ________ is the one program running at all times on the computer.',
  choices: null,
  answer: 'operating system',
  figure: null,
},
```

- `choices` — Always `null`
- `answer` — A **string** with the correct word(s)
- Use `________` in the question to show where the blank is

---

## 🖼️ Adding a Figure (Image) to Any Question

Any question type can include an image. Just:

1. Put your image file in the `images/` folder
2. Set the `figure` field to the path

```js
{
  id: 'ch03_mcq_005',
  chapter: 3,
  source: 'testbank',
  type: 'mcq',
  question: 'Based on the diagram above, what type of scheduling is shown?',
  choices: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
  answer: 2,
  figure: 'images/ch03_scheduling_diagram.png',
},
```

> The image will appear above the question text.

**Image naming suggestion:** `ch{NN}_description.png` (e.g., `ch03_scheduling_diagram.png`)

---

## ✏️ How to Edit an Existing Question

1. Open the chapter file (e.g., `js/questions/ch01.js`)
2. Find the question by its `id`
3. Change whatever you need (question text, choices, answer, etc.)
4. Save the file — that's it

---

## ➕ How to Add a New Question

1. Open the chapter file (e.g., `js/questions/ch05.js`)
2. Find the array (e.g., `const ch05 = [...]`)
3. Add your new question object inside the array
4. Make sure the `id` is unique and follows the naming convention
5. Make sure you have a comma after the closing `}` of the previous question
6. Save the file

**Example — adding a question to ch05.js:**

```js
const ch05 = [
  // ... existing questions ...

  {
    id: 'ch05_mcq_010',
    chapter: 5,
    source: 'student',
    type: 'mcq',
    question: 'Your new question goes here?',
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 1,
    figure: null,
  },
];
```

---

## 📋 Field Reference

| Field      | Required | Type                  | Description                                            |
|------------|----------|-----------------------|--------------------------------------------------------|
| `id`       | ✅       | `string`              | Unique ID (see format above)                           |
| `chapter`  | ✅       | `number`              | Chapter number (1–10)                                  |
| `source`   | ✅       | `string`              | `'testbank'` or `'student'`                            |
| `type`     | ✅       | `string`              | `'mcq'`, `'tf'`, `'list'`, `'define'`, or `'fill'`     |
| `question` | ✅       | `string`              | The question text                                      |
| `choices`  | ✅       | `array` or `null`     | Array of strings for mcq/tf, `null` for others         |
| `answer`   | ✅       | `number/string/array` | Correct answer (see type-specific notes above)         |
| `hint`     | ❌       | `string` or `null`    | Explanation shown after answering (mcq/tf only)        |
| `figure`   | ✅       | `string` or `null`    | Path to image (e.g., `'images/fig.png'`) or `null`     |

---

## ⚠️ Common Mistakes

| Mistake                              | Fix                                                    |
|--------------------------------------|--------------------------------------------------------|
| Forgot comma between questions       | Add a `,` after each `}`                               |
| Duplicate question ID                | Make sure every `id` is unique                         |
| Wrong answer index                   | Remember: `0` = first choice, `1` = second, etc.      |
| Forgot `choices: null` for list/fill | Non-choice types must have `choices: null`             |
| Image not showing                    | Check the path in `figure` matches the actual filename |

---

## 🧪 Testing Locally

Just open `index.html` in your browser — no server needed. If you want a local server:

```bash
# From the project root
python3 -m http.server 8000
# Then open http://localhost:8000
```

---

## 🗂️ Adding a New Chapter (Ch 11+)

If you ever need more than 10 chapters:

1. Create `js/questions/ch11.js` — copy any existing chapter file as a template
2. Open `index.html` and add before the `storage.js` script tag:
   ```html
   <script src="js/questions/ch11.js"></script>
   ```
3. Open `js/app.js` and change `TOTAL_CHAPTERS = 10` to `TOTAL_CHAPTERS = 11`
