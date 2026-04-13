"use client";

import React, { useEffect, useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

import { getFamilyMembers } from "@/app/actions/family";
import { transformDataToFlow } from "@/app/utils/dataMapper";
import { getLayoutedElements } from "@/app/utils/treeLayout";
import { getRelation } from "@/app/utils/calculateRelation"; // <-- Import fungsi kalkulasi

import FamilyNode from "@/app/components/FamilyNode";
import UnionNode from "@/app/components/UnionNode";
import FamilyDetailModal from "@/app/components/FamilyDetailModal";

const nodeTypes = {
  familyNode: FamilyNode,
  unionNode: UnionNode,
};

export default function FamilyTreePage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State Data
  const [rawMembers, setRawMembers] = useState<any[]>([]);
  const [rootPersonId, setRootPersonId] = useState<string>(""); // <-- State buat Tokoh Utama

  // State Modal
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Effect Pertama: Tarik Data dari Database
  useEffect(() => {
    const initTree = async () => {
      setLoading(true);
      const res = await getFamilyMembers();

      if (res.success && res.data && res.data.length > 0) {
        setRawMembers(res.data);

        // Bikin skema visualnya
        const { nodes: rawNodes, edges: rawEdges } = transformDataToFlow(
          res.data,
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(rawNodes, rawEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Jadikan orang pertama di database sebagai Tokoh Utama default
        setRootPersonId(res.data[0].id);
      }
      setLoading(false);
    };
    initTree();
  }, []);

  // 2. EFFECT KEDUA (INI KUNCINYA): Update Label kalau Tokoh Utama diganti
  useEffect(() => {
    // Kalau belum ada data, diam aja
    if (!rootPersonId || rawMembers.length === 0) return;

    // Kita update data di dalam nodes yang udah ada
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        // Kalau itu cuma titik pernikahan, lewatin
        if (node.type !== "familyNode") return node;

        // Kalau itu kotak orang, hitung ulang relasinya
        return {
          ...node,
          data: {
            ...node.data,
            relationLabel: getRelation(rootPersonId, node.id, rawMembers), // Panggil algoritma
          },
        };
      }),
    );
  }, [rootPersonId, rawMembers]);

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    if (node.type === "familyNode") {
      const memberData = rawMembers.find((m) => m.id === node.id);
      if (memberData) {
        setSelectedMember(memberData);
        setIsModalOpen(true);
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Memuat Silsilah Keluarga...
          </p>
        </div>
      </div>
    );

  return (
    <div className="h-screen w-full bg-slate-50 relative overflow-hidden">
      {/* Tombol Kelola Data (Kanan Atas) */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          href="/admin"
          className="bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          Kelola Data
        </Link>
      </div>

      {/* Canvas Pohon */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
      </ReactFlow>

      {/* Header Info Kiri Atas + Dropdown Tokoh Utama */}
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm max-w-xs">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Pohon Silsilah
        </h1>

        <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            Pusat Relasi
          </label>
          <select
            value={rootPersonId}
            onChange={(e) => setRootPersonId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 font-medium text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm outline-none cursor-pointer transition-all"
          >
            {rawMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal Detail */}
      <FamilyDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
        allMembers={rawMembers}
      />
    </div>
  );
}
