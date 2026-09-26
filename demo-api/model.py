"""Deterministic, synthetic terrain and planning calculations for the defense demo.

Coordinates, elevations, people and times here are illustrative. Nothing in this
module is a geographic or calibrated hydrological model of Laoag City.
"""

from __future__ import annotations

from collections import deque
from functools import lru_cache
from heapq import heappop, heappush
from math import ceil, cos, exp, hypot, pi, sin, sqrt
from random import Random

import numpy as np

GRID_SIZE = 65
CELL_SIZE_M = 20.0
INFILTRATION_MM_HR = 8.0
MANNING_N = 0.07
VISIBLE_DEPTH_M = 0.05
ROAD_CLOSURE_DEPTH_M = 0.25
OUTLET_SLOPE = 0.001
STEP_SECONDS = 1.25
FRAME_SECONDS = 600.0
SECTORS = {
    "sector-a": "Demo sector A",
    "sector-b": "Demo sector B",
    "sector-c": "Demo sector C",
}

NODES = {
    "origin": (0.12, 0.82),
    "west": (0.23, 0.65),
    "market": (0.44, 0.68),
    "riverside": (0.62, 0.72),
    "central": (0.48, 0.46),
    "bridge": (0.65, 0.41),
    "north": (0.80, 0.19),
    "sports": (0.82, 0.76),
    "west_school": (0.16, 0.25),
    "hill": (0.31, 0.34),
}

# The manual closure keys are retained from the existing planner.
EDGES = [
    ("origin", "west", "approach"),
    ("west", "market", "market"),
    ("market", "riverside", "riverside"),
    ("riverside", "sports", "sports_access"),
    ("market", "central", "central"),
    ("central", "bridge", "bridge"),
    ("bridge", "north", "north_access"),
    ("west", "hill", "west_link"),
    ("hill", "west_school", "west_center"),
    ("hill", "central", "upper_link"),
    ("central", "north", "north_bypass"),
    ("riverside", "bridge", "east_link"),
    ("market", "sports", "sports_link"),
]

CENTERS = [
    {"node": "north", "name": "North Demo School", "capacity": 180, "tone": "teal"},
    {"node": "sports", "name": "Civic Demo Hall", "capacity": 150, "tone": "blue"},
    {"node": "west_school", "name": "West Demo School", "capacity": 200, "tone": "amber"},
]


def valid_sector(sector_id: str) -> bool:
    return sector_id in SECTORS


def elevation_grid(size: int = GRID_SIZE) -> list[list[float]]:
    """One fixed landscape for every selectable demo sector."""
    grid = []
    for row in range(size):
        z = row / (size - 1)
        values = []
        for col in range(size):
            x = col / (size - 1)
            channel = 0.53 + 0.075 * sin(z * 2.4 * pi)
            distance = (x - channel) / 0.105
            ridge = 0.18 * sin(2.7 * pi * x + 0.5) * cos(2.1 * pi * z)
            hill = 0.42 * exp(-((x - 0.20) ** 2 + (z - 0.24) ** 2) / 0.045)
            fine = 0.035 * sin(13 * pi * x + 2 * z) * cos(11 * pi * z - x)
            value = 0.65 + 0.55 * (1 - z) + 0.22 * (1 - x) + ridge + hill + fine - 0.60 * exp(-(distance**2))
            values.append(round(max(0.12, value), 5))
        grid.append(values)
    return grid


