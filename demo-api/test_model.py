import unittest
from math import hypot

import numpy as np

from model import (EDGES, GRID_SIZE, NODES, analyze, d8_flow, distance_to_segment,
                   flood_result, height_at, road_flood_status, route_water_step,
                   scene_geometry, shortest_route)


class ModelTests(unittest.TestCase):
    def test_d8_flow_and_accumulation(self):
        downstream, accumulation = d8_flow([[3, 2], [2, 1]])
        self.assertEqual(downstream, [[3, 3], [3, -1]])
        self.assertEqual(accumulation[1][1], 4)

    def test_rainfall_produces_depth_snapshots_and_larger_extent(self):
        dry = flood_result(0, 0)
        absorbed = flood_result(6, 1)
        moderate = flood_result(30, 2)
        severe = flood_result(90, 3)
        self.assertEqual(dry["floodedCells"], 0)
        self.assertEqual(absorbed["maxDepthM"], 0)
        self.assertLess(dry["floodedCells"], moderate["floodedCells"])
        self.assertLess(moderate["floodedCells"], severe["floodedCells"])
        self.assertEqual(len(severe["floodMask"]), GRID_SIZE * GRID_SIZE)
        self.assertEqual(moderate["frames"][0]["elapsedMinutes"], 0)
        self.assertEqual(moderate["frames"][-1]["elapsedMinutes"], 120)
        self.assertGreater(moderate["frames"][-1]["maxDepthM"], 0)
        self.assertFalse(moderate["validated"])
        self.assertLess(abs(moderate["waterBalanceM3"]["error"]), 0.001)
        self.assertLess(abs(severe["waterBalanceM3"]["error"]), 0.001)

    def test_routing_step_conserves_water_and_flows_downhill(self):
        elevation = np.array([[2.0, 1.0, 0.0], [2.0, 1.0, 0.0], [2.0, 1.0, 0.0]])
        water = np.zeros((3, 3))
        water[1, 0] = 0.1
        next_water, outlet = route_water_step(water, elevation, np.zeros_like(water), 1.25)
        self.assertAlmostEqual(next_water.sum(), water.sum(), places=10)
        self.assertEqual(outlet, 0)
        self.assertGreater(next_water[1, 1], 0)
        self.assertTrue(np.all(next_water >= 0))

    def test_road_closure_uses_peak_depth_threshold(self):
        depth = [0.0] * (GRID_SIZE * GRID_SIZE)
        ax, az = NODES["central"]
        bx, bz = NODES["bridge"]
        for step in range(21):
            ratio = step / 20
            col = round((ax + (bx - ax) * ratio) * (GRID_SIZE - 1))
            row = round((az + (bz - az) * ratio) * (GRID_SIZE - 1))
            depth[row * GRID_SIZE + col] = 0.26
        self.assertTrue(road_flood_status(depth)["bridge"])
        self.assertFalse(road_flood_status([0.0] * len(depth))["bridge"])

    def test_manual_road_closures_change_routes(self):
        normal = shortest_route("north", {})[0]
        closed = shortest_route("north", {"bridge": True})[0]
        self.assertNotEqual(normal, closed)
        self.assertTrue(closed)

    def test_analysis_uses_flooded_roads_and_capacity(self):
        normal = analyze(0, 0, 348, 6, {})
        constrained = analyze(90, 3, 650, 4, {"bridge": True, "riverside": True, "market": True})
        self.assertGreater(constrained["floodedCells"], normal["floodedCells"])
        self.assertGreater(constrained["unassigned"], 0)
        self.assertNotEqual(normal["routePath"], constrained["routePath"])
        self.assertEqual(sum(normal["vehicleAllocations"]), 6)
        self.assertEqual(constrained["vehicleAllocations"], [0, 0, 4])

    def test_scene_geometry_has_complete_grid(self):
        geometry = scene_geometry()
        self.assertEqual(len(geometry["elevations"]), GRID_SIZE * GRID_SIZE)
        self.assertEqual(len(geometry["vertices"]), GRID_SIZE * GRID_SIZE * 3)

    def test_landscape_is_repeatable_and_clear_of_planning_features(self):
        geometry = scene_geometry()
        landscape = geometry["landscape"]
        self.assertEqual(landscape, scene_geometry()["landscape"])
        self.assertEqual({key: len(items) for key, items in landscape.items()},
                         {"fields": 11, "trees": 88, "shrubs": 115, "rocks": 15})
        for kind, items in landscape.items():
            for item in items:
                x, z = item["x"], item["z"]
                radius = max(item["radiusX"], item["radiusZ"]) if kind == "fields" else item["radius"]
                self.assertGreater(x, radius + 0.018)
                self.assertLess(x, 1 - radius - 0.018)
                self.assertGreater(z, radius + 0.018)
                self.assertLess(z, 1 - radius - 0.018)
                for start, end, _ in EDGES:
                    self.assertGreaterEqual(distance_to_segment(x, z, NODES[start], NODES[end]), radius + 0.018 - 1e-5)
                for nx, nz in NODES.values():
                    self.assertGreaterEqual(hypot(x - nx, z - nz), radius + 0.048 - 1e-5)
                for building in geometry["buildings"]:
                    overlaps_x = abs(x - building["x"]) < building["width"] / 2 + radius + 0.009 - 1e-5
                    overlaps_z = abs(z - building["z"]) < building["depth"] / 2 + radius + 0.009 - 1e-5
                    self.assertFalse(overlaps_x and overlaps_z)
        self.assertTrue(all(height_at(item["x"], item["z"]) >= 1.08 for item in landscape["rocks"]))


if __name__ == "__main__":
    unittest.main()
