'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Object3D } from 'three';
import type { InstancedMesh } from 'three';
import type { FloodFrame, FloodResponse, LandscapeItem, PlanResponse, SceneGeometry } from '@/lib/demo-api';

export type SceneLayers = { water: boolean; landscape: boolean; buildings: boolean; roads: boolean; routes: boolean; centers: boolean };
type Props = {
  geometry: SceneGeometry;
  flood: FloodResponse | null;
  plan: PlanResponse | null;
  buildProgress: number;
  waterProgress: number;
  layers: SceneLayers;
  topDown: boolean;
  resetToken: number;
  zoomToken: number;
  zoomDirection: 'in' | 'out';
};

const worldX = (x: number) => x * 12 - 6;
const worldZ = (z: number) => z * 12 - 6;

function heightAt(geometry: SceneGeometry, x: number, z: number) {
  const col = Math.max(0, Math.min(geometry.size - 1, Math.round(x * (geometry.size - 1))));
  const row = Math.max(0, Math.min(geometry.size - 1, Math.round(z * (geometry.size - 1))));
  return geometry.elevations[row * geometry.size + col];
}

function surfaceHeight(geometry: SceneGeometry, x: number, z: number) {
  const col = Math.min(geometry.size - 2, Math.max(0, Math.floor(x * (geometry.size - 1))));
  const row = Math.min(geometry.size - 2, Math.max(0, Math.floor(z * (geometry.size - 1))));
  const u = x * (geometry.size - 1) - col;
  const v = z * (geometry.size - 1) - row;
  const a = geometry.elevations[row * geometry.size + col];
  const b = geometry.elevations[row * geometry.size + col + 1];
  const c = geometry.elevations[(row + 1) * geometry.size + col];
  const d = geometry.elevations[(row + 1) * geometry.size + col + 1];
  return u + v <= 1 ? a + u * (b - a) + v * (c - a) : d + (1 - v) * (b - d) + (1 - u) * (c - d);
}

const reveal = (progress: number, start: number, end: number) => Math.max(0, Math.min(1, (progress - start) / (end - start)));

function Fields({ geometry, buildProgress }: Pick<Props, 'geometry' | 'buildProgress'>) {
  const fields = geometry.landscape.fields;
  const fieldMesh = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const baseColors = ['#a5ab70', '#b7ac78', '#96aa72'];
    const stripeColors = ['#84985c', '#a19465', '#789464'];
    const addTriangle = (points: [number, number][], color: Color, lift: number) => {
      for (const [x, z] of points) {
        positions.push(worldX(x), surfaceHeight(geometry, x, z) + lift, worldZ(z));
        colors.push(color.r, color.g, color.b);
      }
    };
    for (const field of fields) {
      const { x, z, radiusX, radiusZ, rotation, tone } = field;
      const baseColor = new Color(baseColors[tone]);
      const stripeColor = new Color(stripeColors[tone]);
      const point = (u: number, v: number): [number, number] => [
        x + Math.cos(rotation) * u * radiusX - Math.sin(rotation) * v * radiusZ,
        z + Math.sin(rotation) * u * radiusX + Math.cos(rotation) * v * radiusZ,
      ];
      for (let side = 0; side < 8; side++) {
        const theta = side * Math.PI / 4;
        const next = (side + 1) * Math.PI / 4;
        addTriangle([[x, z], point(Math.cos(theta), Math.sin(theta)), point(Math.cos(next), Math.sin(next))], baseColor, 0.018);
      }
      for (const offset of [-0.44, 0, 0.44]) {
        const a = point(-0.62, offset - 0.055), b = point(0.62, offset - 0.055);
        const c = point(-0.62, offset + 0.055), d = point(0.62, offset + 0.055);
        addTriangle([a, c, b], stripeColor, 0.026);
        addTriangle([b, c, d], stripeColor, 0.026);
      }
    }
    const result = new BufferGeometry();
    result.setAttribute('position', new Float32BufferAttribute(positions, 3));
    result.setAttribute('color', new Float32BufferAttribute(colors, 3));
    result.computeVertexNormals();
    return result;
  }, [fields, geometry]);
  useEffect(() => {
    fieldMesh.setDrawRange(0, Math.floor(fields.length * reveal(buildProgress, .54, .74)) * 42);
  }, [fieldMesh, fields.length, buildProgress]);
  useEffect(() => () => fieldMesh.dispose(), [fieldMesh]);
  return <mesh geometry={fieldMesh} receiveShadow><meshStandardMaterial vertexColors flatShading side={DoubleSide} roughness={1} /></mesh>;
}

