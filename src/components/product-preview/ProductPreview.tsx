import { Component, Suspense, useEffect, useMemo, useState, type ErrorInfo, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ModelDefinition, PartDefinition } from '../../types/configurator';
import { colors } from '../../data/colors';

type Props = { model: ModelDefinition; parts: PartDefinition[]; partColors: Record<string, string>; productId: string; backgroundColor: string; hideIcon: boolean };

function Model({ path, parts, partColors, rotation, fallbackPartId, hideIcon }: { path: string; parts: PartDefinition[]; partColors: Record<string, string>; rotation?: [number, number, number]; fallbackPartId?: string; hideIcon: boolean }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const copy = scene.clone(true);
    if (rotation) copy.rotation.set(...rotation);
    copy.updateMatrixWorld(true);
    copy.traverse((object) => {
      if (hideIcon && object.name.toLowerCase().includes('icon')) object.visible = false;
      if (!(object instanceof THREE.Mesh)) return;
      object.material = Array.isArray(object.material) ? object.material.map((material) => material.clone()) : object.material.clone();
    });
    const bounds = new THREE.Box3().setFromObject(copy);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);
    if (largestDimension > 0) {
      const scale = 2.8 / largestDimension;
      copy.scale.setScalar(scale);
      copy.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }
    return copy;
  }, [scene, rotation, hideIcon]);
  useEffect(() => {
    const nameMap = new Map<string, string>();
    parts.forEach((part) => part.meshNames.forEach((name) => nameMap.set(name.toLowerCase(), part.id)));
    const getPartId = (name: string) => {
      const normalizedName = name.trim().toLowerCase();
      for (const [meshName, partId] of nameMap) {
        if (normalizedName === meshName || normalizedName.startsWith(`${meshName}_`) || normalizedName.startsWith(`${meshName}.`) || normalizedName.startsWith(`${meshName}-`)) return partId;
      }
      return undefined;
    };
    const foundParts = new Set<string>();
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      let partId: string | undefined;
      let namedObject: THREE.Object3D | null = object;
      while (namedObject && !partId) {
        partId = getPartId(namedObject.name);
        namedObject = namedObject.parent;
      }
      partId ??= fallbackPartId;
      if (!partId) return;
      foundParts.add(partId);
      const tint = new THREE.Color(colors.find((color) => color.id === partColors[partId])?.hex ?? '#dddddd');
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!('color' in material)) return;
        const coloredMaterial = material as THREE.MeshStandardMaterial;
        coloredMaterial.color.copy(tint);
        coloredMaterial.roughness = 0.48;
        coloredMaterial.metalness = 0;
        if ('envMapIntensity' in coloredMaterial) coloredMaterial.envMapIntensity = 0.35;
      });
    });
    const missing = parts.filter((part) => !foundParts.has(part.id));
    if (missing.length) console.warn(`Configured color meshes not found: ${missing.map((part) => `${part.id} (${part.meshNames.join(', ')})`).join('; ')}`);
  }, [clone, parts, partColors, fallbackPartId]);
  return <primitive object={clone} />;
}

function getHex(id: string | undefined, fallback: string) { return colors.find((color) => color.id === id)?.hex ?? fallback; }

function DemoNameTag({ partColors }: { partColors: Record<string, string> }) {
  return <group rotation={[0.03, -0.2, 0]}>
    <mesh position={[0, 0, 0]} castShadow receiveShadow><boxGeometry args={[3.25, 1.55, 0.18]} /><meshStandardMaterial color={getHex(partColors.background, '#F1F1F1')} roughness={0.32} /></mesh>
    <mesh position={[0, 0.02, 0.115]} castShadow><boxGeometry args={[2.82, 1.13, 0.07]} /><meshStandardMaterial color={getHex(partColors.letter, '#FF8395')} roughness={0.35} /></mesh>
    <mesh position={[0.02, 0.05, 0.16]} castShadow><boxGeometry args={[2.65, 0.98, 0.06]} /><meshStandardMaterial color={getHex(partColors.background, '#F1F1F1')} roughness={0.28} /></mesh>
    <mesh position={[1.13, 0.35, 0.21]} castShadow><dodecahedronGeometry args={[0.23, 0]} /><meshStandardMaterial color={getHex(partColors.icon, '#53ADEC')} roughness={0.28} /></mesh>
    <mesh position={[-1.4, 0, 0.12]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.14, 0.045, 12, 28]} /><meshStandardMaterial color={getHex(partColors.icon, '#53ADEC')} /></mesh>
  </group>;
}

function DemoPegboard({ partColors }: { partColors: Record<string, string> }) {
  return <group rotation={[0.02, -0.22, 0]}>
    <mesh castShadow receiveShadow><boxGeometry args={[2.75, 2.6, 0.18]} /><meshStandardMaterial color={getHex(partColors.board, '#F1F1F1')} roughness={0.5} /></mesh>
    {Array.from({ length: 5 }).flatMap((_, row) => Array.from({ length: 5 }).map((__, col) => <mesh key={`${row}-${col}`} position={[-0.94 + col * 0.47, -0.91 + row * 0.45, 0.105]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.025, 20]} /><meshStandardMaterial color={getHex(partColors.ring, '#7067BB')} /></mesh>))}
    <mesh position={[0.55, 0.25, 0.19]} castShadow><torusGeometry args={[0.3, 0.09, 16, 36]} /><meshStandardMaterial color={getHex(partColors.decoration, '#FF8395')} /></mesh>
  </group>;
}

export default function ProductPreview({ model, parts, partColors, productId, backgroundColor, hideIcon }: Props) {
  const [loadError, setLoadError] = useState(false);
  useEffect(() => { setLoadError(false); }, [model.path]);
  const modelPath = `${import.meta.env.BASE_URL}${model.path.replace(/^\//, '')}`;
  const hasModel = !loadError;
  return <div className="preview-canvas-wrap">
    <Canvas shadows camera={{ position: [0, 2.6, 5.3], fov: 38 }} dpr={[1, 1.7]}>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        {hasModel ? <ModelErrorBoundary key={modelPath} fallback={() => setLoadError(true)}><Model path={modelPath} parts={model.parts ?? parts} partColors={partColors} rotation={model.rotation} fallbackPartId={model.fallbackPartId} hideIcon={hideIcon} /></ModelErrorBoundary> : productId === 'pegboard' ? <DemoPegboard partColors={partColors} /> : <DemoNameTag partColors={partColors} />}
        <Environment preset="studio" environmentIntensity={0.35} />
        <ContactShadows position={[0, -1.15, 0]} opacity={0.2} scale={7} blur={2.5} far={3} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={8} minPolarAngle={0.45} maxPolarAngle={2.25} />
    </Canvas>
    {loadError && <div className="preview-notice"><span className="notice-dot" /> 모델 파일을 찾을 수 없어 샘플 프리뷰를 표시하고 있어요.</div>}
    <div className="preview-hint"><span>↔ 드래그하여 회전</span><span>스크롤하여 확대</span></div>
  </div>;
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { console.error('Unable to load the selected 3D model.', error); this.props.fallback(); }
  render() { return this.state.failed ? null : this.props.children; }
}
