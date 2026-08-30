import React, { useState } from "react";
import { DetailedTribe, DETAILED_TRIBES } from "../../../data/tribesData";
import { DataStore } from "../../../lib/datastore";
import { AppStorage } from "../../../lib/nativeStorage";
import {
  Users,
  Search,
  Plus,
  GitBranch,
  Building2,
  MapPin,
  Edit3,
  Trash2,
  CheckCircle2,
  Crown,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface TribesAndTreeTabProps {
  onNotification: (msg: string) => void;
}

export const TribesAndTreeTab: React.FC<TribesAndTreeTabProps> = ({ onNotification }) => {
  const [tribes, setTribes] = useState<DetailedTribe[]>(() => {
    try {
      const stored = AppStorage.getItem("bani_shahr_family_trees_v2_official_tribes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DETAILED_TRIBES;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTribe, setSelectedTribe] = useState<DetailedTribe | null>(tribes[0]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  // Add tribe modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTribeName, setNewTribeName] = useState("");
  const [newTribeDivision, setNewTribeDivision] = useState<any>("السراة والبادية");
  const [newTribeRegion, setNewTribeRegion] = useState("السراة");
  const [newTribeCenter, setNewTribeCenter] = useState("");
  const [newTribeChief, setNewTribeChief] = useState("");
  const [newTribeDesc, setNewTribeDesc] = useState("");

  const filteredTribes = tribes.filter(t => {
    const matchSearch = t.name.includes(searchTerm) || t.division.includes(searchTerm) || t.center.includes(searchTerm);
    const matchRegion = selectedRegion === "all" || (selectedRegion === "sarawat" && t.region.includes("السراة")) || (selectedRegion === "tihamah" && t.region.includes("تهامة"));
    return matchSearch && matchRegion;
  });

  const handleAddTribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTribeName) return;

    const newTribe: DetailedTribe = {
      id: "tribe-" + Date.now().toString().slice(-4),
      name: newTribeName,
      division: newTribeDivision,
      divisionNumber: 1,
      region: newTribeRegion as any,
      center: newTribeCenter || newTribeRegion,
      villagesCount: 12,
      description: newTribeDesc || `إحدى قبائل بني شهر العريقة بمحافظة ${newTribeRegion}.`,
      ancestorName: newTribeChief || "الجد المؤسس للقبيلة",
      highlights: ["مواقف الشرف والشهامة", "حماية القوافل والمحاصيل والوفادة"],
      afkhadh: [
        {
          id: "fakhdh-1",
          name: "فخذ آل " + newTribeName.replace("قبيلة ", ""),
          sheikhOrLeader: newTribeChief || "شيخ القبيلة",
          rootAncestor: "الجد المؤسس",
          villages: ["القرية التراثية", "الحصن العتيق"],
          description: "فرع أساسي من فروع القبيلة.",
          approximateFamilies: 150,
          familyTree: {
            id: "tree-root",
            name: newTribeName,
            generation: 1,
            isPatriarch: true,
            children: [
              {
                id: "tree-branch-1",
                name: "الفرع الأول",
                generation: 2,
                children: []
              }
            ]
          }
        }
      ]
    };

    const updated = [newTribe, ...tribes];
    setTribes(updated);
    AppStorage.setItem("bani_shahr_family_trees_v1_tribes", JSON.stringify(updated));
    DataStore.logAction({
      userId: "usr-super-admin-01",
      userName: "المدير العام",
      userRole: "super_admin",
      actionType: "CREATE",
      targetModule: "CONTENT",
      details: `إضافة قبيلة جديدة إلى النظام: [${newTribe.name}] بفرع [${newTribe.division}]`
    });

    setShowAddModal(false);
    setNewTribeName("");
    setNewTribeChief("");
    setNewTribeCenter("");
    setNewTribeDesc("");
    onNotification(`تمت إضافة قبيلة [${newTribe.name}] بنجاح إلى شجرة بني شهر`);
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>إدارة شجرة قبائل بني شهر الكبرى وفروع الأنساب</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            توثيق {tribes.length} قبيلة رئيسية، وإدارة بطون وأفخاذ السراة وتهامة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قبيلة / فرع جديد</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث عن قبيلة، مركز، أو فخذ..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setSelectedRegion("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedRegion === "all" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            الكل ({tribes.length})
          </button>
          <button
            onClick={() => setSelectedRegion("sarawat")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedRegion === "sarawat" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            السراة
          </button>
          <button
            onClick={() => setSelectedRegion("tihamah")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedRegion === "tihamah" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            تهامة
          </button>
        </div>
      </div>

      {/* Main Grid: Tribes list on right, Selected tribe tree on left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tribes Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredTribes.map(tribe => {
            const isSelected = selectedTribe?.id === tribe.id;
            return (
              <div
                key={tribe.id}
                onClick={() => setSelectedTribe(tribe)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-950/30 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40"
                    : "bg-stone-900/80 border-stone-800 hover:border-stone-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Amiri']">{tribe.name}</h4>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{tribe.center} - {tribe.region}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 font-mono">
                    {tribe.afkhadh.length} أفخاذ
                  </span>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span>المؤسس: <strong className="text-stone-200">{tribe.ancestorName || "معرف القبيلة"}</strong></span>
                  <span className="text-emerald-400 font-bold">{tribe.division}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tribe Details & Lineage Tree Visualizer */}
        <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 flex flex-col justify-between">
          {selectedTribe ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-['Amiri']">{selectedTribe.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedTribe.division}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    المركز: {selectedTribe.center} | الجد المؤسس: {selectedTribe.ancestorName}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-stone-800 text-stone-300 text-xs">
                  {selectedTribe.villagesCount} قرية موثقة
                </div>
              </div>

              {/* Afkhadh and Family Branches */}
              <div>
                <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-amber-400" />
                  <span>أفخاذ وعائلات {selectedTribe.name} (الهيكل المشجر):</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedTribe.afkhadh.map((fakhdh, idx) => {
                    const isExpanded = expandedNodes[fakhdh.id] ?? true;
                    return (
                      <div key={fakhdh.id} className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                        <div
                          onClick={() => toggleNode(fakhdh.id)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            <h5 className="text-xs font-bold text-white font-['Amiri']">{fakhdh.name}</h5>
                            <span className="text-[10px] text-stone-400">({fakhdh.ancestor})</span>
                          </div>

                          <div className="flex items-center gap-1 text-stone-400 hover:text-white">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-stone-800/80 text-[11px] space-y-2 text-stone-300">
                            <p className="text-stone-400 leading-relaxed">{fakhdh.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {fakhdh.villages.map((vil, vIdx) => (
                                <span
                                  key={vIdx}
                                  className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-stone-300 border border-stone-700"
                                >
                                  📍 {vil}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History highlights */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
                <p className="font-bold mb-1">📜 لمحة تاريخية موثقة:</p>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  {selectedTribe.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-stone-400 text-xs">
              اختر قبيلة من القائمة لاستعراض شجرة النسب وفروعها
            </div>
          )}
        </div>

      </div>

      {/* ADD TRIBE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>إضافة قبيلة / فرع جديد إلى شجرة بني شهر</span>
            </h4>

            <form onSubmit={handleAddTribe} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">اسم القبيلة</label>
                <input
                  type="text"
                  required
                  value={newTribeName}
                  onChange={(e) => setNewTribeName(e.target.value)}
                  placeholder="مثال: قبيلة آل بهيج"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">القسم الرئيسي</label>
                  <select
                    value={newTribeDivision}
                    onChange={(e) => setNewTribeDivision(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="السراة والبادية">السراة والبادية</option>
                    <option value="السراة وتهامة">السراة وتهامة</option>
                    <option value="شمال السراة">شمال السراة</option>
                    <option value="تهامة وجبل أثرب">تهامة وجبل أثرب</option>
                    <option value="تهامة وجبل ثربان">تهامة وجبل ثربان</option>
                    <option value="تهامة وأودية المجاردة">تهامة وأودية المجاردة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">المنطقة</label>
                  <select
                    value={newTribeRegion}
                    onChange={(e) => setNewTribeRegion(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="النماص">النماص</option>
                    <option value="تنومة">تنومة</option>
                    <option value="المجاردة">المجاردة</option>
                    <option value="بارق">بارق</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">شيخ القبيلة / المعرف</label>
                <input
                  type="text"
                  value={newTribeChief}
                  onChange={(e) => setNewTribeChief(e.target.value)}
                  placeholder="الشيخ فلان بن فلان الشهري"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">نبذة وتاريخ القبيلة</label>
                <textarea
                  rows={3}
                  value={newTribeDesc}
                  onChange={(e) => setNewTribeDesc(e.target.value)}
                  placeholder="وثائق تاريخية، معالم، قلاع وحصون..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  حفظ وتوثيق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
