# OverFlow

**OverFlow: Flood Simulation and Satellite-Derived Flood Information for Scenario-Based Evacuation Planning in Laoag City** is a BS Information Technology capstone project. It aims to help disaster planners compare evacuation scenarios involving flood conditions, road access, expected evacuees, and evacuation-area capacity.

SFINCS is the selected flood-scenario method, but its Laoag results are not yet locally validated. The working demo uses synthetic geography and a separate illustrative runoff model; its outputs are for demonstration, not operational decisions.

## Run the demo

You need Python 3 and Node.js 22.13.0 or later. From the repository root, install dependencies while online, then start the local API and frontend:

```bash
./scripts/setup-demo.sh
./scripts/start-demo.sh
```

Open the frontend address printed in the terminal. The API runs at `127.0.0.1:8000`. The frontend lives in `sentinel-demo/`, an existing workspace path; the product name is OverFlow. See [demo-api/README.md](demo-api/README.md) for demo assumptions.

## Work on the manuscript

Edit the BSIT chapters in [`latex-template-ccis-paper-v2/chapters/bsit/`](latex-template-ccis-paper-v2/chapters/bsit/) and metadata in [`main.tex`](latex-template-ccis-paper-v2/main.tex). From the template directory, rebuild the tracked `main.pdf` after changes:

```bash
pdflatex main
biber main
pdflatex main
pdflatex main
```

## Project references

- [Capstone definition](knowledge/00-capstone-definition.md): confirmed scope and open questions.
- [Current decisions](knowledge/decisions.md): active design choices.
- [Manuscript map](knowledge/manuscript-outline.md): chapter scope and source links.
- [Data status](knowledge/data/00-data-sources.md): available files, missing inputs, and access checks.
- [SFINCS pilot plan](knowledge/02-sfincs-pilot-plan.md): model work and validation gates.

Keep manuscript and implementation claims aligned with these references. Raw City Hall files under `data/` are local and ignored by Git because redistribution rights have not been confirmed. Keep generated outputs under `output/`, which is also ignored.
