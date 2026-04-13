import { Node, Edge } from "@xyflow/react";

export const transformDataToFlow = (members: any[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const unionsCreated = new Set<string>();

  members.forEach((member) => {
    // 1. Tambah Node Orang (Person Node)
    nodes.push({
      id: member.id,
      type: "familyNode", // Kita bakal bikin custom component ini nanti
      data: {
        name: member.name,
        gender: member.gender,
        photoUrl: member.photoUrl,
      },
      position: { x: 0, y: 0 }, // Posisi bakal diatur otomatis sama Dagre nanti
    });

    // 2. Logika Pernikahan (Union Node)
    // Jika punya pasangan, kita bikin satu titik pertemuan (Union) di tengah mereka
    if (member.spouseId) {
      // Bikin ID unik buat union (misal: union-budi-siti)
      // Kita urutkan ID-nya biar nggak bikin union ganda buat suami & istri
      const pair = [member.id, member.spouseId].sort();
      const unionId = `union-${pair[0]}-${pair[1]}`;

      if (!unionsCreated.has(unionId)) {
        // Tambah Node Union (Titik kecil transparan)
        nodes.push({
          id: unionId,
          type: "unionNode", // Custom component transparan
          data: { label: "" },
          position: { x: 0, y: 0 },
        });

        // Hubungkan Suami & Istri ke Union Node ini
        edges.push({
          id: `e-${pair[0]}-${unionId}`,
          source: pair[0],
          target: unionId,
          type: "smoothstep",
          animated: false,
        });
        edges.push({
          id: `e-${pair[1]}-${unionId}`,
          source: pair[1],
          target: unionId,
          type: "smoothstep",
        });

        unionsCreated.add(unionId);
      }
    }

    // 3. Logika Keturunan (Garis dari Orang Tua ke Anak)
    // Garis ditarik dari Union Node Orang Tua ke si Anak
    if (member.fatherId && member.motherId) {
      const parentPair = [member.fatherId, member.motherId].sort();
      const parentUnionId = `union-${parentPair[0]}-${parentPair[1]}`;

      edges.push({
        id: `child-${member.id}`,
        source: parentUnionId,
        target: member.id,
        type: "smoothstep",
      });
    } else if (member.fatherId || member.motherId) {
      // Case kalau cuma ada salah satu orang tua (Single Parent)
      edges.push({
        id: `child-single-${member.id}`,
        source: member.fatherId || member.motherId,
        target: member.id,
        type: "smoothstep",
      });
    }
  });

  return { nodes, edges };
};
