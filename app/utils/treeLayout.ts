import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

// Inisialisasi engine Dagre
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// ⚠️ PENTING: Ukuran ini harus mirip sama ukuran kotak asli lu di CSS nanti
// Biar Dagre bisa ngitung jarak spasi antar kotak dengan akurat
const PERSON_NODE_WIDTH = 250;
const PERSON_NODE_HEIGHT = 100;

// Ukuran khusus buat "Union Node" (Titik Pertemuan Pernikahan) yang ukurannya kecil
const UNION_NODE_WIDTH = 20;
const UNION_NODE_HEIGHT = 20;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
) => {
  // 'TB' artinya Top to Bottom (Dari atas ke bawah). Kalau mau ke samping ganti 'LR' (Left to Right)
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  // 1. Daftarin semua Node (kotak) ke Dagre beserta ukurannya
  nodes.forEach((node) => {
    // Kita cek apakah ini node orang biasa atau node pernikahan buatan kita
    const isUnion = node.id.startsWith("union-");

    dagreGraph.setNode(node.id, {
      width: isUnion ? UNION_NODE_WIDTH : PERSON_NODE_WIDTH,
      height: isUnion ? UNION_NODE_HEIGHT : PERSON_NODE_HEIGHT,
    });
  });

  // 2. Daftarin semua Edge (garis) biar Dagre tau siapa nyambung ke siapa
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 3. SURUH DAGRE NGITUNG POSISINYA SEKARANG!
  dagre.layout(dagreGraph);

  // 4. Ambil hasil itungannya, masukin ke objek Node bawaan React Flow
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isUnion = node.id.startsWith("union-");

    return {
      ...node,
      targetPosition: "top" as any,
      sourcePosition: "bottom" as any,
      // React Flow butuh posisi X dan Y. Kita kurangi setengah lebar/tinggi
      // biar titik kordinatnya ada di pas tengah-tengah kotak (Center Anchor).
      position: {
        x:
          nodeWithPosition.x -
          (isUnion ? UNION_NODE_WIDTH : PERSON_NODE_WIDTH) / 2,
        y:
          nodeWithPosition.y -
          (isUnion ? UNION_NODE_HEIGHT : PERSON_NODE_HEIGHT) / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
