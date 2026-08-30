import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Search,
  Send,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GitBranch,
  Crown,
  Bell,
  BellRing,
  BookOpen,
  Calendar,
  Heart,
  Share2,
  Filter,
  Check,
  Bookmark,
  Camera,
  MessageSquare,
  Award
} from "lucide-react";
import { DETAILED_TRIBES, DetailedTribe, FakhdhItem, TreeNode, TribeDivision } from "../data/tribesData";
import { MEMORY_ITEMS_DATA, MEMORY_CATEGORIES_LIST } from "../data/memoriesData";
import { MemoryItem } from "../types";
import { SupervisorNominationModal } from "./SupervisorNominationModal";
import { BaniShahrGenealogyModal } from "./BaniShahrGenealogyModal";
import { AppStorage } from "../lib/nativeStorage";

interface TribesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedTribeId?: string;
}

const STORAGE_KEY_PREFIX = "bani_shahr_tribes_v3_official_";
const JOINED_TRIBES_STORAGE_KEY = "bani_shahr_joined_tribes_ids_v3";
const NOTIFICATIONS_STORAGE_KEY = "bani_shahr_tribal_notifications_v3";

export interface TribalNotification {
  id: string;
  tribeId: string;
  tribeName: string;
  title: string;
  message: string;
  category: "حفل زواج" | "إعلان رسمي" | "مناسبة وتكريم" | "تعزية ومواساة" | "اجتماع قبلي";
  eventDate?: string;
  location?: string;
  author: string;
  timestamp: string;
  isRead: boolean;
}

