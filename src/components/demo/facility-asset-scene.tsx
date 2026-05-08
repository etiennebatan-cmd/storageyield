"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface SceneFacility {
  name: string;
  occupancy_pct: number;
  occupied_units: number;
  available_units: number;
  reserved_units: number;
  maintenance_units: number;
  monthly_rent: number;
}

const statusColors = {
  occupied: new THREE.Color("#0f766e"),
  available: new THREE.Color("#84cc16"),
  reserved: new THREE.Color("#f59e0b"),
  maintenance: new THREE.Color("#dc2626")
};

export function FacilityAssetScene({ facilities }: { facilities: SceneFacility[] }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ede9dd");
    scene.fog = new THREE.Fog("#ede9dd", 26, 62);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(11, 10, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight("#fff7df", "#64748b", 2.4);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff4cc", 3.4);
    sun.position.set(8, 12, 7);
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(42, 24),
      new THREE.MeshStandardMaterial({ color: "#d7d0bf", roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    group.add(floor);

    const railMaterial = new THREE.MeshStandardMaterial({ color: "#6b7280", roughness: 0.8 });
    const roofMaterial = new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.7, metalness: 0.05 });
    const labelMaterial = new THREE.MeshStandardMaterial({ color: "#fafaf9", roughness: 0.6 });

    facilities.forEach((facility, facilityIndex) => {
      const cluster = new THREE.Group();
      const xOffset = (facilityIndex - (facilities.length - 1) / 2) * 11.5;
      cluster.position.x = xOffset;
      group.add(cluster);

      const site = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 0.12, 8.2),
        new THREE.MeshStandardMaterial({ color: facilityIndex === 0 ? "#c8bda8" : facilityIndex === 1 ? "#c3c9bf" : "#bfc9ca", roughness: 0.9 })
      );
      site.position.y = 0.03;
      cluster.add(site);

      const statuses = [
        ...Array.from({ length: facility.occupied_units }, () => "occupied" as const),
        ...Array.from({ length: facility.available_units }, () => "available" as const),
        ...Array.from({ length: facility.reserved_units }, () => "reserved" as const),
        ...Array.from({ length: facility.maintenance_units }, () => "maintenance" as const)
      ].slice(0, 96);

      const geometry = new THREE.BoxGeometry(0.58, 0.34, 0.82);
      const material = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.08 });
      const mesh = new THREE.InstancedMesh(geometry, material, statuses.length);
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color();

      statuses.forEach((status, i) => {
        const col = i % 12;
        const row = Math.floor(i / 12);
        const height = status === "occupied" ? 0.72 : status === "reserved" ? 0.54 : status === "maintenance" ? 0.42 : 0.34;
        matrix.compose(
          new THREE.Vector3(-3.65 + col * 0.66, height / 2 + 0.12, -2.7 + row * 0.88),
          new THREE.Quaternion(),
          new THREE.Vector3(1, height / 0.34, 1)
        );
        mesh.setMatrixAt(i, matrix);
        color.copy(statusColors[status]).offsetHSL(0, 0, facilityIndex * -0.03);
        mesh.setColorAt(i, color);
      });
      cluster.add(mesh);

      const revenueHeight = Math.max(1.6, Math.min(5.4, facility.monthly_rent / 8500));
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, revenueHeight, 1.45),
        new THREE.MeshStandardMaterial({ color: "#2563eb", roughness: 0.42, metalness: 0.14 })
      );
      tower.position.set(3.7, revenueHeight / 2 + 0.12, 2.8);
      cluster.add(tower);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 1.8), roofMaterial);
      cap.position.set(3.7, revenueHeight + 0.3, 2.8);
      cluster.add(cap);

      const sign = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.42), labelMaterial);
      sign.position.set(-2.8, 0.42, 3.8);
      cluster.add(sign);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.12, 0.12), railMaterial);
      rail.position.set(0, 0.34, -3.72);
      cluster.add(rail);
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    host.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 0.01;
      group.rotation.y += (pointer.x * 0.18 + Math.sin(frame) * 0.045 - group.rotation.y) * 0.04;
      group.rotation.x += (-pointer.y * 0.045 - group.rotation.x) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [facilities]);

  return <div ref={hostRef} className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full" aria-hidden="true" />;
}
