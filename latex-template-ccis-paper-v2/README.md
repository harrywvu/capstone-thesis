Markdown

## CCIS Thesis & Capstone LaTeX Template (v2)


This repository contains the official LaTeX template for undergraduate manuscripts in the **College of Computing and Information Sciences (CCIS)**. It supports both **BS Computer Science (Thesis)** and **BS Information Technology (Capstone Project)** formats.


### ⚠️ Important: Degree Program Setup Rule


Before editing your manuscript, select your degree program in `main.tex`:



```latex
% For BS Computer Science (Thesis):
\documentclass[bscs]{ccispaper}
% For BS Information Technology (Capstone Project):
\documentclass[bsit]{ccispaper}
```



### Strict Folder Rule:

- **If using `[bscs]`:** Edit **ONLY** the files inside `chapters/bscs/`. Do **not** modify files in `chapters/bsit/`.

- **If using `[bsit]`:** Edit **ONLY** the files inside `chapters/bsit/`. Do **not** modify files in `chapters/bscs/`.

The compiler automatically pulls chapter files from your program's specific directory using `\inputchapter{...}`. Editing files outside your assigned folder will not reflect in your output and will cause inconsistencies.

## 📁 Project Structure

```
├── ccispaper.cls                 # CCIS document class definition
├── main.tex                      # Main entry file (metadata, panel, toggles)
├── chapters/
│   ├── bscs/                     # BSCS Thesis chapters (Edit only if using [bscs])
│   │   ├── chapter1.tex          # Background of the Study, Problem Statement, etc.
│   │   ├── chapter2.tex          # Review of Related Literature (Topics 1-4)
│   │   ├── chapter3.tex          # Methodology (Processes 1-5)
│   │   ├── chapter4.tex          # Results
│   │   └── chapter5.tex          # Summary, Conclusions, & Recommendations
│   └── bsit/                     # BSIT Capstone chapters (Edit only if using [bsit])
│       ├── chapter1.tex          # Project Context, Purpose & Description, etc.
│       ├── chapter2.tex          # Related Concepts, Systems, Tech Background
│       ├── chapter3.tex          # Research Design, Instruments, Procedures
│       ├── chapter4.tex          # Results and Discussion
│       └── chapter5.tex          # Summary, Conclusions, & Recommendations
├── sections/                     # Shared front and back matter
│   ├── acknowledgment.tex        # Your acknowledgement page
│   ├── abstract.tex              # Abstract content
│   ├── toc.tex
│   ├── bibliography.tex
│   ├── appendices.tex            # Appendices
│   └── curriculumvitae.tex       # Curriculum Vitae Template
├── references/
│   └── bibliography.bib          # BibLaTeX references
└── graphics/                     # Logos, figures, and CV photos
```

## 🛠️ How to Use

1. **Configure Metadata in `main.tex`:**
- Set your title: `\papertitle{...}`

- List authors: `\paperauthors{AUTHOR A. ONE \\ AUTHOR B. TWO ...}`

- Update submission month, year, adviser, and panel members in `\makeapprovalsheet{...}`.
2. **Fill Front & Back Matter:**
- Edit abstract and acknowledgment in `sections/`.

- Add citations to `references/bibliography.bib`.

- Update your CV entries in `sections/curriculumvitae.tex`.
3. **Write Chapters:**
- Open your designated folder (`chapters/bscs/` or `chapters/bsit/`) and draft your content.

## ⚙️ Compilation Requirements

- **Engine:** `pdfLaTeX`

- **Bibliography Tool:** `Biber` (not BibTeX)

- **Standard Compile Sequence if using CLI:**
  
  ```bash
  $ pdflatex main
  $ biber main
  $ pdflatex main
  $ pdflatex main
  ```
