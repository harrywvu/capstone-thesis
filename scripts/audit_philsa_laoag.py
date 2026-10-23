"""Clip a PhilSA flood shapefile to the 80 coded Laoag barangays.

Requires pyshp, shapely, and pyproj. Example:
  python scripts/audit_philsa_laoag.py \
    --flood /path/to/20260831_Flood_S1C_B1B5.shp \
    --barangays '/path/to/Laoag Administratrive Boundary.shp'

The input files are not redistributed by this script. Output is an audit of
satellite detections, not verified flooded area or road passability.
"""

import argparse
from collections import Counter, defaultdict

import shapefile
from pyproj import Transformer
from shapely.geometry import shape
from shapely.ops import transform, unary_union
from shapely.strtree import STRtree
from shapely.validation import make_valid


def valid_geometry(value):
    geometry = shape(value.__geo_interface__)
    return geometry if geometry.is_valid else make_valid(geometry)


def area_hectares(geometries, project):
    return transform(project, unary_union(geometries)).area / 10_000


def audit(flood_path, barangay_path):
    to_wgs84 = Transformer.from_crs("EPSG:3123", "EPSG:4326", always_xy=True).transform
    to_utm51n = Transformer.from_crs("EPSG:4326", "EPSG:32651", always_xy=True).transform

    barangays = []
    for item in shapefile.Reader(barangay_path).iterShapeRecords():
        row = item.record.as_dict()
        code = row["BarangayNo"].strip()
        if not code:
            continue  # Excludes the extra Monroe Island feature.
        geometry = transform(to_wgs84, valid_geometry(item.shape))
        if not geometry.is_valid:
            geometry = make_valid(geometry)
        barangays.append((code, row["BarangayNa"], geometry))

    city = unary_union([row[2] for row in barangays])
    tree = STRtree([row[2] for row in barangays])
    west, south, east, north = city.bounds
    by_class = defaultdict(list)
    by_barangay = defaultdict(lambda: defaultdict(list))
    feature_counts = Counter()

    for item in shapefile.Reader(flood_path).iterShapeRecords():
        x1, y1, x2, y2 = item.shape.bbox
        if x2 < west or x1 > east or y2 < south or y1 > north:
            continue
        flood = valid_geometry(item.shape)
        if not flood.intersects(city):
            continue
        label = item.record["Class"]
        clipped = flood.intersection(city)
        if clipped.is_empty:
            continue
        feature_counts[label] += 1
        by_class[label].append(clipped)
        for index in tree.query(flood, predicate="intersects"):
            code, _, polygon = barangays[int(index)]
            piece = flood.intersection(polygon)
            if not piece.is_empty:
                by_barangay[code][label].append(piece)

    print(f"Coded barangays: {len(barangays)}")
    print(f"Barangays with candidate detections: {len(by_barangay)}")
    for label in sorted(by_class):
        print(f"{label}: {feature_counts[label]} features; {area_hectares(by_class[label], to_utm51n):.1f} ha")
    all_pieces = [piece for pieces in by_class.values() for piece in pieces]
    print(f"Union of classes: {area_hectares(all_pieces, to_utm51n):.1f} ha")
    for code in ("2", "38-A", "52-B"):
        pieces = [piece for group in by_barangay[code].values() for piece in group]
        print(f"Barangay {code}: {area_hectares(pieces, to_utm51n):.2f} ha" if pieces else f"Barangay {code}: no detected polygon")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--flood", required=True, help="PhilSA .shp path")
    parser.add_argument("--barangays", required=True, help="City Hall .shp path")
    args = parser.parse_args()
    audit(args.flood, args.barangays)
