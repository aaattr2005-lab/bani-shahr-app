import React, { useState, useMemo } from "react";
import {
  X,
  GitBranch,
  BookOpen,
  Search,
  MapPin,
  Sparkles,
  Users,
  Shield,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Info,
  Crown,
  Share2,
  Bookmark
} from "lucide-react";
import {
  BANI_SHAHR_ROOT_LINEAGE,
  MAIN_BRANCHES_DATA,
  ALL_BANI_SHAHR_BUTOON,
  GENEALOGY_STATISTICS,
  MainBranch,
  BatnItem
} from "../data/genealogyData";

interface BaniShahrGenealogyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTribeBranch?: (branchName: string) => void;
}

export const BaniShahrGenealogyModal: React.FC<BaniShahrGenealogyModalProps> = ({
  isOpen,
  onClose,
  onSelectTribeBranch
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBranchId, setExpandedBranchId] = useState<string | null>("shahr-tharameen");
  const [selectedBatnDetail, setSelectedBatnDetail] = useState<BatnItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered branches and butoon
  const filteredBranches = useMemo(() => {
    return MAIN_BRANCHES_DATA.filter((branch) => {
      if (selectedBranchId !== "all" && branch.id !== selectedBranchId) {
        return false;
      }
      if (selectedRegionFilter !== "all") {
        if (selectedRegionFilter === "السراة" && !branch.region.includes("السراة")) return false;
        if (selectedRegionFilter === "تهامة" && !branch.region.includes("تهامة")) return false;
        if (selectedRegionFilter === "البادية" && !branch.region.includes("البادية")) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesBranch =
          branch.name.toLowerCase().includes(q) ||
          (branch.alias && branch.alias.toLowerCase().includes(q)) ||
          branch.settlementLocation.toLowerCase().includes(q);
        const matchesAnyBatn = branch.butoon.some(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            (b.subGroup && b.subGroup.toLowerCase().includes(q)) ||
            (b.notes && b.notes.toLowerCase().includes(q)) ||
            (b.prominentFigures && b.prominentFigures.some((p) => p.toLowerCase().includes(q)))
        );
        return matchesBranch || matchesAnyBatn;
      }
      return true;
    });
  }, [selectedBranchId, selectedRegionFilter, searchQuery]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "شجرة قبيلة بني شهر — الفروع والبطون المعتمدة",
        text: "توثيق شجرة قبيلة بني شهر من كتاب محمد بن دهمان الشهري — تأليف علي بن شايخ البكري الشهري",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <GitBranch className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold font-['Amiri'] text-amber-200">
                  شجرة قبيلة بني شهر — الفروع والبطون
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                  12 فرعاً رئيسياً • {GENEALOGY_STATISTICS.totalButoon} بطناً
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>المصدر: كتاب "محمد بن دهمان الشهري" — تأليف علي بن شايخ البكري الشهري</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-stone-700"
              title="مشاركة شجرة الأنساب"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{copiedLink ? "تم النسخ!" : "مشاركة"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-200 border border-stone-700 hover:border-rose-700 transition-all"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* 1. Ancestral Lineage Chain Box (الأصل والنسب) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900/90 to-stone-900 border border-amber-500/20 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-bold">
                <Crown className="w-4 h-4" />
                <span>سلسلة النسب والأصل الشريف الموثق</span>
              </div>
              <span className="text-[11px] text-stone-400 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700">
                نسب أزدي قحطاني
              </span>
            </div>

            {/* Step-by-step Lineage Flow */}
            <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-bold text-stone-200">
              {BANI_SHAHR_ROOT_LINEAGE.lineagePath.map((item, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-amber-300 text-center shrink-0 shadow-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <ChevronLeft className="w-4 h-4 text-amber-500/70 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-stone-400 mt-2 leading-relaxed border-t border-stone-800/80 pt-2">
              تنتسب قبيلة بني شهر إلى ربيعة بن الحجر بن الهنو بن الأزد من قحطان، ويشمل هذا التوثيق الفروع الرئيسية الـ 12 والبطون المتفرعة عنها في السراة وتهامة والبادية مع ربط كل بطن بفرعه الأصلي عبر معرّف مستقل لمنع أي التباس في الأسماء المتشابهة.
            </p>
          </div>

          {/* 2. Stats & Filters Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-stone-900/80 p-3 sm:p-4 rounded-2xl border border-stone-800">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="ابحث عن بطن، فرع، شخصية، أو قرية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "كافة المناطق" },
                { id: "السراة", label: "السراة" },
                { id: "تهامة", label: "تهامة" },
                { id: "البادية", label: "البادية" }
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setSelectedRegionFilter(rf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedRegionFilter === rf.id
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Branch Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedBranchId("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedBranchId === "all"
                  ? "bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-950"
                  : "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
              }`}
            >
              عرض كافة الفروع (12)
            </button>
            {MAIN_BRANCHES_DATA.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBranchId(b.id);
                  setExpandedBranchId(b.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedBranchId === b.id
                    ? "bg-amber-600 text-white shadow-md border border-amber-400/40"
                    : "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                }`}
              >
                <span className="font-mono text-amber-400 text-[11px]">{b.number}.</span>
                <span>{b.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-stone-400">
                  {b.butoonCount}
                </span>
              </button>
            ))}
          </div>

          {/* 4. Disambiguation Notice Alert */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300">ملاحظة التوثيق والربط الأنسابي:</strong> تم ترميز كل بطن بمعرّف فريد مرتبط بفرعه الأم (parent_id) مثل بطن <strong>«آل موسى» في فرع آل العلاء</strong> وبطن <strong>«آل موسى» في فرع آل الجيحني</strong> لتفادي أي خلط أو تكرار بين الأسماء المتشابهة في القبائل.
            </div>
          </div>

          {/* 5. 12 Branches Cards & Hierarchy Accordions */}
          <div className="space-y-4">
            {filteredBranches.map((branch) => {
              const isExpanded = expandedBranchId === branch.id || selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  id={`branch-${branch.id}`}
                  className="rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 shadow-md overflow-hidden transition-all"
                >
                  {/* Branch Header */}
                  <div
                    onClick={() => setExpandedBranchId(isExpanded ? null : branch.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none bg-stone-900/60 hover:bg-stone-850 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm font-mono shrink-0">
                        {branch.number}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-white font-['Amiri']">
                            {branch.name}
                          </h3>
                          {branch.alias && (
                            <span className="text-xs text-stone-400">({branch.alias})</span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px] font-medium border border-stone-700">
                            {branch.settlementLocation}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                          {branch.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                        {branch.butoon.length} بطون
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-amber-400" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Branch Content (Expanded) */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-stone-800/80 bg-stone-950/40 space-y-4 animate-fadeIn">
                      
                      {/* Sub-groups for Awamir if available */}
                      {branch.subGroups && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          {branch.subGroups.map((sg) => (
                            <div
                              key={sg.id}
                              className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="text-amber-300 font-bold block text-sm">
                                  {sg.name}
                                </span>
                                <span className="text-stone-400 text-[11px]">
                                  {sg.region} • {sg.butoonIds.length} بطون
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px]">
                                فرع رئيسي
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Butoon Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {branch.butoon.map((batn) => (
                          <div
                            key={batn.id}
                            id={`batn-${batn.id}`}
                            onClick={() => setSelectedBatnDetail(batn)}
                            className="p-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-['Amiri']">
                                  {batn.name}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px]">
                                  {batn.region}
                                </span>
                              </div>

                              {batn.subGroup && (
                                <div className="text-[11px] text-amber-400/90 font-medium mb-1">
                                  {batn.subGroup}
                                </div>
                              )}

                              {batn.notes && (
                                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                                  {batn.notes}
                                </p>
                              )}

                              {batn.prominentFigures && batn.prominentFigures.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/20">
                                  <Shield className="w-3 h-3 shrink-0" />
                                  <span>{batn.prominentFigures.join("، ")}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                              <span className="font-mono text-[10px] text-stone-400">
                                ID: {batn.id}
                              </span>
                              <span className="text-amber-400/80 group-hover:text-amber-300 text-xs font-bold flex items-center gap-0.5">
                                تفاصيل <ChevronLeft className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick jump to Tribe directory if handler is present */}
                      {onSelectTribeBranch && (
                        <div className="text-center pt-2">
                          <button
                            onClick={() => onSelectTribeBranch(branch.name)}
                            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline"
                          >
                            <span>استكشف قرى وفخوذ {branch.name} في دليل القبائل</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredBranches.length === 0 && (
              <div className="text-center py-12 bg-stone-900/60 rounded-2xl border border-stone-800">
                <p className="text-sm text-stone-400">
                  لم يتم العثور على بطون أو فروع تطابق بحثك "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedBranchId("all");
                    setSelectedRegionFilter("all");
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                >
                  إعادة ضبط التصفية
                </button>
              </div>
            )}
          </div>

          {/* 6. Footer Citation & Historical Attribution */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>التوثيق المرجعي المعتمد</span>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              كتاب: «محمد بن دهمان الشهري ودوره في بسط نفوذ الدولة السعودية الأولى إلى بلاد بني شهر»
            </p>
            <p className="text-[11px] text-stone-400">
              تأليف الباحث والمؤرخ: <strong>علي بن شايخ البكري الشهري</strong> • حفظ الله تاريخ وتراث آبائنا وأجدادنا
            </p>
          </div>
        </div>

        {/* Selected Batn Detail Modal Backdrop */}
        {selectedBatnDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h4 className="text-lg font-bold text-white font-['Amiri']">
                    {selectedBatnDetail.name}
                  </h4>
                  <span className="text-xs text-amber-400 font-medium">
                    الفرع: {selectedBatnDetail.branchName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBatnDetail(null)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-stone-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-400">المنطقة الجغرافية:</span>
                  <span className="font-bold text-amber-300">{selectedBatnDetail.region}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-400">المعرّف الأنسابي (Parent ID):</span>
                  <span className="font-mono text-emerald-400">{selectedBatnDetail.parentBranchId}</span>
                </div>

                {selectedBatnDetail.subGroup && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                    <span className="text-stone-400">التصنيف والفرع:</span>
                    <span className="font-bold text-white">{selectedBatnDetail.subGroup}</span>
                  </div>
                )}

                {selectedBatnDetail.notes && (
                  <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800 leading-relaxed">
                    <span className="text-stone-400 block mb-1">نبذة وتوثيق:</span>
                    <p className="text-stone-200">{selectedBatnDetail.notes}</p>
                  </div>
                )}

                {selectedBatnDetail.villagesOrCenters && (
                  <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                    <span className="text-stone-400 block mb-1">المراكز والقرى المشهورة:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedBatnDetail.villagesOrCenters.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBatnDetail(null)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