type LandscapeShape = 'trunk' | 'crown' | 'crownTop' | 'shrub' | 'rock';

function placeInstances(mesh: InstancedMesh | null, items: LandscapeItem[], geometry: SceneGeometry, tones: string[], shape: LandscapeShape) {
  if (!mesh) return;
  const object = new Object3D();
  items.forEach((item, index) => {
    const ground = surfaceHeight(geometry, item.x, item.z);
    const radius = item.radius * 12;
    object.position.set(worldX(item.x), ground, worldZ(item.z));
    object.rotation.set(0, item.rotation || 0, 0);
    if (shape === 'trunk') {
      object.position.y += item.height * .27;
      object.scale.set(1, item.height * .54, 1);
    } else if (shape === 'crown') {
      object.position.y += item.height * .68;
      object.scale.set(radius, item.height * .30, radius);
    } else if (shape === 'crownTop') {
      object.position.x += item.radius * 1.5;
      object.position.y += item.height * .88;
      object.scale.set(radius * .75, item.height * .22, radius * .75);
    } else if (shape === 'shrub') {
      object.position.y += item.height * .44;
      object.scale.set(radius, item.height * .5, radius);
    } else {
      object.position.y += item.height * .35;
      object.scale.set(radius, item.height * .6, radius * .75);
    }
    object.updateMatrix();
    mesh.setMatrixAt(index, object.matrix);
    mesh.setColorAt(index, new Color(tones[item.tone % tones.length]));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

function LandscapeInstances({ geometry, buildProgress }: Pick<Props, 'geometry' | 'buildProgress'>) {
  const trunkRef = useRef<InstancedMesh>(null);
  const crownRef = useRef<InstancedMesh>(null);
  const crownTopRef = useRef<InstancedMesh>(null);
  const shrubRef = useRef<InstancedMesh>(null);
  const rockRef = useRef<InstancedMesh>(null);
  const { trees, shrubs, rocks } = geometry.landscape;
  useLayoutEffect(() => {
    placeInstances(trunkRef.current, trees, geometry, ['#7e6a52'], 'trunk');
    placeInstances(crownRef.current, trees, geometry, ['#507b59', '#648665', '#6b8d63', '#4e7666'], 'crown');
    placeInstances(crownTopRef.current, trees, geometry, ['#638c67', '#769876', '#7b9a6c', '#628775'], 'crownTop');
    placeInstances(shrubRef.current, shrubs, geometry, ['#809e69', '#92a777', '#6d966c'], 'shrub');
    placeInstances(rockRef.current, rocks, geometry, ['#998f7b', '#aea18a', '#8e8e80'], 'rock');
  }, [geometry, trees, shrubs, rocks]);
  useLayoutEffect(() => {
    const treeCount = Math.floor(trees.length * reveal(buildProgress, .78, .96));
    for (const ref of [trunkRef, crownRef, crownTopRef]) if (ref.current) ref.current.count = treeCount;
    if (shrubRef.current) shrubRef.current.count = Math.floor(shrubs.length * reveal(buildProgress, .82, 1));
    if (rockRef.current) rockRef.current.count = Math.floor(rocks.length * reveal(buildProgress, .68, .86));
  }, [buildProgress, trees.length, shrubs.length, rocks.length]);
  return <>
    <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow><cylinderGeometry args={[.038, .055, 1, 5]} /><meshStandardMaterial color="white" flatShading roughness={1} /></instancedMesh>
    <instancedMesh ref={crownRef} args={[undefined, undefined, trees.length]} castShadow><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="white" flatShading roughness={1} /></instancedMesh>
    <instancedMesh ref={crownTopRef} args={[undefined, undefined, trees.length]} castShadow><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="white" flatShading roughness={1} /></instancedMesh>
    <instancedMesh ref={shrubRef} args={[undefined, undefined, shrubs.length]} castShadow><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="white" flatShading roughness={1} /></instancedMesh>
    <instancedMesh ref={rockRef} args={[undefined, undefined, rocks.length]} castShadow receiveShadow><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="white" flatShading roughness={1} /></instancedMesh>
  </>;
}

function CameraControls({ topDown, resetToken, zoomToken, zoomDirection }: Pick<Props, 'topDown' | 'resetToken' | 'zoomToken' | 'zoomDirection'>) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    camera.position.set(topDown ? 0 : 13, topDown ? 19 : 15, topDown ? 0.001 : 13);
    camera.lookAt(0, 0, 0);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
  }, [camera, topDown, resetToken]);
  useEffect(() => {
    if (!zoomToken || !controls.current) return;
    const target = controls.current.target;
    const factor = zoomDirection === 'in' ? 0.82 : 1.22;
    camera.position.sub(target).multiplyScalar(factor).add(target);
    controls.current.update();
  }, [camera, zoomToken, zoomDirection]);
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.08} minDistance={4} maxDistance={27} maxPolarAngle={topDown ? 0.2 : Math.PI / 2.08} enablePan enableRotate={!topDown} />;
}