export const TribesModal: React.FC<TribesModalProps> = ({ isOpen, onClose, initialSelectedTribeId }) => {
  const [tribesList, setTribesList] = useState<DetailedTribe[]>(DETAILED_TRIBES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>("all");
  
  // Active selected Tribe
  const [selectedTribe, setSelectedTribe] = useState<DetailedTribe | null>(null);
  const [activeTab, setActiveTab] = useState<"afkhadh" | "tree" | "memory" | "announcements" | "broadcast">("afkhadh");
  const [selectedFakhdhId, setSelectedFakhdhId] = useState<string>("");

  // Joined Tribes State
  const [joinedTribeIds, setJoinedTribeIds] = useState<string[]>([]);
  const [showOnlyJoined, setShowOnlyJoined] = useState(false);
  const [justJoinedTribeName, setJustJoinedTribeName] = useState<string | null>(null);

  // Tribal Notifications State
  const [notifications, setNotifications] = useState<TribalNotification[]>([]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Supervisor (Admin) State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");

  // Supervisor Nomination Modal State
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [showGenealogyModal, setShowGenealogyModal] = useState(false);
  const [nominationDefaultTribeId, setNominationDefaultTribeId] = useState<string | undefined>(undefined);

  // Tree Node Creation/Editing State
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [targetParentNodeId, setTargetParentNodeId] = useState<string | null>(null);
  const [targetParentName, setTargetParentName] = useState<string>("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeBio, setNewNodeBio] = useState("");

  // Adding new Fakhdh state (For Supervisors)
  const [showAddFakhdhModal, setShowAddFakhdhModal] = useState(false);
  const [newFakhdhName, setNewFakhdhName] = useState("");
  const [newFakhdhSubTitle, setNewFakhdhSubTitle] = useState("");
  const [newFakhdhAncestor, setNewFakhdhAncestor] = useState("");
  const [newFakhdhVillages, setNewFakhdhVillages] = useState("");
  const [newFakhdhDesc, setNewFakhdhDesc] = useState("");

  // Adding Memory Story (ذاكرة بني شهر)
  const [tribeMemories, setTribeMemories] = useState<MemoryItem[]>(MEMORY_ITEMS_DATA);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyCategory, setStoryCategory] = useState<string>(MEMORY_CATEGORIES_LIST[0]);
  const [storyNarrator, setStoryNarrator] = useState("");
  const [storyContributor, setStoryContributor] = useState("");
  const [storyVillage, setStoryVillage] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [storySuccessMsg, setStorySuccessMsg] = useState(false);

  // Broadcast Message State (for supervisors)
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastCategory, setBroadcastCategory] = useState<"حفل زواج" | "إعلان رسمي" | "مناسبة وتكريم" | "تعزية ومواساة" | "اجتماع قبلي">("حفل زواج");
  const [broadcastEventDate, setBroadcastEventDate] = useState("");
  const [broadcastLocation, setBroadcastLocation] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Tree interactive state
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [treeSearchQuery, setTreeSearchQuery] = useState("");

  // Load state on mount
  useEffect(() => {
    try {
      // 1. Tribes List
      const savedTribes = AppStorage.getItem(`${STORAGE_KEY_PREFIX}tribes`);
      if (savedTribes) {
        const parsed = JSON.parse(savedTribes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTribesList(parsed);
        }
      }

      // 2. Joined Tribes
      const savedJoined = AppStorage.getItem(JOINED_TRIBES_STORAGE_KEY);
      if (savedJoined) {
        setJoinedTribeIds(JSON.parse(savedJoined));
      } else {
        // Default seed join for shahr-tharameen & balharith
        const defaultJoined = ["shahr-tharameen", "banu-altaym", "balharith"];
        setJoinedTribeIds(defaultJoined);
        AppStorage.setItem(JOINED_TRIBES_STORAGE_KEY, JSON.stringify(defaultJoined));
      }

      // 3. Notifications
      const savedNotifs = AppStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        const seedNotifs: TribalNotification[] = [
          {
            id: "notif-seed-1",
            tribeId: "balharith",
            tribeName: "بلحارث",
            title: "ندوة تاريخية: دور الأمير محمد بن دهمان الشهري",
            message: "استعراض وثائق كتاب محمد بن دهمان الشهري ودوره التاريخي في بسط نفوذ الدولة السعودية الأولى في السراة وتهامة.",
            category: "مناسبة وتكريم",
            eventDate: "الجمعة القادمة - بعد صلاة العشاء",
            location: "المركز الثقافي - النماص",
            author: "إدارة مناسبات بلحارث",
            timestamp: "منذ ساعتين",
            isRead: false
          },
          {
            id: "notif-seed-2",
            tribeId: "shahr-tharameen",
            tribeName: "شهر ثرامين",
            title: "ملتقى الكلاثمة وبني بكر السنوي لصلة الرحم",
            message: "دعوة عامة لحضور الملتقى السنوي لتعزيز أواصر التكافل وصلة الرحم وتكريم المتفوقين في قصر العسابلة بالنماص.",
            category: "اجتماع قبلي",
            eventDate: "يوم السبت القادم - 4:00 عصراً",
            location: "قصر العسابلة التراثي - النماص",
            author: "مشرف شهر ثرامين",
            timestamp: "منذ يوم واحد",
            isRead: false
          }
        ];
        setNotifications(seedNotifs);
        AppStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(seedNotifs));
      }

      // 4. Tribe Memories
      const savedMemories = AppStorage.getItem(`${STORAGE_KEY_PREFIX}memories`);
      if (savedMemories) {
        setTribeMemories(JSON.parse(savedMemories));
      }
    } catch (e) {
      console.error("Error loading data from localStorage:", e);
    }
  }, []);

  // Set initial tribe if passed in props
  useEffect(() => {
    if (initialSelectedTribeId && tribesList.length > 0) {
      const found = tribesList.find(t => t.id === initialSelectedTribeId);
      if (found) {
        setSelectedTribe(found);
        setSelectedFakhdhId(found.afkhadh[0]?.id || "");
      }
    }
  }, [initialSelectedTribeId, tribesList]);

  // Helper to save tribes
  const saveTribesToStorage = (updated: DetailedTribe[]) => {
    setTribesList(updated);
    try {
      AppStorage.setItem(`${STORAGE_KEY_PREFIX}tribes`, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving tribes:", e);
    }
  };

  // Helper to save joined tribes
  const toggleJoinTribe = (tribe: DetailedTribe) => {
    const isJoined = joinedTribeIds.includes(tribe.id);
    let newJoined: string[];
    if (isJoined) {
      newJoined = joinedTribeIds.filter(id => id !== tribe.id);
    } else {
      newJoined = [...joinedTribeIds, tribe.id];
      setJustJoinedTribeName(tribe.name);
      setTimeout(() => setJustJoinedTribeName(null), 3500);
    }
    setJoinedTribeIds(newJoined);
    try {
      AppStorage.setItem(JOINED_TRIBES_STORAGE_KEY, JSON.stringify(newJoined));
    } catch (e) {
      console.error("Error saving joined tribes:", e);
    }
  };

  if (!isOpen) return null;

  // Divisions constant list for navigation
  const DIVISIONS: { id: string; label: string; numberText: string }[] = [
    { id: "all", label: "جميع الفروع (12 فرعاً)", numberText: "12" },
    { id: "sarawat_badia", label: "السراة والبادية (ثرامين، بلحارث)", numberText: "سراة" },
    { id: "sarawat_tihamah", label: "السراة وتهامة (بنو التيم، العوامر)", numberText: "مشترك" },
    { id: "sham", label: "شمال السراة (شهر الشام)", numberText: "شام" },
    { id: "tihamah", label: "تهامة والأودية والجبال (7 فروع)", numberText: "تهامة" }
  ];

  const filteredTribes = tribesList.filter((tribe) => {
    const matchesSearch =
      tribe.name.includes(searchTerm) ||
      tribe.division.includes(searchTerm) ||
      tribe.center.includes(searchTerm) ||
      tribe.description.includes(searchTerm) ||
      tribe.afkhadh.some(f => f.name.includes(searchTerm) || (f.subTitle && f.subTitle.includes(searchTerm)) || f.villages.some(v => v.includes(searchTerm)));

    const matchesDivision =
      selectedDivisionFilter === "all" ||
      (selectedDivisionFilter === "sarawat_badia" && tribe.division === "السراة والبادية") ||
      (selectedDivisionFilter === "sarawat_tihamah" && tribe.division === "السراة وتهامة") ||
      (selectedDivisionFilter === "sham" && tribe.division === "شمال السراة") ||
      (selectedDivisionFilter === "tihamah" && (tribe.region === "تهامة" || tribe.division.includes("تهامة"))) ||
      tribe.divisionNumber.toString() === selectedDivisionFilter ||
      tribe.division === selectedDivisionFilter;

    const matchesJoinedOnly = !showOnlyJoined || joinedTribeIds.includes(tribe.id);

    return matchesSearch && matchesDivision && matchesJoinedOnly;
  });

  const currentTribe = selectedTribe
    ? tribesList.find(t => t.id === selectedTribe.id) || selectedTribe
    : null;

  const currentFakhdh = currentTribe
    ? currentTribe.afkhadh.find(f => f.id === selectedFakhdhId) || currentTribe.afkhadh[0]
    : null;

  // Unread notifications count for joined tribes
  const unreadCount = notifications.filter(n => joinedTribeIds.includes(n.tribeId) && !n.isRead).length;

  // Supervisor PIN Login
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin === "2026" || adminPin === "707") {
      setIsAdminLoggedIn(true);
      setShowAdminAuthModal(false);
      setAdminError("");
      setAdminPin("");
    } else {
      setAdminError("رمز المشرف غير صحيح. (رمز التجربة المعتمد: 1234 أو 707)");
    }
  };

  // Add child node to a tree
  const handleAddChildNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTribe || !currentFakhdh || !targetParentNodeId || !newNodeName.trim()) return;

    const addNodeRecursive = (node: TreeNode): TreeNode => {
      if (node.id === targetParentNodeId) {
        const newChild: TreeNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: newNodeName.trim(),
          title: newNodeTitle.trim() || undefined,
          generation: (node.generation || 1) + 1,
          bio: newNodeBio.trim() || undefined,
          children: []
        };
        return {
          ...node,
          children: [...(node.children || []), newChild]
        };
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(child => addNodeRecursive(child))
        };
      }

      return node;
    };

    const updatedTree = addNodeRecursive(currentFakhdh.familyTree);

    const updatedTribes = tribesList.map(t => {
      if (t.id === currentTribe.id) {
        return {
          ...t,
          afkhadh: t.afkhadh.map(f => {
            if (f.id === currentFakhdh.id) {
              return { ...f, familyTree: updatedTree };
            }
            return f;
          })
        };
      }
      return t;
    });

    saveTribesToStorage(updatedTribes);
    setShowAddNodeModal(false);
    setNewNodeName("");
    setNewNodeTitle("");
    setNewNodeBio("");
  };

  // Delete node from tree
  const handleDeleteNode = (nodeId: string) => {
    if (!currentTribe || !currentFakhdh) return;
    if (confirm("هل أنت متأكد من حذف هذا الاسم وفروعه من شجرة الأنساب؟")) {
      const deleteNodeRecursive = (node: TreeNode): TreeNode | null => {
        if (node.id === nodeId) return null;
        if (node.children) {
          const filtered = node.children
            .map(c => deleteNodeRecursive(c))
            .filter((c): c is TreeNode => c !== null);
          return { ...node, children: filtered };
        }
        return node;
      };

      const updatedTree = deleteNodeRecursive(currentFakhdh.familyTree);
      if (updatedTree) {
        const updatedTribes = tribesList.map(t => {
          if (t.id === currentTribe.id) {
            return {
              ...t,
              afkhadh: t.afkhadh.map(f => {
                if (f.id === currentFakhdh.id) {
                  return { ...f, familyTree: updatedTree };
                }
                return f;
              })
            };
          }
          return t;
        });
        saveTribesToStorage(updatedTribes);
      }
    }
  };

  // Create new Fakhdh (Supervisor)
  const handleCreateFakhdh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTribe || !newFakhdhName.trim() || !newFakhdhAncestor.trim()) return;

    const newFakhdh: FakhdhItem = {
      id: `fakhdh-${Date.now()}`,
      name: newFakhdhName.trim(),
      subTitle: newFakhdhSubTitle.trim() || undefined,
      sheikhOrLeader: "معرفو وأعيان الفخذ",
      villages: newFakhdhVillages.split("،").map(v => v.trim()).filter(Boolean),
      description: newFakhdhDesc.trim() || `فخذ عريق من فروع ${currentTribe.name}.`,
      approximateFamilies: 180,
      rootAncestor: newFakhdhAncestor.trim(),
      familyTree: {
        id: `root-${Date.now()}`,
        name: `الجد ${newFakhdhAncestor.trim()}`,
        title: "الجد المؤسس للفخذ",
        generation: 1,
        isPatriarch: true,
        children: []
      }
    };

    const updatedTribes = tribesList.map(t => {
      if (t.id === currentTribe.id) {
        return {
          ...t,
          afkhadh: [...t.afkhadh, newFakhdh]
        };
      }
      return t;
    });

    saveTribesToStorage(updatedTribes);
    setSelectedFakhdhId(newFakhdh.id);
    setShowAddFakhdhModal(false);
    setNewFakhdhName("");
    setNewFakhdhSubTitle("");
    setNewFakhdhAncestor("");
    setNewFakhdhVillages("");
    setNewFakhdhDesc("");
  };

  // Send broadcast notification (Supervisor)
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTribe || !broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const newNotif: TribalNotification = {
      id: `notif-${Date.now()}`,
      tribeId: currentTribe.id,
      tribeName: currentTribe.name,
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      category: broadcastCategory,
      eventDate: broadcastEventDate.trim() || undefined,
      location: broadcastLocation.trim() || undefined,
      author: currentTribe.supervisorName || "المشرف المعتمد",
      timestamp: "الآن",
      isRead: false
    };

    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    try {
      AppStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving notification:", e);
    }

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastTitle("");
      setBroadcastMessage("");
      setBroadcastEventDate("");
      setBroadcastLocation("");
      setActiveTab("announcements");
    }, 2000);
  };

  // Add new Memory Story (Visitor / Member)
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyContent.trim()) return;

    const newStory: MemoryItem = {
      id: `mem-user-${Date.now()}`,
      title: storyTitle.trim(),
      tribeBranch: currentTribe ? currentTribe.name : "عموم قبائل بني شهر",
      category: storyCategory as any,
      contentType: "oral_narration",
      narratorName: storyNarrator.trim() || "راوية من كبار السن",
      contributorName: storyContributor.trim() || "أحد أبناء القبيلة",
      villageOrLocation: storyVillage.trim() || (currentTribe ? currentTribe.center : "النماص وتنومة"),
      region: "النماص",
      content: storyContent.trim(),
      imageUrl: storyImageUrl.trim() || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
      status: "published",
      likesCount: 1,
      sharesCount: 0,
      tags: [currentTribe ? currentTribe.name : "بني شهر", storyCategory, "ذاكرة بني شهر"],
      createdAt: new Date().toISOString()
    };

    const updated = [newStory, ...tribeMemories];
    setTribeMemories(updated);
    try {
      AppStorage.setItem(`${STORAGE_KEY_PREFIX}memories`, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving story:", e);
    }

    setStorySuccessMsg(true);
    setTimeout(() => {
      setStorySuccessMsg(false);
      setShowAddStoryModal(false);
      setStoryTitle("");
      setStoryContent("");
      setStoryNarrator("");
      setStoryContributor("");
      setStoryVillage("");
      setStoryImageUrl("");
    }, 2000);
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    try {
      AppStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error updating notifications:", e);
    }
  };

  // Tree Node Recursive Renderer
  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const matchesSearch = treeSearchQuery.trim()
      ? node.name.includes(treeSearchQuery) || (node.bio && node.bio.includes(treeSearchQuery))
      : false;

    return (
      <div key={node.id} className="relative flex flex-col items-center my-2">
        <div
          className={`relative group px-4 py-3 rounded-2xl border transition-all shadow-md text-center min-w-[200px] max-w-[280px] ${
            node.isPatriarch
              ? "bg-gradient-to-br from-amber-900 to-amber-950 border-amber-400 text-amber-100 ring-2 ring-amber-400/50"
              : matchesSearch
              ? "bg-emerald-900/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400"
              : depth === 1
              ? "bg-stone-900 border-amber-600/60 text-stone-100 hover:border-amber-400"
              : "bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              node.isPatriarch ? "bg-amber-800/80 text-amber-200" : "bg-stone-800 text-stone-400"
            }`}>
              {node.isPatriarch ? "👑 الجد الأكبر" : `الجيل ${node.generation}`}
            </span>
            {hasChildren && (
              <button
                onClick={() => setCollapsedNodes(prev => ({ ...prev, [node.id]: !prev[node.id] }))}
                className="text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center gap-0.5"
              >
                {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 rotate-90" />}
                <span>{node.children?.length} فرع</span>
              </button>
            )}
          </div>

          <h4 className={`text-base font-bold font-['Amiri'] ${node.isPatriarch ? "text-amber-300 text-lg" : "text-white"}`}>
            {node.name}
          </h4>

          {node.title && <p className="text-[11px] text-amber-400/90 font-medium mt-0.5">{node.title}</p>}
          {node.bio && <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{node.bio}</p>}

          {isAdminLoggedIn && (
            <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setTargetParentNodeId(node.id);
                  setTargetParentName(node.name);
                  setShowAddNodeModal(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-[11px] font-bold text-white shadow"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة متفرع</span>
              </button>
              {!node.isPatriarch && (
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="p-1 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-800/40"
                  title="حذف هذا الاسم"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div className="relative pt-6 flex flex-col items-center">
            <div className="absolute top-0 w-0.5 h-6 bg-amber-500/40" />
            {node.children && node.children.length > 1 && (
              <div className="absolute top-6 h-0.5 bg-amber-500/40 w-[80%]" />
            )}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {node.children?.map(child => renderTreeNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filter memories for the current tribe
  const currentTribeMemories = currentTribe
    ? tribeMemories.filter(m => 
        m.tribeBranch.includes(currentTribe.name) ||
        m.tags.some(tag => tag.includes(currentTribe.name)) ||
        m.tribeBranch.includes("عموم قبائل بني شهر") ||
        (currentTribe.division.includes("بني التيم") && m.tribeBranch.includes("بني التيم")) ||
        (currentTribe.division.includes("بلحارث") && m.tribeBranch.includes("بلحارث")) ||
        (currentTribe.division.includes("بني أثلة") && m.tribeBranch.includes("بني أثلة")) ||
        (currentTribe.division.includes("تهامة") && m.region.includes("تهامة"))
      )
    : tribeMemories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-[#12201A] border border-[#7C9D86]/30 rounded-3xl shadow-2xl overflow-hidden text-[#F8F4EA] font-['IBM_Plex_Sans_Arabic']">
        
        {/* Al-Qatt Al-Asiri Top Geometric Pattern Strip */}
        <div className="qatt-asiri-header-strip" />

        {/* Floating Toast Notification on Joining */}
        {justJoinedTribeName && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#C7A25C] text-[#F8F4EA] shadow-2xl border border-[#D8BE8B]/60 flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-[#F8F4EA]" />
            <span className="text-xs sm:text-sm font-bold">
              تم انضمامك بنجاح إلى {justJoinedTribeName}! ستصلك كافة التنبيهات والأعراس والإعلانات فور صدورها.
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: OVERVIEW & TRIBES LIST (5 DIVISIONS) */}
        {/* ========================================================================= */}
        {!currentTribe ? (
          <>
            {/* Header */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-r from-[#12201A] via-[#1B2B22] to-[#12201A] border-b border-[#7C9D86]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C7A25C]/20 border border-[#C7A25C]/40 flex items-center justify-center text-[#C7A25C] shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold font-['Markazi_Text'] text-[#F8F4EA]">
                      دليل قبائل بني شهر العريقة
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C7A25C]/20 border border-[#C7A25C]/40 text-[#D8BE8B] text-xs font-bold">
                      5 أقسام رئيسية معتمدة
                    </span>
                  </div>
                  <p className="text-xs text-[#D8BE8B]/90 mt-0.5">
                    اختر قبيلتك، انضم إليها لتصلك إشعارات الأعراس والإعلانات، واستكشف شجرة الأنساب وذاكرة الأجداد
                  </p>
                </div>
              </div>

              {/* Action Buttons & Notifications Bell */}
              <div className="flex items-center gap-2">
                {/* Comprehensive 12 Branches Genealogy Tree Button */}
                <button
                  id="tribes-modal-genealogy-btn"
                  onClick={() => setShowGenealogyModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-950/60 border border-amber-400/40"
                  title="عرض شجرة الأنساب والـ 12 فرعاً المعتمدة"
                >
                  <GitBranch className="w-3.5 h-3.5 text-amber-200" />
                  <span className="hidden sm:inline">شجرة الأنساب (12 فرعاً)</span>
                  <span className="sm:hidden">الأنساب</span>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
                  className="relative p-2.5 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-amber-400 border border-stone-700 transition-all"
                  title="تنبيهات وإعلانات القبائل المنضم إليها"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Supervisor Lock Button */}
                <button
                  onClick={() => {
                    if (isAdminLoggedIn) setIsAdminLoggedIn(false);
                    else setShowAdminAuthModal(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isAdminLoggedIn
                      ? "bg-emerald-700 text-white border border-emerald-400/50 shadow-md shadow-emerald-950"
                      : "bg-stone-800 text-amber-400 hover:bg-stone-700 border border-stone-700"
                  }`}
                >
                  {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-emerald-200" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isAdminLoggedIn ? "صلاحيات المشرفين (مفعّل)" : "دخول المشرفين"}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Division Navigation Tabs (The 5 Main Sections) */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-stone-950 border-b border-stone-800 overflow-x-auto scrollbar-thin">
              {DIVISIONS.map(div => (
                <button
                  key={div.id}
                  onClick={() => {
                    setSelectedDivisionFilter(div.id);
                    setShowOnlyJoined(false);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedDivisionFilter === div.id && !showOnlyJoined
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-950/80 border border-amber-400/50"
                      : "bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800"
                  }`}
                >
                  <span>{div.label}</span>
                </button>
              ))}

              {/* Filter by Joined Tribes */}
              <button
                onClick={() => setShowOnlyJoined(!showOnlyJoined)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  showOnlyJoined
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-950 border border-emerald-400"
                    : "bg-stone-900 text-emerald-400 hover:text-white border border-stone-800"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>قبائلي المنضم لها ({joinedTribeIds.length})</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 sm:p-5 bg-stone-900/60 border-b border-stone-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="ابحث عن قبيلة، فخذ، قرية، أو بلدة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-xs text-stone-400 flex items-center gap-2">
                <span>عرض: <strong className="text-amber-400 font-mono">{filteredTribes.length}</strong> قبيلة</span>
                <span>•</span>
                <span>إجمالي الفخوذ الموثقة: <strong className="text-emerald-400 font-mono">+{tribesList.reduce((acc, t) => acc + t.afkhadh.length, 0)}</strong> فخذ</span>
              </div>
            </div>

            {/* Tribes Grid (Compact 2 Columns on Mobile / Multi-column Grid) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
                {filteredTribes.map((tribe) => {
                  const isJoined = joinedTribeIds.includes(tribe.id);

                  return (
                    <div
                      id={`tribe-card-${tribe.id}`}
                      key={tribe.id}
                      className={`group p-3 sm:p-4 rounded-2xl bg-stone-950 border transition-all flex flex-col justify-between hover:shadow-xl ${
                        isJoined
                          ? "border-emerald-500/60 bg-gradient-to-b from-stone-950 via-stone-950 to-emerald-950/20 ring-1 ring-emerald-500/40"
                          : "border-stone-800 hover:border-amber-500/60 hover:bg-stone-900/90"
                      }`}
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Top Bar: Division Badge + Compact Icon/Text Join Button */}
                          <div className="flex items-center justify-between gap-1.5 mb-2 pb-2 border-b border-stone-800/60">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[10px] text-amber-300/90 font-medium truncate max-w-[110px] sm:max-w-none">
                              {tribe.division}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleJoinTribe(tribe);
                              }}
                              className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                                isJoined
                                  ? "bg-emerald-600/90 text-white hover:bg-emerald-700"
                                  : "bg-stone-900 text-stone-300 hover:text-amber-300 hover:bg-stone-800 border border-stone-700/70"
                              }`}
                              title={isJoined ? "أنت منضم (اضغط للإلغاء)" : "انضم ليصلك جديد القبيلة"}
                            >
                              {isJoined ? (
                                <>
                                  <Check className="w-3 h-3 text-white stroke-[2.5]" />
                                  <span>منضم</span>
                                </>
                              ) : (
                                <>
                                  <BellRing className="w-3 h-3 text-amber-400" />
                                  <span className="hidden sm:inline">انضمام</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Tribe Name */}
                          <h3 className="text-base sm:text-lg font-bold text-white font-['Amiri'] flex items-center gap-1 group-hover:text-amber-300 transition-colors line-clamp-1">
                            {tribe.name}
                          </h3>

                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-400 mt-1 mb-1.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{tribe.center}</span>
                          </div>

                          <p className="text-[10px] sm:text-xs text-stone-300 leading-relaxed line-clamp-2 mb-2">
                            {tribe.description}
                          </p>
                        </div>

                        {/* Afkhadh Badges */}
                        <div className="pt-2 border-t border-stone-800/80">
                          <span className="text-[10px] text-stone-400 font-semibold block mb-1">الفخوذ:</span>
                          <div className="flex flex-wrap gap-1">
                            {tribe.afkhadh.slice(0, 2).map((f) => (
                              <span key={f.id} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-200 truncate max-w-[80px]">
                                {f.name}
                              </span>
                            ))}
                            {tribe.afkhadh.length > 2 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900/60 text-stone-400">
                                +{tribe.afkhadh.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions: Compact Primary Enter & Outline Supervisor Nomination */}
                      <div className="pt-2.5 mt-2.5 border-t border-stone-800/80 flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedTribe(tribe);
                            setSelectedFakhdhId(tribe.afkhadh[0]?.id || "");
                            setActiveTab("afkhadh");
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow transition-all"
                        >
                          <span>دخول القبيلة</span>
                          <ChevronRight className="w-3 h-3 rotate-180" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNominationDefaultTribeId(tribe.id);
                            setShowSupervisorModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-emerald-500/40 bg-stone-900/40 hover:bg-stone-800 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 transition-all shrink-0"
                          title="ترشيح مشرف معتمد لهذه القبيلة"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: DETAILED SINGLE TRIBE VIEW */
          /* ========================================================================= */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/95 via-stone-900 to-emerald-950/95 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTribe(null)}
                  className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>العودة لقائمة القبائل</span>
                </button>

                <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-white">
                      {currentTribe.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      {currentTribe.division}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    المركز: <span className="text-stone-300">{currentTribe.center}</span> • الجد المؤسس: <span className="text-amber-300 font-semibold">{currentTribe.ancestorName}</span>
                  </p>
                </div>
              </div>

              {/* Actions: Join Button, Supervisor Nomination, Supervisor Lock */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setNominationDefaultTribeId(currentTribe.id);
                    setShowSupervisorModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-emerald-500/50 bg-stone-900 hover:bg-stone-800 text-emerald-300 text-xs font-bold transition-all shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>رشّح نفسك كمشرف</span>
                </button>

                <button
                  onClick={() => toggleJoinTribe(currentTribe)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
                    joinedTribeIds.includes(currentTribe.id)
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-amber-600 text-white hover:bg-amber-500"
                  }`}
                >
                  {joinedTribeIds.includes(currentTribe.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>أنت منضم ✓</span>
                    </>
                  ) : (
                    <>
                      <BellRing className="w-4 h-4" />
                      <span>الانضمام</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (isAdminLoggedIn) setIsAdminLoggedIn(false);
                    else setShowAdminAuthModal(true);
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold ${
                    isAdminLoggedIn
                      ? "bg-emerald-700 text-white border border-emerald-400/50"
                      : "bg-stone-800 text-amber-400 hover:bg-stone-700 border border-stone-700"
                  }`}
                >
                  {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-emerald-200" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isAdminLoggedIn ? "مشرف مفعّل" : "إشراف"}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Inner Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-stone-950 border-b border-stone-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab("afkhadh")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === "afkhadh"
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-stone-900 text-stone-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>فخوذ {currentTribe.name} ({currentTribe.afkhadh.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("tree")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === "tree"
                    ? "bg-emerald-700 text-white shadow-md"
                    : "bg-stone-900 text-stone-400 hover:text-white"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>شجرة الأنساب التفاعلية</span>
              </button>

              <button
                onClick={() => setActiveTab("memory")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === "memory"
                    ? "bg-teal-700 text-white shadow-md"
                    : "bg-stone-900 text-stone-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ذاكرة وتراث القبيلة ({currentTribeMemories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("announcements")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === "announcements"
                    ? "bg-rose-700 text-white shadow-md"
                    : "bg-stone-900 text-stone-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>المناسبات والزواجات والإعلانات</span>
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setActiveTab("broadcast")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                    activeTab === "broadcast"
                      ? "bg-purple-700 text-white shadow-md"
                      : "bg-stone-900 text-purple-400 hover:text-white"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال إشعار للمنضمين (للمشرف)</span>
                </button>
              )}
            </div>

            {/* TAB 1: AFKHADH */}
            {activeTab === "afkhadh" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Supervisor Banner or Add Fakhdh */}
                <div className="p-4 rounded-3xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-['Amiri']">
                      فخوذ ولحام {currentTribe.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      اضغط على أي فخذ لاستعراض شجرة أنسابه، أو إضافة وتعديل الفروع إن كنت مشرفاً
                    </p>
                  </div>

                  {isAdminLoggedIn && (
                    <button
                      onClick={() => setShowAddFakhdhModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة فخذ جديد تحت {currentTribe.name}</span>
                    </button>
                  )}
                </div>

                {/* Afkhadh Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentTribe.afkhadh.map((fakhdh) => (
                    <div
                      key={fakhdh.id}
                      className="p-5 rounded-3xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-amber-300 font-['Amiri']">
                              {fakhdh.name}
                            </h4>
                            {fakhdh.subTitle && (
                              <span className="text-xs text-stone-400 font-medium">{fakhdh.subTitle}</span>
                            )}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                            ~{fakhdh.approximateFamilies} عائلة
                          </span>
                        </div>

                        <p className="text-xs text-stone-400 leading-relaxed mb-3">
                          {fakhdh.description}
                        </p>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-stone-300">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-stone-400">الجد المؤسس:</span>
                            <span className="font-semibold text-amber-200">{fakhdh.rootAncestor}</span>
                          </div>
                          <div className="flex items-start gap-1 text-stone-300">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-stone-400">القرى:</span>
                            <span className="text-emerald-300">{fakhdh.villages.join("، ")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedFakhdhId(fakhdh.id);
                            setActiveTab("tree");
                          }}
                          className="w-full py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>استعراض شجرة أنساب {fakhdh.name}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE FAMILY TREE */}
            {activeTab === "tree" && (
              <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
                {/* Toolbar */}
                <div className="p-3 sm:p-4 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-semibold">اختر الفخذ:</span>
                    <select
                      value={selectedFakhdhId}
                      onChange={(e) => setSelectedFakhdhId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    >
                      {currentTribe.afkhadh.map(f => (
                        <option key={f.id} value={f.id}>{f.name} {f.subTitle ? `(${f.subTitle})` : ""}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative min-w-[180px] flex-1 max-w-xs">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="ابحث عن اسم في الشجرة..."
                      value={treeSearchQuery}
                      onChange={(e) => setTreeSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {isAdminLoggedIn && (
                    <button
                      onClick={() => {
                        if (currentFakhdh) {
                          setTargetParentNodeId(currentFakhdh.familyTree.id);
                          setTargetParentName(currentFakhdh.familyTree.name);
                          setShowAddNodeModal(true);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة شخص للشجرة</span>
                    </button>
                  )}
                </div>

                {/* Tree Canvas */}
                <div className="flex-1 overflow-auto p-6 sm:p-10 flex flex-col items-center justify-start min-h-[350px]">
                  {currentFakhdh ? (
                    <div className="flex flex-col items-center">
                      <div className="text-center mb-6">
                        <span className="text-xs text-amber-400 font-bold block mb-1">
                          شجرة أنساب {currentFakhdh.name} ({currentTribe.name})
                        </span>
                        <h3 className="text-2xl font-bold font-['Amiri'] text-white">
                          سلسلة نسب {currentFakhdh.rootAncestor}
                        </h3>
                      </div>
                      {renderTreeNode(currentFakhdh.familyTree)}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* TAB 3: ذاكرة بني شهر داخل القبيلة (STORIES & HERITAGE) */}
            {activeTab === "memory" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Add Story Button & Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-950/80 to-stone-950 border border-teal-800/50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-teal-400" />
                      <h3 className="text-lg font-bold text-white font-['Amiri']">
                        ذاكرة وتراث {currentTribe.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl">
                      قسم مخصص لحفظ قصص زمان، روايات الأجداد، العادات القديمة، الأمثال الشعبية، صور وتاريخ القبيلة. يستطيع كل زائر أو ابن للقبيلة تدوين وتوثيق رواية الأجداد.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddStoryModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-950"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تدوين قصة أو رواية جديدة</span>
                  </button>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTribeMemories.map((story) => (
                    <div
                      key={story.id}
                      className="p-5 rounded-3xl bg-stone-950 border border-stone-800 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-300 text-[11px] font-semibold">
                            {story.category}
                          </span>
                          <span className="text-[11px] text-stone-500">{story.villageOrLocation}</span>
                        </div>

                        <h4 className="text-base font-bold text-white font-['Amiri'] leading-snug">
                          {story.title}
                        </h4>

                        <p className="text-xs text-stone-300 mt-2 leading-relaxed whitespace-pre-line line-clamp-4">
                          {story.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                        <div>
                          <span className="text-stone-500">الراوي: </span>
                          <span className="text-amber-300 font-semibold">{story.narratorName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-stone-400">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span>{story.likesCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ANNOUNCEMENTS & WEDDINGS */}
            {activeTab === "announcements" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                <div className="p-4 rounded-3xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-['Amiri']">
                      إعلانات ومناسبات {currentTribe.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      كافة حفلات الزواج، الاجتماعات، والتعاميم الصادرة من مشرف القبيلة
                    </p>
                  </div>

                  {isAdminLoggedIn && (
                    <button
                      onClick={() => setActiveTab("broadcast")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>نشر حفل زواج أو إعلان جديد</span>
                    </button>
                  )}
                </div>

                {/* Filter notifications for this tribe */}
                {notifications.filter(n => n.tribeId === currentTribe.id).length > 0 ? (
                  <div className="space-y-3">
                    {notifications.filter(n => n.tribeId === currentTribe.id).map(notif => (
                      <div
                        key={notif.id}
                        className="p-5 rounded-3xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                            notif.category === "حفل زواج"
                              ? "bg-rose-950/80 text-rose-300 border border-rose-800"
                              : notif.category === "اجتماع قبلي"
                              ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                              : "bg-teal-950/80 text-teal-300 border border-teal-800"
                          }`}>
                            {notif.category}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">{notif.timestamp}</span>
                        </div>

                        <h4 className="text-base font-bold text-white font-['Amiri']">
                          {notif.title}
                        </h4>

                        <p className="text-xs text-stone-300 leading-relaxed">
                          {notif.message}
                        </p>

                        {(notif.eventDate || notif.location) && (
                          <div className="pt-2 border-t border-stone-800/80 flex flex-wrap gap-4 text-xs text-amber-200">
                            {notif.eventDate && <span>📅 الموعد: <strong>{notif.eventDate}</strong></span>}
                            {notif.location && <span>📍 الموقع: <strong>{notif.location}</strong></span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-500">
                    <p className="text-sm">لا توجد إعلانات منشورة حديثاً لهذه القبيلة.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SUPERVISOR BROADCAST (نشر إشعار من المشرف) */}
            {activeTab === "broadcast" && isAdminLoggedIn && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full">
                <div className="p-6 rounded-3xl bg-stone-950 border border-purple-800/50 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                    <Send className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Amiri']">
                        نشر إشعار فوري لأعضاء {currentTribe.name}
                      </h3>
                      <p className="text-xs text-stone-400">
                        سيصل هذا التنبيه لجميع الزوار والأعضاء المنضمين لهذه القبيلة
                      </p>
                    </div>
                  </div>

                  {broadcastSent ? (
                    <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-500 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto" />
                      <p className="text-sm font-bold text-white">تم إرسال الإشعار ونشره بنجاح لجميع المنضمين!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendBroadcast} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">نوع الإعلان:</label>
                        <select
                          value={broadcastCategory}
                          onChange={(e: any) => setBroadcastCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                        >
                          <option value="حفل زواج">حفل زواج</option>
                          <option value="إعلان رسمي">إعلان رسمي</option>
                          <option value="مناسبة وتكريم">مناسبة وتكريم</option>
                          <option value="تعزية ومواساة">تعزية ومواساة</option>
                          <option value="اجتماع قبلي">اجتماع قبلي</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">عنوان الإشعار:</label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: دعوة لحضور حفل زواج الشاب / ..."
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">تاريخ المناسبة / الموعد:</label>
                          <input
                            type="text"
                            placeholder="مثلاً: مساء يوم الجمعة القادم"
                            value={broadcastEventDate}
                            onChange={(e) => setBroadcastEventDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">الموقع / القاعة:</label>
                          <input
                            type="text"
                            placeholder="مثلاً: قاعة النماص الكبرى"
                            value={broadcastLocation}
                            onChange={(e) => setBroadcastLocation(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">نص وتفاصيل الإعلان:</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="اكتب تفاصيل الدعوة أو الإعلان..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg"
                      >
                        إرسال الإشعار والتنبيه الآن
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ADD STORY TO ذاكرة بني شهر */}
        {/* ========================================================================= */}
        {showAddStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-stone-200">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-bold text-white font-['Amiri']">
                    تدوين قصة في ذاكرة بني شهر
                  </h3>
                </div>
                <button onClick={() => setShowAddStoryModal(false)} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {storySuccessMsg ? (
                <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-500 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto" />
                  <p className="text-sm font-bold text-white">تم تدوين القصة بنجاح وإضافتها لذاكرة القبيلة!</p>
                </div>
              ) : (
                <form onSubmit={handleAddStory} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">تصنيف القصة والتراث:</label>
                    <select
                      value={storyCategory}
                      onChange={(e) => setStoryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    >
                      {MEMORY_CATEGORIES_LIST.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">عنوان القصة أو الرواية:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: قصة بناء الحصن القديم أو كرم الأجداد..."
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">اسم الراوي (الناقل):</label>
                      <input
                        type="text"
                        placeholder="مثلاً: العم ظافر الشهري"
                        value={storyNarrator}
                        onChange={(e) => setStoryNarrator(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">القرية أو الموقع:</label>
                      <input
                        type="text"
                        placeholder="مثلاً: قرية آل عليان أو بطن الوادي"
                        value={storyVillage}
                        onChange={(e) => setStoryVillage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">نص الرواية الكامل:</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="اكتب تفاصيل القصة أو الرواية التراثية كما تناقلها الأجداد..."
                      value={storyContent}
                      onChange={(e) => setStoryContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg"
                  >
                    حفظ وتوثيق القصة في الأرشيف
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: SUPERVISOR LOGIN (دخول المشرفين) */}
        {/* ========================================================================= */}
        {showAdminAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Amiri']">
                دخول المشرفين المعتمدين
              </h3>
              <p className="text-xs text-stone-400">
                أدخل رمز المشرف السري لإدارة وتعديل الفخوذ وشجرة الأنساب ونشر الإعلانات
              </p>

              <form onSubmit={handleAdminAuth} className="space-y-3">
                <input
                  type="password"
                  required
                  placeholder="رمز المشرف (تجربة: 1234 أو 707)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center text-sm text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-500"
                />

                {adminError && <p className="text-xs text-rose-400">{adminError}</p>}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold"
                  >
                    تأكيد الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminAuthModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: ADD TREE PERSON (إضافة شخص في الشجرة) */}
        {/* ========================================================================= */}
        {showAddNodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-white font-['Amiri']">
                إضافة متفرع تحت ({targetParentName})
              </h3>
              <form onSubmit={handleAddChildNode} className="space-y-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">الاسم الثلاثي / اللقب:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: فايز بن سعد"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">الصفة / المهنة (اختياري):</label>
                  <input
                    type="text"
                    placeholder="مثلاً: راوية، فارس، مزارع، عمدة..."
                    value={newNodeTitle}
                    onChange={(e) => setNewNodeTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">نبذة قصيرة (اختياري):</label>
                  <input
                    type="text"
                    placeholder="نبذة مختصرة..."
                    value={newNodeBio}
                    onChange={(e) => setNewNodeBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold">
                    إضافة للشجرة
                  </button>
                  <button type="button" onClick={() => setShowAddNodeModal(false)} className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs">
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: ADD FAKHDH (تأسيس فخذ جديد) */}
        {/* ========================================================================= */}
        {showAddFakhdhModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-white font-['Amiri']">
                إضافة فخذ جديد تحت {currentTribe?.name}
              </h3>
              <form onSubmit={handleCreateFakhdh} className="space-y-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">اسم الفخذ:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: فخذ آل ..."
                    value={newFakhdhName}
                    onChange={(e) => setNewFakhdhName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">اللقب / الوصف الجغرافي:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: أهل الوادي / أهل الحصن..."
                    value={newFakhdhSubTitle}
                    onChange={(e) => setNewFakhdhSubTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">اسم الجد المؤسس:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: سالم بن ..."
                    value={newFakhdhAncestor}
                    onChange={(e) => setNewFakhdhAncestor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">القرى التابعة (افصل بينها بفاصلة):</label>
                  <input
                    type="text"
                    placeholder="مثلاً: قرية الحصن، قرية الوادي"
                    value={newFakhdhVillages}
                    onChange={(e) => setNewFakhdhVillages(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold">
                    حفظ وتأسيس الفخذ
                  </button>
                  <button type="button" onClick={() => setShowAddFakhdhModal(false)} className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs">
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* NOTIFICATIONS DRAWER (مركز الإشعارات والتنبيهات المباشرة) */}
        {/* ========================================================================= */}
        {showNotificationsDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-stone-900 border-r border-stone-800 h-full p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white font-['Amiri']">
                      إشعارات وتنبيهات القبائل المنضم إليها
                    </h3>
                  </div>
                  <button onClick={() => setShowNotificationsDrawer(false)} className="text-stone-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                  {notifications.filter(n => joinedTribeIds.includes(n.tribeId)).length > 0 ? (
                    notifications.filter(n => joinedTribeIds.includes(n.tribeId)).map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all space-y-2 ${
                          notif.isRead
                            ? "bg-stone-950 border-stone-800 text-stone-400"
                            : "bg-stone-950 border-amber-500/50 text-stone-200 ring-1 ring-amber-500/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                            {notif.tribeName}
                          </span>
                          <span className="text-[10px] text-stone-500">{notif.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-['Amiri']">{notif.title}</h4>
                        <p className="text-xs leading-relaxed text-stone-300">{notif.message}</p>
                        {(notif.eventDate || notif.location) && (
                          <div className="text-[11px] text-amber-300 pt-1 border-t border-stone-800 flex justify-between">
                            {notif.eventDate && <span>📅 {notif.eventDate}</span>}
                            {notif.location && <span>📍 {notif.location}</span>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-stone-500 space-y-2">
                      <Bell className="w-8 h-8 mx-auto text-stone-600" />
                      <p className="text-xs">لا توجد إشعارات جديدة حالياً. انضم إلى قبائل إضافية لتصلك تنبيهات الأعراس والمناسبات.</p>
                    </div>
                  )}
                </div>
              </div>

              {notifications.filter(n => joinedTribeIds.includes(n.tribeId)).length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold mt-4"
                >
                  تحديد الكل كمقروء ✓
                </button>
              )}
            </div>
          </div>
        )}

        {/* Comprehensive 12 Branches Genealogy Tree Modal */}
        <BaniShahrGenealogyModal
          isOpen={showGenealogyModal}
          onClose={() => setShowGenealogyModal(false)}
          onSelectTribeBranch={(branchName) => {
            setShowGenealogyModal(false);
            setSearchTerm(branchName);
          }}
        />

        {/* Supervisor Nomination Modal */}
        <SupervisorNominationModal
          isOpen={showSupervisorModal}
          onClose={() => setShowSupervisorModal(false)}
          defaultTribeId={nominationDefaultTribeId || selectedTribe?.id || DETAILED_TRIBES[0]?.id}
        />

      </div>
    </div>
  );
};
