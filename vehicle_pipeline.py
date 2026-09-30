"""Vehicle Image Filtering & Auto-Labeling Pipeline.
Usage: python vehicle_pipeline.py --input raw_images --output curated_dataset
"""
import argparse, json, shutil
from pathlib import Path
import cv2
from PIL import Image

EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
COCO_TO_LABEL = {2: "car", 3: "bike", 5: "bus", 7: "truck"}  # COCO ids
LABELS = ["car", "bike", "truck", "bus"]


def is_corrupt(path):
    try:
        with Image.open(path) as im:
            im.verify()
        return cv2.imread(str(path)) is None
    except Exception:
        return True


def blur_score(img):
    return cv2.Laplacian(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var()


def dhash(img, size=8):
    g = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (size + 1, size))
    return int("".join("1" if b else "0" for b in (g[:, 1:] > g[:, :-1]).flatten()), 2)


def classify(model, path, conf):
    """Return the highest-confidence vehicle label in the image, or None."""
    best, best_c = None, 0.0
    for box in model(str(path), conf=conf, verbose=False)[0].boxes:
        cid, c = int(box.cls[0]), float(box.conf[0])
        if cid in COCO_TO_LABEL and c > best_c:
            best, best_c = COCO_TO_LABEL[cid], c
    return best


def move(src, dst_dir, copy=True):
    dst_dir.mkdir(parents=True, exist_ok=True)
    (shutil.copy2 if copy else shutil.move)(src, dst_dir / src.name)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="raw_images")
    ap.add_argument("--output", default="curated_dataset")
    ap.add_argument("--quarantine", default="quarantine")
    ap.add_argument("--blur-threshold", type=float, default=100.0)
    ap.add_argument("--hash-dist", type=int, default=5, help="max Hamming distance for duplicates")
    ap.add_argument("--conf", type=float, default=0.35)
    ap.add_argument("--summary", default="sample_output.json")
    a = ap.parse_args()

    from ultralytics import YOLO
    model = YOLO("yolov8n.pt")
    out, q = Path(a.output), Path(a.quarantine)
    for l in LABELS:
        (out / l).mkdir(parents=True, exist_ok=True)

    files = sorted(p for p in Path(a.input).rglob("*") if p.suffix.lower() in EXTS)
    counts = {l: 0 for l in LABELS}
    bd = {"corrupt": 0, "blurry": 0, "duplicates": 0, "no_vehicle_detected": 0}
    seen = []

    for p in files:
        if is_corrupt(p):
            bd["corrupt"] += 1; move(p, q / "corrupt"); continue
        img = cv2.imread(str(p))
        if blur_score(img) < a.blur_threshold:
            bd["blurry"] += 1; move(p, q / "blurry"); continue
        h = dhash(img)
        if any(bin(h ^ s).count("1") <= a.hash_dist for s in seen):
            bd["duplicates"] += 1; move(p, q / "duplicates"); continue
        seen.append(h)
        label = classify(model, p, a.conf)
        if label is None:
            bd["no_vehicle_detected"] += 1; move(p, q / "no_vehicle"); continue
        counts[label] += 1; move(p, out / label)

    summary = {
        "total_processed": len(files),
        "quarantined_low_quality": bd["corrupt"] + bd["blurry"] + bd["duplicates"],
        "labeled_counts": counts,
        "breakdown": bd,
    }
    Path(a.summary).write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
