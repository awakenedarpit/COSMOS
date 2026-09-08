import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh, Points } from "three";
import { Color, MathUtils, Vector3 } from "three";

export type CosmosSection = "Dashboard" | "Schedule" | "Syllabus" | "Tasks" | "Study" | "Goals" | "Analytics" | "Roadmap" | "Knowledge" | "Settings" | "Profile";

type SpatialCoreProps = { tasks: number; goals: number; roadmap: number; onNavigate: (view: "Tasks" | "Goals" | "Roadmap" | "Schedule" | "Analytics" | "Profile") => void };

const nodes = [
  { label: "TASKS", view: "Tasks" as const, position: [-2.25, 0.85, 0.2] as [number, number, number], color: "#fbbf24" },
  { label: "GOALS", view: "Goals" as const, position: [2.25, 0.85, 0.2] as [number, number, number], color: "#fb7185" },
  { label: "ROADMAP", view: "Roadmap" as const, position: [0, 2.05, -0.05] as [number, number, number], color: "#a78bfa" },
  { label: "SCHEDULE", view: "Schedule" as const, position: [-2.25, -0.95, 0.2] as [number, number, number], color: "#67e8f9" },
  { label: "ANALYTICS", view: "Analytics" as const, position: [2.25, -0.95, 0.2] as [number, number, number], color: "#86efac" },
  { label: "PROFILE", view: "Profile" as const, position: [0, -2.05, -0.05] as [number, number, number], color: "#c4b5fd" },
];

const sectionStates: Record<CosmosSection, { camera: [number, number, number]; target: [number, number, number]; focus: string; ambient: number }> = {
  Dashboard: { camera: [0, 1.5, 15], target: [0, 0, 0], focus: "sun", ambient: 1 },
  Schedule: { camera: [4.8, 1.4, 11], target: [3.5, 0, 0], focus: "saturn", ambient: .9 },
  Syllabus: { camera: [-3.2, 1.8, 12], target: [-2, 0, 0], focus: "earth", ambient: .95 },
  Tasks: { camera: [-2.8, .4, 9], target: [-2.5, 0, 0], focus: "earth", ambient: 1 },
  Study: { camera: [-1.4, -.8, 10], target: [-1, 0, 0], focus: "mars", ambient: .9 },
  Goals: { camera: [3.2, 1, 10], target: [3, 0, 0], focus: "jupiter", ambient: 1.05 },
  Analytics: { camera: [0, 5.5, 17], target: [0, 0, 0], focus: "sun", ambient: .9 },
  Roadmap: { camera: [0, 2.2, 19], target: [1, 0, 0], focus: "neptune", ambient: .8 },
  Knowledge: { camera: [-4, 1, 13], target: [-3, 0, 0], focus: "venus", ambient: .9 },
  Profile: { camera: [4.5, -1.8, 13], target: [4, -1, 0], focus: "uranus", ambient: .8 },
  Settings: { camera: [0, -3, 18], target: [0, -1, 0], focus: "neptune", ambient: .65 },
};

const planetData = [
  { name: "mercury", radius: .18, distance: 1.8, speed: 1.3, color: "#a8a29e" },
  { name: "venus", radius: .28, distance: 2.7, speed: .95, color: "#f0b56a" },
  { name: "earth", radius: .34, distance: 3.7, speed: .72, color: "#4fa3d1" },
  { name: "mars", radius: .25, distance: 4.7, speed: .58, color: "#c66b55" },
  { name: "jupiter", radius: .72, distance: 6.3, speed: .38, color: "#c9956a" },
  { name: "saturn", radius: .58, distance: 8, speed: .27, color: "#d9bd83" },
  { name: "uranus", radius: .42, distance: 9.7, speed: .2, color: "#8bd4d8" },
  { name: "neptune", radius: .4, distance: 11.1, speed: .16, color: "#5579d6" },
];

function StarField() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(720 * 3);
    for (let i = 0; i < 720; i += 1) {
      const angle = i * 2.39996;
      const radius = 12 + (i % 17) * 1.15;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = ((i * 37) % 260) / 10 - 13;
      values[i * 3 + 2] = Math.sin(angle) * radius - 4;
    }
    return values;
  }, []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * .003; });
  return <points ref={ref}><bufferGeometry attach="geometry"><bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} itemSize={3} /></bufferGeometry><pointsMaterial color="#b9c7ff" size={.035} transparent opacity={.7} sizeAttenuation /></points>;
}

function OrbitPaths() {
  return <>{planetData.map((planet, i) => <mesh key={planet.name} rotation={[Math.PI / 2 + (i % 2) * .08, 0, i * .11]}><torusGeometry args={[planet.distance, .008, 6, 96]} /><meshBasicMaterial color={i % 2 ? "#67e8f9" : "#a78bfa"} transparent opacity={.11 - i * .006} /></mesh>)}</>;
}

function Planet({ planet, active }: { planet: typeof planetData[number]; active: boolean }) {
  const ref = useRef<Mesh>(null);
  const orbit = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !orbit.current) return;
    const t = clock.elapsedTime * planet.speed * .08 + planet.distance;
    orbit.current.position.set(Math.cos(t) * planet.distance, Math.sin(t * .7) * .22, Math.sin(t) * planet.distance * .55);
    ref.current.rotation.y += .002 + (active ? .002 : 0);
    const scale = active ? 1.12 : 1;
    ref.current.scale.lerp(new Vector3(scale, scale, scale), .04);
  });
  return <group ref={orbit}><mesh ref={ref}><sphereGeometry args={[planet.radius, 20, 20]} /><meshStandardMaterial color={planet.color} roughness={.78} metalness={.05} emissive={active ? planet.color : "#000000"} emissiveIntensity={active ? .18 : 0} /></mesh>{planet.name === "saturn" && <mesh rotation={[.35, .2, -.15]}><torusGeometry args={[planet.radius * 1.65, .055, 8, 48]} /><meshStandardMaterial color="#d8c28e" transparent opacity={.62} /></mesh>}</group>;
}