def d8_flow(elevations: list[list[float]]) -> tuple[list[list[int]], list[list[int]]]:
    """Return downstream flattened indices and contributing-cell counts.

    Downhill ties use row-major neighbor order. Equal-height cells have no flow.
    """
    rows = len(elevations)
    cols = len(elevations[0])
    downstream = [-1] * (rows * cols)
    indegree = [0] * (rows * cols)
    for row in range(rows):
        for col in range(cols):
            steepest = 0.0
            target = -1
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == dc == 0:
                        continue
                    nr, nc = row + dr, col + dc
                    if not (0 <= nr < rows and 0 <= nc < cols):
                        continue
                    slope = (elevations[row][col] - elevations[nr][nc]) / hypot(dr, dc)
                    if slope > steepest + 1e-10:
                        steepest = slope
                        target = nr * cols + nc
            index = row * cols + col
            downstream[index] = target
            if target != -1:
                indegree[target] += 1

    accumulation = [1] * (rows * cols)
    queue = deque(index for index, degree in enumerate(indegree) if degree == 0)
    visited = 0
    while queue:
        index = queue.popleft()
        visited += 1
        target = downstream[index]
        if target != -1:
            accumulation[target] += accumulation[index]
            indegree[target] -= 1
            if indegree[target] == 0:
                queue.append(target)
    if visited != rows * cols:
        raise ValueError("D8 drainage graph contains a cycle")
    return (
        [downstream[row * cols : (row + 1) * cols] for row in range(rows)],
        [accumulation[row * cols : (row + 1) * cols] for row in range(rows)],
    )


GRID = elevation_grid()
FLOW, ACCUMULATION = d8_flow(GRID)


def height_at(x: float, z: float) -> float:
    col = max(0, min(GRID_SIZE - 1, round(x * (GRID_SIZE - 1))))
    row = max(0, min(GRID_SIZE - 1, round(z * (GRID_SIZE - 1))))
    return GRID[row][col]


def distance_to_segment(x: float, z: float, start: tuple[float, float], end: tuple[float, float]) -> float:
    dx, dz = end[0] - start[0], end[1] - start[1]
    ratio = max(0.0, min(1.0, ((x - start[0]) * dx + (z - start[1]) * dz) / (dx * dx + dz * dz)))
    return hypot(x - start[0] - ratio * dx, z - start[1] - ratio * dz)


