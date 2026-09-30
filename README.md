# bhoomika-netraone-c4isr-dashboard
# Netra-One C4ISR — Tactical Dashboard + Vehicle Data Pipeline

## Dashboard (React + Vite + Tailwind)
```bash
cd dashboard && npm install && npm run dev
```
Features: 4-camera grid (simulated 30 FPS canvas feeds, ONLINE/STANDBY status, live timestamp), live alert feed (CRITICAL/WARNING/INFO) with camera / vehicle-class / severity filters, analytics cards, and a **Dataset Ingestion Telemetry** tab that renders the pipeline JSON.

_Add screenshots here: `docs/ops.png`, `docs/telemetry.png`_

## Pipeline (Python 3.10+)
```bash
cd data_pipeline && pip install -r requirements.txt
python vehicle_pipeline.py --input raw_images --output curated_dataset
cp sample_output.json ../dashboard/public/sample_output.json
```
Steps: corrupt check (PIL+OpenCV) → blur filter (Laplacian variance < 100) → duplicate filter (dHash, Hamming ≤ 5) → YOLOv8n (COCO car/motorcycle/truck/bus) → sort into `curated_dataset/{car,bike,truck,bus}` → JSON summary. Rejects go to `quarantine/`.

## Integration
Pipeline writes `sample_output.json`; the dashboard reads `/sample_output.json` from `dashboard/public`.
