export function getRelation(rootId: string, targetId: string, members: any[]) {
  if (!rootId || !targetId) return "";
  if (rootId === targetId) return "Pusat Silsilah";

  const root = members.find((m) => m.id === rootId);
  const target = members.find((m) => m.id === targetId);
  if (!root || !target) return "";

  // Helper functions
  const getParents = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? [m.fatherId, m.motherId].filter(Boolean) : [];
  };

  const rootParents = getParents(rootId);
  const targetParents = getParents(targetId);

  // Cache data Anak dan Saudara Kandung biar ngitungnya gampang
  const rootChildren = members
    .filter((m) => getParents(m.id).includes(rootId))
    .map((m) => m.id);
  const rootSiblings = members
    .filter(
      (m) =>
        m.id !== rootId &&
        rootParents.length > 0 &&
        (rootParents.includes(m.fatherId) || rootParents.includes(m.motherId)),
    )
    .map((m) => m.id);

  // 1. Orang Tua
  if (rootParents.includes(targetId))
    return target.gender === "L" ? "Ayah" : "Ibu";

  // 2. Anak
  if (targetParents.includes(rootId))
    return target.gender === "L" ? "Anak (L)" : "Anak (P)";

  // 3. Pasangan
  const actualSpouse = members.find(
    (m) => m.id === root.spouseId || m.spouseId === rootId,
  );
  if (actualSpouse && actualSpouse.id === targetId)
    return target.gender === "L" ? "Suami" : "Istri";

  // 4. Saudara Kandung
  if (rootSiblings.includes(targetId))
    return target.gender === "L" ? "Saudara (L)" : "Saudara (P)";

  // 5. Kakek / Nenek
  const rootGrandparents = rootParents.flatMap((pId) => getParents(pId));
  if (rootGrandparents.includes(targetId))
    return target.gender === "L" ? "Kakek" : "Nenek";

  // 6. Cucu
  const rootGrandchildren = members
    .filter((m) => getParents(m.id).some((pId) => rootChildren.includes(pId)))
    .map((m) => m.id);
  if (rootGrandchildren.includes(targetId))
    return target.gender === "L" ? "Cucu (L)" : "Cucu (P)";

  // 7. Paman / Bibi
  const parentSiblings = rootParents.flatMap((pId) => {
    const pParents = getParents(pId);
    return members
      .filter(
        (m) =>
          m.id !== pId &&
          pParents.length > 0 &&
          (pParents.includes(m.fatherId) || pParents.includes(m.motherId)),
      )
      .map((m) => m.id);
  });
  if (parentSiblings.includes(targetId))
    return target.gender === "L" ? "Paman" : "Bibi";

  // 8. Keponakan
  const nephews = members
    .filter((m) => getParents(m.id).some((pId) => rootSiblings.includes(pId)))
    .map((m) => m.id);
  if (nephews.includes(targetId))
    return target.gender === "L" ? "Keponakan (L)" : "Keponakan (P)";

  // 9. Sepupu
  const cousins = members
    .filter((m) => getParents(m.id).some((pId) => parentSiblings.includes(pId)))
    .map((m) => m.id);
  if (cousins.includes(targetId)) return "Sepupu";

  // 10. Buyut
  const rootGreatGrandparents = rootGrandparents.flatMap((pId) =>
    getParents(pId),
  );
  if (rootGreatGrandparents.includes(targetId))
    return target.gender === "L" ? "Kakek Buyut" : "Nenek Buyut";

  // 11. Kakek Paman / Nenek Bibi
  const grandparentSiblings = rootGrandparents.flatMap((gpId) => {
    const gpParents = getParents(gpId);
    return members
      .filter(
        (m) =>
          m.id !== gpId &&
          gpParents.length > 0 &&
          (gpParents.includes(m.fatherId) || gpParents.includes(m.motherId)),
      )
      .map((m) => m.id);
  });
  if (grandparentSiblings.includes(targetId))
    return target.gender === "L" ? "Kakek Paman" : "Nenek Bibi";

  // ==========================================
  // JALUR PERNIKAHAN (IN-LAWS) BARU DITAMBAHIN
  // ==========================================

  // 12. Menantu (Pasangan dari Anak) --> BUAT SITI & TARJO
  const isMenantu = members.some(
    (m) =>
      rootChildren.includes(m.id) &&
      (m.spouseId === targetId || target.spouseId === m.id),
  );
  if (isMenantu) return target.gender === "L" ? "Menantu (L)" : "Menantu (P)";

  // 13. Mertua (Orang Tua dari Pasangan) --> BUAT BAMBANG & SRI KALO SITI DIKLIK
  if (actualSpouse) {
    const spouseParents = getParents(actualSpouse.id);
    if (spouseParents.includes(targetId))
      return target.gender === "L" ? "Bapak Mertua" : "Ibu Mertua";
  }

  // 14. Ipar (Saudara Pasangan ATAU Pasangan dari Saudara)
  const isIpar = members.some(
    (m) =>
      // Cek apakah target adalah pasangan dari saudara kandungnya si root
      (rootSiblings.includes(m.id) &&
        (m.spouseId === targetId || target.spouseId === m.id)) ||
      // Atau cek apakah target adalah saudara kandungnya pasangannya si root
      (actualSpouse &&
        members.find(
          (x) =>
            x.id === targetId &&
            getParents(targetId).some((p) =>
              getParents(actualSpouse.id).includes(p),
            ),
        )),
  );
  if (isIpar) return target.gender === "L" ? "Ipar (L)" : "Ipar (P)";

  return "";
}