def landscape_geometry(buildings: list[dict]) -> dict[str, list[dict]]:
    """Fixed-seed presentation scenery; no landscape item affects the model."""
    rng = Random(20260926)
    landscape: dict[str, list[dict]] = {"fields": [], "trees": [], "shrubs": [], "rocks": []}

    def clear(x: float, z: float, radius: float, *, channel_gap: float = 0.04) -> bool:
        if not (radius + 0.018 < x < 1 - radius - 0.018 and radius + 0.018 < z < 1 - radius - 0.018):
            return False
        channel = 0.53 + 0.075 * sin(z * 2.4 * pi)
        if abs(x - channel) < channel_gap + radius:
            return False
        if any(distance_to_segment(x, z, NODES[a], NODES[b]) < radius + 0.018 for a, b, _ in EDGES):
            return False
        if any(hypot(x - nx, z - nz) < radius + 0.048 for nx, nz in NODES.values()):
            return False
        if any(abs(x - item["x"]) < item["width"] / 2 + radius + 0.009 and
               abs(z - item["z"]) < item["depth"] / 2 + radius + 0.009 for item in buildings):
            return False
        if any(hypot(x - field["x"], z - field["z"]) < radius + max(field["radiusX"], field["radiusZ"]) + 0.008
               for field in landscape["fields"]):
            return False
        return True

    for _ in range(2200):
        if len(landscape["fields"]) >= 11:
            break
        x, z = rng.uniform(0.08, 0.92), rng.uniform(0.08, 0.92)
        rx, rz = rng.uniform(0.027, 0.042), rng.uniform(0.022, 0.034)
        if not 0.74 < height_at(x, z) < 1.35 or not clear(x, z, max(rx, rz), channel_gap=0.055):
            continue
        if any(hypot(x - field["x"], z - field["z"]) < max(rx, rz) + max(field["radiusX"], field["radiusZ"]) + 0.035
               for field in landscape["fields"]):
            continue
        landscape["fields"].append({"x": round(x, 5), "z": round(z, 5), "radiusX": round(rx, 5),
                                    "radiusZ": round(rz, 5), "rotation": round(rng.uniform(-0.7, 0.7), 4),
                                    "tone": len(landscape["fields"]) % 3})

    cluster_centers = [(0.16 + 0.33 * col + rng.uniform(-0.045, 0.045),
                        0.15 + 0.34 * row + rng.uniform(-0.045, 0.045))
                       for row in range(3) for col in range(3)]
    for attempt in range(6000):
        if len(landscape["trees"]) >= 88:
            break
        anchor_x, anchor_z = cluster_centers[attempt % len(cluster_centers)]
        x, z = rng.gauss(anchor_x, 0.07), rng.gauss(anchor_z, 0.07)
        radius = rng.uniform(0.013, 0.020)
        if height_at(x, z) < 0.65 or not clear(x, z, radius, channel_gap=0.052):
            continue
        if any(hypot(x - tree["x"], z - tree["z"]) < radius + tree["radius"] + 0.006
               for tree in landscape["trees"]):
            continue
        landscape["trees"].append({"x": round(x, 5), "z": round(z, 5), "radius": round(radius, 5),
                                   "height": round(rng.uniform(0.36, 0.62), 4),
                                   "rotation": round(rng.uniform(0, 2 * pi), 4),
                                   "tone": len(landscape["trees"]) % 4})

    for _ in range(5000):
        if len(landscape["shrubs"]) >= 115:
            break
        x, z = rng.uniform(0.045, 0.955), rng.uniform(0.045, 0.955)
        radius = rng.uniform(0.006, 0.011)
        if height_at(x, z) < 0.55 or not clear(x, z, radius, channel_gap=0.025):
            continue
        if any(hypot(x - shrub["x"], z - shrub["z"]) < radius + shrub["radius"] + 0.006
               for shrub in landscape["shrubs"]):
            continue
        landscape["shrubs"].append({"x": round(x, 5), "z": round(z, 5), "radius": round(radius, 5),
                                    "height": round(rng.uniform(0.09, 0.16), 4), "tone": len(landscape["shrubs"]) % 3})

    for _ in range(5000):
        if len(landscape["rocks"]) >= 19:
            break
        x, z = rng.uniform(0.045, 0.955), rng.uniform(0.045, 0.955)
        radius = rng.uniform(0.014, 0.027)
        if height_at(x, z) < 1.08 or not clear(x, z, radius, channel_gap=0.06):
            continue
        if any(hypot(x - rock["x"], z - rock["z"]) < radius + rock["radius"] + 0.025
               for rock in landscape["rocks"]):
            continue
        if any(hypot(x - tree["x"], z - tree["z"]) < radius + tree["radius"] + 0.012
               for tree in landscape["trees"]):
            continue
        landscape["rocks"].append({"x": round(x, 5), "z": round(z, 5), "radius": round(radius, 5),
                                   "height": round(rng.uniform(0.13, 0.29), 4),
                                   "rotation": round(rng.uniform(0, 2 * pi), 4),
                                   "tone": len(landscape["rocks"]) % 3})
    return landscape