function Tile({ geometry, buildProgress }: Pick<Props, 'geometry' | 'buildProgress'>) {
  const top = useMemo(() => {
    const result = new BufferGeometry();
    result.setAttribute('position', new Float32BufferAttribute(geometry.vertices, 3));
    result.setAttribute('color', new Float32BufferAttribute(geometry.colors, 3));
    result.setIndex(geometry.indices);
    result.computeVertexNormals();
    return result;
  }, [geometry]);
  const skirt = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const n = geometry.size;
    const addSegment = (a: number, b: number) => {
      const base = positions.length / 3;
      const ax = geometry.vertices[a * 3], ay = geometry.vertices[a * 3 + 1], az = geometry.vertices[a * 3 + 2];
      const bx = geometry.vertices[b * 3], by = geometry.vertices[b * 3 + 1], bz = geometry.vertices[b * 3 + 2];
      positions.push(ax, ay, az, bx, by, bz, ax, -0.32, az, bx, -0.32, bz);
      colors.push(.45, .37, .31, .45, .37, .31, .31, .27, .25, .31, .27, .25);
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    };
    for (let i = 0; i < n - 1; i++) {
      addSegment(i, i + 1);
      addSegment((n - 1) * n + i + 1, (n - 1) * n + i);
      addSegment((i + 1) * n, i * n);
      addSegment(i * n + n - 1, (i + 1) * n + n - 1);
    }
    const result = new BufferGeometry();
    result.setAttribute('position', new Float32BufferAttribute(positions, 3));
    result.setAttribute('color', new Float32BufferAttribute(colors, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [geometry]);
  useEffect(() => {
    const rows = Math.max(0, Math.min(geometry.size - 1, Math.ceil(buildProgress * (geometry.size - 1))));
    top.setDrawRange(0, rows * (geometry.size - 1) * 6);
  }, [top, buildProgress, geometry.size]);
  useEffect(() => () => { top.dispose(); skirt.dispose(); }, [top, skirt]);
  return <>
    <mesh position={[0, -0.40, 0]} receiveShadow><boxGeometry args={[12, 0.18, 12]} /><meshStandardMaterial color="#453f3a" roughness={1} /></mesh>
    <mesh geometry={top} receiveShadow castShadow><meshStandardMaterial vertexColors flatShading side={DoubleSide} roughness={0.96} /></mesh>
    {buildProgress > .93 && <mesh geometry={skirt} castShadow><meshStandardMaterial vertexColors flatShading side={DoubleSide} roughness={1} /></mesh>}
  </>;
}

function Water({ geometry, frame, visibleDepthM }: { geometry: SceneGeometry; frame: FloodFrame; visibleDepthM: number }) {
  const waterGeometry = useMemo(() => {
    const result = new BufferGeometry();
    const size = geometry.size;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const shallow = new Color('#48b6c9');
    const deep = new Color('#0b639a');
    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size - 1; col++) {
        const offsets = [row * size + col, row * size + col + 1, (row + 1) * size + col, (row + 1) * size + col + 1];
        if (offsets.filter((index) => frame.depthsM[index] >= visibleDepthM).length < 2) continue;
        const base = positions.length / 3;
        for (const index of offsets) {
          const r = Math.floor(index / size), c = index % size;
          const depth = frame.depthsM[index];
          positions.push(c / (size - 1) * 12 - 6, geometry.elevations[index] + depth + 0.007, r / (size - 1) * 12 - 6);
          const color = shallow.clone().lerp(deep, Math.min(1, depth / 0.6));
          colors.push(color.r, color.g, color.b);
        }
        indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      }
    }
    result.setAttribute('position', new Float32BufferAttribute(positions, 3));
    result.setAttribute('color', new Float32BufferAttribute(colors, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [geometry, frame, visibleDepthM]);
  useEffect(() => () => waterGeometry.dispose(), [waterGeometry]);
  return <mesh geometry={waterGeometry} renderOrder={3}><meshStandardMaterial vertexColors transparent opacity={0.8} side={DoubleSide} depthWrite={false} roughness={0.3} metalness={0.05} /></mesh>;
}

function SceneContents(props: Props) {
  const { geometry, flood, plan, buildProgress, waterProgress, layers } = props;
  const roadLines = useMemo(() => geometry.edges.map((edge) => {
    const from = geometry.nodes[edge.from], to = geometry.nodes[edge.to];
    const points: [number, number, number][] = [];
    for (let step = 0; step <= 20; step++) {
      const x = from[0] + (to[0] - from[0]) * step / 20;
      const z = from[1] + (to[1] - from[1]) * step / 20;
      points.push([worldX(x), heightAt(geometry, x, z) + .06, worldZ(z)]);
    }
    return { ...edge, points };
  }), [geometry]);
  const routePoints = (path: string[], lift: number) => path.map((node) => {
    const [x, z] = geometry.nodes[node];
    return [worldX(x), heightAt(geometry, x, z) + lift, worldZ(z)] as [number, number, number];
  });
  return <>
    <color attach="background" args={['#dfeeea']} />
    <fog attach="fog" args={['#dfeeea', 20, 38]} />
    <ambientLight intensity={1.6} />
    <directionalLight position={[-5, 12, 7]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
    <gridHelper args={[34, 34, '#c7d7d4', '#d3e1dd']} position={[0, -.55, 0]} />
    <Tile geometry={geometry} buildProgress={buildProgress} />
    <group visible={layers.landscape}><Fields geometry={geometry} buildProgress={buildProgress} /><LandscapeInstances geometry={geometry} buildProgress={buildProgress} /></group>
    {buildProgress > .66 && layers.roads && roadLines.map((road) => <Line key={road.key} points={road.points} color={plan?.roadBlocked[road.key] ? '#d85545' : '#f7f0e0'} lineWidth={plan?.roadBlocked[road.key] ? 3.5 : 2.5} />)}
    {buildProgress > .72 && layers.buildings && geometry.buildings.map((building, index) => {
      const height = heightAt(geometry, building.x, building.z);
      return <mesh key={index} position={[worldX(building.x), height + building.height / 2, worldZ(building.z)]} castShadow receiveShadow>
        <boxGeometry args={[building.width * 12, building.height, building.depth * 12]} />
        <meshStandardMaterial color={building.color} flatShading roughness={.9} />
      </mesh>;
    })}
    {buildProgress > .78 && layers.centers && geometry.centers.map((center) => {
      const [x, z] = geometry.nodes[center.node];
      return <group key={center.node} position={[worldX(x), heightAt(geometry, x, z) + .15, worldZ(z)]}>
        <mesh position={[0, .16, 0]}><cylinderGeometry args={[.13, .17, .32, 6]} /><meshStandardMaterial color={center.tone === 'teal' ? '#0a8d80' : center.tone === 'blue' ? '#3977a8' : '#c18c3c'} /></mesh>
        <Html position={[0, .48, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}><span className="scene-pin">{center.name}</span></Html>
      </group>;
    })}
    {buildProgress > .78 && layers.centers && (() => {
      const [x, z] = geometry.nodes.origin;
      return <Html position={[worldX(x), heightAt(geometry, x, z) + .55, worldZ(z)]} center distanceFactor={12} style={{ pointerEvents: 'none' }}><span className="scene-pin origin">Demo origin</span></Html>;
    })()}
    {buildProgress > .95 && layers.water && flood && <Water geometry={geometry} frame={flood.frames[Math.min(flood.frames.length - 1, Math.floor(waterProgress * (flood.frames.length - 1)))]} visibleDepthM={flood.visibleDepthM} />}
    {buildProgress > .82 && layers.routes && plan && plan.routePath.length > 1 && <Line points={routePoints(plan.routePath, .15)} color="#087f70" lineWidth={5} />}
    {buildProgress > .82 && layers.routes && plan && plan.alternatePath.length > 1 && <Line points={routePoints(plan.alternatePath, .19)} color="#d9a340" lineWidth={3} dashed dashSize={.18} gapSize={.12} />}
    <CameraControls topDown={props.topDown} resetToken={props.resetToken} zoomToken={props.zoomToken} zoomDirection={props.zoomDirection} />
  </>;
}

export default function TerrainScene(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!mounted) return <div className="scene-placeholder">Preparing 3D view…</div>;
  return <Canvas shadows camera={{ position: [13, 15, 13], fov: 47, near: .1, far: 100 }} dpr={[1, 1.6]} gl={{ antialias: true }}><SceneContents {...props} /></Canvas>;
}