function SolarScene({ activeSection }: { activeSection: CosmosSection }) {
  const { camera } = useThree();
  const root = useRef<Group>(null);
  const target = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = sectionStates[activeSection];
  useFrame((_, delta) => {
    const speed = reducedMotion ? .035 : .09;
    camera.position.x = MathUtils.lerp(camera.position.x, state.camera[0] + pointer.current.x * (reducedMotion ? .05 : .28), speed);
    camera.position.y = MathUtils.lerp(camera.position.y, state.camera[1] + pointer.current.y * (reducedMotion ? .05 : .18), speed);
    camera.position.z = MathUtils.lerp(camera.position.z, state.camera[2], speed);
    target.current.set(...state.target);
    camera.lookAt(target.current);
    if (root.current) {
      root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, (reducedMotion ? 0 : pointer.current.x * .025) + (activeSection.length % 4) * .035, speed);
      root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, pointer.current.y * .015, speed);
    }
  });
  return <group ref={root} onPointerMove={event => { pointer.current.x = (event.point.x / 12); pointer.current.y = (event.point.y / 8); }}>
    <ambientLight intensity={state.ambient * .22} color="#8398ff" /><pointLight position={[0, 0, 1]} intensity={32} distance={18} color="#ffd38a" />
    <mesh><sphereGeometry args={[.92, 32, 32]} /><meshStandardMaterial color="#ffb347" emissive="#ff8c24" emissiveIntensity={2.2} roughness={.5} /></mesh>
    <mesh scale={1.35}><sphereGeometry args={[1, 24, 24]} /><meshBasicMaterial color="#ffbd69" transparent opacity={.1} /></mesh>
    <OrbitPaths />
    {planetData.map(planet => <Planet key={planet.name} planet={planet} active={state.focus === planet.name} />)}
    <StarField /><Sparkles count={reducedMotion ? 25 : 80} scale={24} size={1.4} speed={reducedMotion ? .04 : .12} color="#b9c7ff" />
  </group>;
}

export function SolarSystemBackground({ activeSection, dimmed = false }: { activeSection: CosmosSection; dimmed?: boolean }) {
  return <div className={`solar-background ${dimmed ? "solar-background-dimmed" : ""}`} aria-hidden="true"><Canvas camera={{ position: sectionStates[activeSection].camera, fov: 42 }} dpr={[.7, 1.25]} gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}><SolarScene activeSection={activeSection} /></Canvas></div>;
}

function Core({ onNavigate }: { onNavigate: SpatialCoreProps["onNavigate"] }) { const ref = useRef<Group>(null); useFrame((_, delta) => { if (ref.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current.rotation.y += delta * 0.08; }); return <group ref={ref}><mesh><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color="#211744" emissive="#8b5cf6" emissiveIntensity={1.15} metalness={0.7} roughness={0.25} /></mesh><mesh scale={0.62}><sphereGeometry args={[1, 24, 24]} /><meshBasicMaterial color="#d8b4fe" wireframe transparent opacity={0.45} /></mesh><Text position={[0, 0, 0.72]} fontSize={0.16} color="#f5f3ff" anchorX="center" anchorY="middle">COSMOS</Text>{nodes.map(node => <OrbitalNode key={node.label} {...node} onClick={() => onNavigate(node.view)} />)}</group>; }
function OrbitalNode({ label, position, color, onClick }: { label: string; position: [number, number, number]; color: string; onClick: () => void }) { const ref = useRef<Mesh>(null); const pulse = useMemo(() => 1 + Math.random() * 0.2, []); useFrame(({ clock }) => { if (ref.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) { const scale = 1 + Math.sin(clock.elapsedTime * 1.6 + pulse) * 0.045; ref.current.scale.setScalar(scale); } }); return <group position={position}><mesh ref={ref} onClick={onClick} onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}><sphereGeometry args={[0.24, 20, 20]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} metalness={0.5} roughness={0.3} /></mesh><Text position={[0, -0.46, 0]} fontSize={0.12} color="#bbb6d6" anchorX="center" anchorY="middle">{label}</Text></group>; }

export function SpatialCore({ tasks, goals, roadmap, onNavigate }: SpatialCoreProps) { return <section className="spatial-panel" aria-label="Interactive COSMOS spatial map"><div className="spatial-copy"><span className="eyebrow">SPATIAL COMMAND CENTER</span><h3>Navigate your academic universe</h3><p>Click an orbital module to open its normal workspace view.</p><div className="spatial-stats"><span><strong>{tasks}</strong> open tasks</span><span><strong>{goals}</strong> goals</span><span><strong>{roadmap}%</strong> roadmap</span></div></div><div className="spatial-canvas"><Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}><ambientLight intensity={0.7} /><pointLight position={[2, 3, 4]} intensity={18} color="#a78bfa" /><pointLight position={[-3, -2, 2]} intensity={10} color="#67e8f9" /><Sparkles count={35} scale={7} size={1.8} speed={0.18} color="#c4b5fd" /><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, .008, 8, 96]} /><meshBasicMaterial color="#a78bfa" transparent opacity={.2} /></mesh><Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.18}><Core onNavigate={onNavigate} /></Float><OrbitControls enablePan={false} minDistance={5.5} maxDistance={8} autoRotate={false} /></Canvas></div></section>; }

export { sectionStates };