def scene_geometry() -> dict:
    vertices: list[float] = []
    colors: list[float] = []
    indices: list[int] = []
    for row in range(GRID_SIZE):
        for col in range(GRID_SIZE):
            height = GRID[row][col]
            vertices.extend((col / (GRID_SIZE - 1) * 12 - 6, height, row / (GRID_SIZE - 1) * 12 - 6))
            if height < 0.59:
                colors.extend((0.42, 0.64, 0.44))
            elif height < 0.86:
                colors.extend((0.55, 0.69, 0.43))
            elif height < 1.15:
                colors.extend((0.70, 0.67, 0.47))
            else:
                colors.extend((0.67, 0.58, 0.44))
    for row in range(GRID_SIZE - 1):
        for col in range(GRID_SIZE - 1):
            a = row * GRID_SIZE + col
            b = a + 1
            c = a + GRID_SIZE
            d = c + 1
            indices.extend((a, c, b, b, c, d))

    buildings = []
    for index in range(52):
        x = 0.075 + ((index * 37) % 84) / 100
        z = 0.095 + ((index * 23 + index // 5 * 11) % 81) / 100
        channel = 0.53 + 0.075 * sin(z * 2.4 * pi)
        if abs(x - channel) < 0.105 or any(hypot(x - nx, z - nz) < 0.055 for nx, nz in NODES.values()):
            continue
        buildings.append({
            "x": x, "z": z, "width": 0.020 + (index % 3) * 0.006,
            "depth": 0.022 + (index % 4) * 0.005,
            "height": 0.20 + (index % 5) * 0.065,
            "color": ["#f4e7ce", "#d5bca1", "#e7d3b3", "#d7a98a"][index % 4],
        })
    return {
        "size": GRID_SIZE,
        "elevations": [value for row in GRID for value in row],
        "vertices": vertices,
        "colors": colors,
        "indices": indices,
        "nodes": NODES,
        "edges": [{"from": a, "to": b, "key": key} for a, b, key in EDGES],
        "buildings": buildings,
        "centers": CENTERS,
        "landscape": landscape_geometry(buildings),
    }


def route_water_step(depth: np.ndarray, elevations: np.ndarray, outlet_faces: np.ndarray, dt: float) -> tuple[np.ndarray, float]:
    """Route water across four cell faces and open edges without creating water."""
    sill_x = np.maximum(elevations[:, :-1], elevations[:, 1:])
    sill_z = np.maximum(elevations[:-1, :], elevations[1:, :])
    surface = elevations + depth
    difference_x = surface[:, :-1] - surface[:, 1:]
    difference_z = surface[:-1, :] - surface[1:, :]
    face_depth_x = np.where(difference_x >= 0, surface[:, :-1] - sill_x, surface[:, 1:] - sill_x).clip(min=0)
    face_depth_z = np.where(difference_z >= 0, surface[:-1, :] - sill_z, surface[1:, :] - sill_z).clip(min=0)
    flow_x = np.sign(difference_x) * face_depth_x ** (5 / 3) * np.sqrt(np.abs(difference_x) / CELL_SIZE_M) / MANNING_N * dt / CELL_SIZE_M
    flow_z = np.sign(difference_z) * face_depth_z ** (5 / 3) * np.sqrt(np.abs(difference_z) / CELL_SIZE_M) / MANNING_N * dt / CELL_SIZE_M
    outlet = outlet_faces * depth ** (5 / 3) * sqrt(OUTLET_SLOPE) / MANNING_N * dt / CELL_SIZE_M
    outgoing = outlet.copy()
    outgoing[:, :-1] += np.maximum(flow_x, 0)
    outgoing[:, 1:] += np.maximum(-flow_x, 0)
    outgoing[:-1, :] += np.maximum(flow_z, 0)
    outgoing[1:, :] += np.maximum(-flow_z, 0)
    fraction = np.divide(depth, outgoing, out=np.ones_like(depth), where=outgoing > 0).clip(max=1)
    actual_x = np.where(flow_x >= 0, flow_x * fraction[:, :-1], flow_x * fraction[:, 1:])
    actual_z = np.where(flow_z >= 0, flow_z * fraction[:-1, :], flow_z * fraction[1:, :])
    delta = np.zeros_like(depth)
    delta[:, :-1] -= actual_x
    delta[:, 1:] += actual_x
    delta[:-1, :] -= actual_z
    delta[1:, :] += actual_z
    actual_outlet = outlet * fraction
    next_depth = depth + delta - actual_outlet
    np.maximum(next_depth, 0, out=next_depth)
    return next_depth, float(actual_outlet.sum())


@lru_cache(maxsize=8)
def flood_result(intensity_mm_hr: float, duration_hr: float) -> dict:
    """Conservative, simplified rain-on-grid runoff with depth in metres.

    This is a synthetic demonstration, not a calibrated flood prediction. Each
    cell is a 20 m square; the synthetic elevation numbers are interpreted as
    metres. Rainfall loses a fixed infiltration amount, then shallow surface
    water moves between four neighboring cells along water-surface gradients.
    Open tile edges drain through an assumed normal slope.
    """
    count = GRID_SIZE * GRID_SIZE
    elevations = np.asarray(GRID, dtype=np.float64)
    depth = np.zeros_like(elevations)
    peak_depth = np.zeros_like(elevations)
    outlet_faces = np.zeros_like(elevations)
    outlet_faces[0, :] += 1
    outlet_faces[-1, :] += 1
    outlet_faces[:, 0] += 1
    outlet_faces[:, -1] += 1
    rainfall_rate = intensity_mm_hr / 1000 / 3600
    infiltration_rate = min(intensity_mm_hr, INFILTRATION_MM_HR) / 1000 / 3600
    runoff_rate = rainfall_rate - infiltration_rate
    duration_seconds = duration_hr * 3600
    steps = ceil(duration_seconds / STEP_SECONDS)
    outflow_depth_sum = 0.0
    frames = [{"elapsedMinutes": 0.0, "depthsM": [0.0] * count, "wetCells": 0, "maxDepthM": 0.0}]

    for step in range(steps):
        elapsed = step * STEP_SECONDS
        dt = min(STEP_SECONDS, duration_seconds - elapsed)
        depth += runoff_rate * dt
        depth, outflow_depth = route_water_step(depth, elevations, outlet_faces, dt)
        outflow_depth_sum += outflow_depth
        np.maximum(peak_depth, depth, out=peak_depth)
        next_elapsed = elapsed + dt
        if step == steps - 1 or abs(next_elapsed / FRAME_SECONDS - round(next_elapsed / FRAME_SECONDS)) < 1e-8:
            frames.append({"elapsedMinutes": round(next_elapsed / 60, 2),
                           "depthsM": depth.round(4).ravel().tolist(),
                           "wetCells": int(np.count_nonzero(depth >= VISIBLE_DEPTH_M)),
                           "maxDepthM": round(float(depth.max()), 3)})

    peak_mask = (peak_depth >= VISIBLE_DEPTH_M).ravel().tolist()
    cell_area = CELL_SIZE_M * CELL_SIZE_M
    rain_volume = rainfall_rate * duration_seconds * count * cell_area
    infiltrated_volume = infiltration_rate * duration_seconds * count * cell_area
    outflow_volume = outflow_depth_sum * cell_area
    stored_volume = float(depth.sum()) * cell_area
    return {
        "frames": frames,
        "peakDepthsM": peak_depth.round(4).ravel().tolist(),
        "floodMask": peak_mask,
        "floodedCells": sum(peak_mask),
        "totalCells": count,
        "floodedRoads": road_flood_status(peak_depth.ravel().tolist()),
        "maxDepthM": round(float(peak_depth.max()), 3),
        "depthUnit": "m",
        "visibleDepthM": VISIBLE_DEPTH_M,
        "roadClosureDepthM": ROAD_CLOSURE_DEPTH_M,
        "cellSizeM": CELL_SIZE_M,
        "infiltrationMmHr": INFILTRATION_MM_HR,
        "manningN": MANNING_N,
        "durationMinutes": round(duration_seconds / 60, 2),
        "waterBalanceM3": {"rainfall": round(rain_volume, 4), "infiltration": round(infiltrated_volume, 4),
                           "outflow": round(outflow_volume, 4), "stored": round(stored_volume, 4),
                           "error": round(rain_volume - infiltrated_volume - outflow_volume - stored_volume, 5)},
        "validated": False,
    }


def road_flood_status(depths_m: list[float]) -> dict[str, bool]:
    status = {}
    for start, end, key in EDGES:
        ax, az = NODES[start]
        bx, bz = NODES[end]
        flooded = 0
        for step in range(21):
            ratio = step / 20
            col = round((ax + (bx - ax) * ratio) * (GRID_SIZE - 1))
            row = round((az + (bz - az) * ratio) * (GRID_SIZE - 1))
            flooded += int(depths_m[row * GRID_SIZE + col] >= ROAD_CLOSURE_DEPTH_M)
        status[key] = flooded >= 4
    return status


def shortest_route(target: str, blocked: dict[str, bool]) -> tuple[list[str], float]:
    adjacency: dict[str, list[tuple[str, float]]] = {node: [] for node in NODES}
    for start, end, key in EDGES:
        if blocked.get(key, False):
            continue
        distance = hypot(NODES[start][0] - NODES[end][0], NODES[start][1] - NODES[end][1])
        if key == "north_bypass":
            distance += 0.25  # Longer illustrative detour when the bridge is closed.
        adjacency[start].append((end, distance))
        adjacency[end].append((start, distance))
    queue = [(0.0, "origin", ["origin"])]
    best = {}
    while queue:
        distance, node, path = heappop(queue)
        if node in best:
            continue
        best[node] = distance
        if node == target:
            return path, distance
        for neighbor, cost in adjacency[node]:
            if neighbor not in best:
                heappush(queue, (distance + cost, neighbor, path + [neighbor]))
    return [], float("inf")


def analyze(
    intensity_mm_hr: float,
    duration_hr: float,
    affected: int,
    vehicles: int,
    manual_closures: dict[str, bool],
) -> dict:
    flood = flood_result(intensity_mm_hr, duration_hr)
    blocked = dict(flood["floodedRoads"])
    for key in ("bridge", "riverside", "market"):
        blocked[key] = blocked.get(key, False) or manual_closures.get(key, False)

    center_routes = [shortest_route(center["node"], blocked) for center in CENTERS]
    limits = [center["capacity"] if path else 0 for center, (path, _) in zip(CENTERS, center_routes)]
    desired = [round(affected * 0.408), round(affected * 0.362)]
    desired.append(affected - sum(desired))
    allocations = [min(count, limit) for count, limit in zip(desired, limits)]
    remaining = affected - sum(allocations)
    for index, limit in enumerate(limits):
        extra = min(remaining, limit - allocations[index])
        allocations[index] += extra
        remaining -= extra
    routed = sum(allocations)
    vehicle_allocations = [0] * len(CENTERS)
    active = [index for index, count in enumerate(allocations) if count > 0]
    for index in active[:vehicles]:
        vehicle_allocations[index] += 1
    for _ in range(max(0, vehicles - len(active))):
        if active:
            chosen = max(active, key=lambda index: allocations[index] / (vehicle_allocations[index] + 1))
            vehicle_allocations[chosen] += 1
    available_routes = [(index, path, distance) for index, (path, distance) in enumerate(center_routes) if path]
    selected = next(((index, path, distance) for index, path, distance in available_routes if allocations[index]), None)
    if selected is None:
        route_path: list[str] = []
        route_name = "No accessible center"
        route_detail = "Change closures or rainfall conditions"
    else:
        index, route_path, distance = selected
        route_name = f"Demo origin → {CENTERS[index]['name']}"
        route_detail = f"{round(distance * (GRID_SIZE - 1) * CELL_SIZE_M / 1000, 1)} km synthetic · {len(route_path) - 1} road segments"
    alternate = next((path for index, path, _ in available_routes if path != route_path and allocations[index]), [])
    flood_ratio = flood["floodedCells"] / flood["totalCells"]
    road_count = sum(blocked.values())
    risk = "High" if flood_ratio >= 0.25 or remaining > 0 else "Elevated" if flood_ratio >= 0.06 else "Moderate"
    clearance = round(27 + affected / max(vehicles, 1) * 0.23 + road_count * 2.2 + flood_ratio * 45 + remaining * 0.15)
    return {
        "risk": risk,
        "routed": routed,
        "unassigned": remaining,
        "clearanceTime": clearance,
        "capacity": sum(limits),
        "allocations": allocations,
        "vehicleAllocations": vehicle_allocations,
        "centerLimits": limits,
        "routeName": route_name,
        "routeDetail": route_detail,
        "routePath": route_path,
        "alternatePath": alternate,
        "roadBlocked": blocked,
        "floodedCells": flood["floodedCells"],
        "totalCells": flood["totalCells"],
        "maxDepthM": flood["maxDepthM"],
        "disclaimer": "Synthetic demonstration estimate; not a geographic reconstruction, flood prediction, or operational recommendation.",
    }
