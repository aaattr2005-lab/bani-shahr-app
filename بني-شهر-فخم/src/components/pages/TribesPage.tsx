import React, { useState, useEffect } from "react";
import {
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
  Award,
  HelpCircle,
  ArrowRight,
  Home,
  UserCheck,
  FileText,
  Phone,
  User,
  X
} from "lucide-react";
import { DETAILED_TRIBES, DetailedTribe, FakhdhItem, TreeNode, TribeDivision, GENEALOGY_STATISTICS } from "../../data/tribesData";
import { MEMORY_ITEMS_DATA, MEMORY_CATEGORIES_LIST } from "../../data/memoriesData";
import { MemoryItem } from "../../types";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { SupervisorNominationModal } from "../SupervisorNominationModal";
import { BaniShahrGenealogyModal } from "../BaniShahrGenealogyModal";
import { AppStorage } from "../../lib/nativeStorage";
import { TribalForumSection } from "../TribalForumSection";

interface TribesPageProps {
  onBack?: () => void;
  onBackToHome: () => void;
  onOpenMemory?: () => void;
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

export const TribesPage: React.FC<TribesPageProps> = ({
  onBack,
  onBackToHome,
  onOpenMemory,
  initialSelectedTribeId,
}) => {
  // State for all tribes data (with local persistence for additions)
  const [tribesList, setTribesList] = useState<DetailedTribe[]>(() => {
    try {
      const saved = AppStorage.getItem(`${STORAGE_KEY_PREFIX}tribes`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= DETAILED_TRIBES.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DETAILED_TRIBES;
  });

  // Selected tribe & sub-view
  const [selectedTribe, setSelectedTribe] = useState<DetailedTribe | null>(() => {
    if (initialSelectedTribeId) {
      return tribesList.find(t => t.id === initialSelectedTribeId) || null;
    }
    return null;
  });

  const [selectedFakhdhId, setSelectedFakhdhId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"afkhadh" | "tree" | "memories" | "announcements" | "comments" | "forum">("afkhadh");
  const [mainPageMode, setMainPageMode] = useState<"directory" | "forum">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>("all");
  const [showOnlyJoined, setShowOnlyJoined] = useState(false);

  // User Joined Tribes (stored in localStorage)
  const [joinedTribeIds, setJoinedTribeIds] = useState<string[]>(() => {
    try {
      const saved = AppStorage.getItem(JOINED_TRIBES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ["shahr-tharameen", "banu-altaym", "balharith"];
    } catch {
      return ["shahr-tharameen", "banu-altaym", "balharith"];
    }
  });

  // Tribal Notifications List
  const [notifications, setNotifications] = useState<TribalNotification[]>(() => {
    try {
      const saved = AppStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "notif-1",
        tribeId: "balharith",
        tribeName: "بلحارث",
        title: "ندوة تاريخية: دور الأمير محمد بن دهمان الشهري",
        message: "تقام ندوة تاريخية توثيقية بمناسبة استعراض وثائق كتاب محمد بن دهمان الشهري ودوره التاريخي في بسط نفوذ الدولة السعودية الأولى.",
        category: "مناسبة وتكريم",
        eventDate: "الجمعة القادم بعد صلاة العشاء",
        location: "المركز الثقافي - النماص",
        author: "مشرف بلحارث",
        timestamp: "منذ ساعتين",
        isRead: false
      },
      {
        id: "notif-2",
        tribeId: "shahr-tharameen",
        tribeName: "شهر ثرامين",
        title: "ملتقى الكلاثمة وبني بكر السنوي لصلة الرحم",
        message: "يتشرف أهالي شهر ثرامين بدعوتكم لحضور اللقاء السنوي لتعزيز أواصر التكافل وصلة الرحم وتكريم المتفوقين.",
        category: "اجتماع قبلي",
        eventDate: "السبت القادم",
        location: "قصر العسابلة التراثي - النماص",
        author: "أمانة شهر ثرامين",
        timestamp: "أمس",
        isRead: false
      },
      {
        id: "notif-3",
        tribeId: "banu-altaym",
        tribeName: "بنو التيم",
        title: "حفل تكريم حفظة كتاب الله ورجال التكافل",
        message: "يقام الحفل السنوي لبني التيم لتكريم كوكبة من أبناء وبنات القبيلة المتميزين بجائزة التفوق العلمي والمبادرات الإنسانية.",
        category: "مناسبة وتكريم",
        eventDate: "الأحد 23 شوال",
        location: "قصر الاحتفالات - المجاردة",
        author: "لجنة التكريم ببني التيم",
        timestamp: "منذ يومين",
        isRead: true
      }
    ];
  });

  // Admin / Supervisor Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Tree interactive state
  const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});
  const [treeSearchQuery, setTreeSearchQuery] = useState("");
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [targetParentNodeId, setTargetParentNodeId] = useState<string | null>(null);
  const [targetParentName, setTargetParentName] = useState<string>("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeBio, setNewNodeBio] = useState("");

  // Add Fakhdh Modal State
  const [showAddFakhdhModal, setShowAddFakhdhModal] = useState(false);
  const [newFakhdhName, setNewFakhdhName] = useState("");
  const [newFakhdhSubTitle, setNewFakhdhSubTitle] = useState("");
  const [newFakhdhAncestor, setNewFakhdhAncestor] = useState("");
  const [newFakhdhVillages, setNewFakhdhVillages] = useState("");
  const [newFakhdhDesc, setNewFakhdhDesc] = useState("");

  // Broadcast modal state (Supervisor)
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastCategory, setBroadcastCategory] = useState<TribalNotification["category"]>("حفل زواج");
  const [broadcastEventDate, setBroadcastEventDate] = useState("");
  const [broadcastLocation, setBroadcastLocation] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Add Story / Memory State
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyCategory, setStoryCategory] = useState("قصص الأجداد والبطولات");
  const [storyNarrator, setStoryNarrator] = useState("");
  const [storyContributor, setStoryContributor] = useState("");
  const [storyVillage, setStoryVillage] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [storySuccessMsg, setStorySuccessMsg] = useState(false);

  // Tribe Memories list
  const [tribeMemories, setTribeMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = AppStorage.getItem(`${STORAGE_KEY_PREFIX}memories`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MEMORY_ITEMS_DATA;
  });

  // Comments / Guestbook state for the tribe
  const [tribeComments, setTribeComments] = useState<{ [tribeId: string]: Array<{ id: string; author: string; village: string; text: string; date: string; likes: number }> }>({
    "shahr-tharameen": [
      { id: "c1", author: "سعد بن علي الكلثمي الشهري", village: "النماص", text: "ونعم بربعنا شهر ثرامين وبكافة فروع بني شهر الـ 12 أهل الكرم والجود من ماضي الزمان إلى حاضره.", date: "منذ يومين", likes: 14 },
      { id: "c2", author: "د. فهد الشهري", village: "وادي بكر", text: "توثيق مبارك ومعتمد من كتاب محمد بن دهمان الشهري، شجرة أنساب مشرفة تجمع الشمل وتوثق صلة الرحم والتاريخ.", date: "أمس", likes: 9 }
    ]
  });
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentVillage, setNewCommentVillage] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Notification Drawer
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [justJoinedTribeName, setJustJoinedTribeName] = useState<string | null>(null);

  // Supervisor Nomination Modal State
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [showGenealogyModal, setShowGenealogyModal] = useState(false);
  const [nominationDefaultTribeId, setNominationDefaultTribeId] = useState<string | undefined>(undefined);
  const [lastNominationInfo, setLastNominationInfo] = useState<{
    id: string;
    name: string;
    tribeName: string;
    timestamp: string;
  } | null>(() => {
    try {
      const saved = AppStorage.getItem("bani_shahr_last_nomination");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initialize selected tribe if prop provided
  useEffect(() => {
    if (initialSelectedTribeId) {
      const found = tribesList.find(t => t.id === initialSelectedTribeId);
      if (found) {
        setSelectedTribe(found);
        setSelectedFakhdhId(found.afkhadh[0]?.id || "");
      }
    }
  }, [initialSelectedTribeId, tribesList]);

  // Scroll to top on page load or tribe selection
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedTribe]);

  // Handle browser/device back navigation
  useEffect(() => {
    const handlePop = () => {
      if (showGenealogyModal) {
        setShowGenealogyModal(false);
        return;
      }
      if (showSupervisorModal) {
        setShowSupervisorModal(false);
        return;
      }
      if (showNotificationsDrawer) {
        setShowNotificationsDrawer(false);
        return;
      }
      if (showAddFakhdhModal) {
        setShowAddFakhdhModal(false);
        return;
      }
      if (showAddStoryModal) {
        setShowAddStoryModal(false);
        return;
      }
      if (showAdminAuthModal) {
        setShowAdminAuthModal(false);
        return;
      }
      if (showAddNodeModal) {
        setShowAddNodeModal(false);
        return;
      }
      if (selectedTribe) {
        setSelectedTribe(null);
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [showGenealogyModal, showSupervisorModal, showNotificationsDrawer, showAddFakhdhModal, showAddStoryModal, showAdminAuthModal, showAddNodeModal, selectedTribe]);

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
          return {
            ...node,
            children: node.children
              .map(child => deleteNodeRecursive(child))
              .filter((c): c is TreeNode => c !== null)
          };
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

  // Add new Fakhdh (Supervisor)
  const handleAddFakhdh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTribe || !newFakhdhName.trim()) return;

    const newFakhdh: FakhdhItem = {
      id: `fakhdh-${Date.now()}`,
      name: newFakhdhName.trim(),
      subTitle: newFakhdhSubTitle.trim() || undefined,
      rootAncestor: newFakhdhAncestor.trim() || newFakhdhName.trim(),
      approximateFamilies: 150,
      villages: newFakhdhVillages.split("،").map(s => s.trim()).filter(Boolean),
      description: newFakhdhDesc.trim() || `أحد فخوذ ${currentTribe.name} الكريمة.`,
      familyTree: {
        id: `root-${Date.now()}`,
        name: newFakhdhAncestor.trim() || newFakhdhName.trim(),
        title: "الجد المؤسس للفخذ",
        isPatriarch: true,
        generation: 1,
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
      setActiveTab("memories");
    }, 2000);
  };

  // Add comment / congratulation
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTribe || !newCommentAuthor.trim() || !newCommentText.trim()) return;

    const currentComments = tribeComments[currentTribe.id] || [];
    const newComment = {
      id: `comm-${Date.now()}`,
      author: newCommentAuthor.trim(),
      village: newCommentVillage.trim() || currentTribe.center,
      text: newCommentText.trim(),
      date: "الآن",
      likes: 1
    };

    setTribeComments({
      ...tribeComments,
      [currentTribe.id]: [newComment, ...currentComments]
    });

    setNewCommentAuthor("");
    setNewCommentVillage("");
    setNewCommentText("");
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const matchesSearch = treeSearchQuery.trim()
      ? node.name.includes(treeSearchQuery) || (node.bio && node.bio.includes(treeSearchQuery))
      : false;

    return (
      <div key={node.id} className="relative flex flex-col items-center my-2">
        <div
          className={`relative group px-4 py-3 rounded-2xl border transition-all shadow-md text-center min-w-[190px] sm:min-w-[220px] max-w-[280px] ${
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
              {node.isPatriarch ? "👑 الجد المؤسس" : `الجيل ${node.generation}`}
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

  // Filter memories for current tribe
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
    <div className="min-h-screen bg-[#F8F4EA] text-stone-900 font-['Tajawal',sans-serif] flex flex-col selection:bg-amber-700 selection:text-white">
      
      {/* Sticky Top Breadcrumb & Return Bar */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
          
          {/* Back Button & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                if (selectedTribe) {
                  setSelectedTribe(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (onBack) {
                  onBack();
                } else {
                  onBackToHome();
                }
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-950 transition-all shrink-0 hover:-translate-x-0.5"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>{selectedTribe ? "العودة للقبائل" : "العودة"}</span>
            </button>

            <div className="h-5 w-px bg-stone-700 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-stone-300 truncate">
              <button onClick={onBackToHome} className="hover:text-amber-300 transition-colors shrink-0">الرئيسية</button>
              <span>/</span>
              <button 
                onClick={() => setSelectedTribe(null)}
                className={`font-semibold transition-colors truncate ${currentTribe ? "hover:text-amber-300 text-stone-300" : "text-amber-400"}`}
              >
                دليل وقبائل بني شهر
              </button>
              {currentTribe && (
                <>
                  <span>/</span>
                  <span className="text-amber-400 font-bold truncate">{currentTribe.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Badges & Supervisor PIN */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
              className="relative p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 transition-all shrink-0"
              title="تنبيهات وإعلانات القبائل المنضم إليها"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Supervisor Login */}
            <button
              onClick={() => {
                if (isAdminLoggedIn) setIsAdminLoggedIn(false);
                else setShowAdminAuthModal(true);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isAdminLoggedIn
                  ? "bg-emerald-700 text-white border border-emerald-400/50 shadow-md shadow-emerald-950"
                  : "bg-stone-800 text-amber-400 hover:bg-stone-700 border border-stone-700"
              }`}
            >
              {isAdminLoggedIn ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-200 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
              <span className="hidden sm:inline">{isAdminLoggedIn ? "صلاحيات المشرفين (مفعّل)" : "دخول المشرفين"}</span>
              <span className="sm:hidden">{isAdminLoggedIn ? "مشرف" : "مشرفين"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Floating Toast Notification on Joining */}
      {justJoinedTribeName && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-2xl border border-emerald-400/60 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs sm:text-sm font-bold">
            تم انضمامك بنجاح إلى {justJoinedTribeName}! ستصلك كافة التنبيهات والأعراس والإعلانات فور صدورها.
          </span>
        </div>
      )}

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
        
        {/* ========================================================================= */}
        {/* VIEW 1: OVERVIEW & TRIBES LIST (5 DIVISIONS) */}
        {/* ========================================================================= */}
        {!currentTribe ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Header for Tribes Directory */}
            <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950/80 via-stone-900 to-emerald-950/80 border border-stone-800 shadow-2xl overflow-hidden text-center sm:text-right flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
                  <Crown className="w-4 h-4" />
                  <span>دليل الأنساب والقبائل المعتمد • 5 أقسام رئيسية</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-['Amiri'] text-white mb-3 leading-tight">
                  دليل وشجرة قبائل بني شهر العريقة
                </h1>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  استكشف تفاصيل وتاريخ ومراكز وفخوذ قبائل بني شهر في السراة وتهامة، انضم لقبيلتك لتلقي تنبيهات المناسبات والأعراس، واطلع على شجرة الأنساب الموثقة وقصص الأجداد.
                </p>
              </div>

              {/* Stats Boxes & Action Buttons */}
              <div className="flex flex-col gap-3.5 w-full sm:w-80 shrink-0">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {/* Left Box: 83+ بطناً وفخذاً */}
                  <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#1c1917]/90 border border-stone-800 shadow-xl shadow-black/40">
                    <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-[#00E599] tracking-tight leading-none mb-2">
                      83+
                    </span>
                    <span className="text-xs sm:text-sm text-stone-400 font-medium tracking-wide">
                      بطناً وفخذاً
                    </span>
                  </div>

                  {/* Right Box: 12 فرعاً رئيسياً */}
                  <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#1c1917]/90 border border-stone-800 shadow-xl shadow-black/40">
                    <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-[#FFB703] tracking-tight leading-none mb-2">
                      12
                    </span>
                    <span className="text-xs sm:text-sm text-stone-400 font-medium tracking-wide">
                      فرعاً رئيسياً
                    </span>
                  </div>
                </div>

                {/* Primary Button: شجرة أنساب بني شهر (كتاب محمد بن دهمان) */}
                <button
                  id="open-genealogy-tree-modal-btn"
                  onClick={() => setShowGenealogyModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/60 border border-amber-400/40 active:scale-[0.98] transition-all group"
                  title="عرض شجرة الأنساب الموثقة من كتاب محمد بن دهمان الشهري"
                >
                  <GitBranch className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-['IBM_Plex_Sans_Arabic'] font-bold text-xs sm:text-sm tracking-wide">
                    شجرة الأنساب والبطون (12 فرعاً)
                  </span>
                </button>

                {/* Button: ذاكرة بني شهر */}
                {onOpenMemory && (
                  <button
                    id="tribes-memory-page-btn"
                    onClick={onOpenMemory}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#C7A25C] hover:bg-[#C7A25C] text-[#F8F4EA] font-medium text-xs sm:text-sm shadow-xl shadow-black/40 border border-[#F5DEB3]/40 active:scale-[0.98] transition-all group"
                    title="استكشف أرشيف وقصص ذاكرة بني شهر التراثية"
                  >
                    <BookOpen className="w-4 h-4 text-[#F8F4EA] group-hover:scale-110 transition-transform shrink-0" />
                    <span className="font-['IBM_Plex_Sans_Arabic'] font-bold text-xs sm:text-sm tracking-wide">
                      ذاكرة بني شهر
                    </span>
                  </button>
                )}

                {/* The Requested Button: رشح نفسك لتكون مشرف القبيلة */}
                <button
                  id="nominate-supervisor-btn"
                  onClick={() => setShowSupervisorModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#1c1917] hover:bg-stone-800 text-stone-200 hover:text-white font-medium text-xs sm:text-sm shadow-xl shadow-black/40 border border-stone-700 active:scale-[0.98] transition-all group"
                  title="تسجيل وترشيح مشرف معتمد للقبيلة"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFB703] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-['IBM_Plex_Sans_Arabic'] font-bold text-xs sm:text-sm tracking-wide">
                    رشح نفسك لتكون مشرف القبيلة
                  </span>
                </button>

                {lastNominationInfo && (
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c1917]/90 border border-stone-800 text-xs text-stone-400 text-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599] shrink-0" />
                    <span>طلب ترشيحك ({lastNominationInfo.tribeName}) قيد المراجعة</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Section Mode Switcher: Directory vs Tribal Forum */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg">
              <button
                id="tribes-directory-mode-btn"
                onClick={() => setMainPageMode("directory")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mainPageMode === "directory"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-950 border border-amber-400/30"
                    : "text-stone-300 hover:text-white hover:bg-stone-800"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>دليل القبائل، الفخوذ، وشجرة الأنساب ({tribesList.length})</span>
              </button>

              <button
                id="tribes-forum-mode-btn"
                onClick={() => setMainPageMode("forum")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mainPageMode === "forum"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-950 border border-amber-400/30 ring-1 ring-amber-400/40"
                    : "text-stone-300 hover:text-white hover:bg-stone-800"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>منتدى أسئلة وقصص القبيلة (TripAdvisor Forum)</span>
              </button>
            </div>

            {mainPageMode === "forum" ? (
              <div className="animate-fadeIn">
                <TribalForumSection />
              </div>
            ) : (
              <>
                {/* Division Filter Tabs */}
            <div className="bg-stone-900/80 p-2.5 rounded-2xl border border-stone-800 overflow-x-auto no-scrollbar flex items-center gap-2">
              {DIVISIONS.map(div => (
                <button
                  key={div.id}
                  onClick={() => {
                    setSelectedDivisionFilter(div.id);
                    setShowOnlyJoined(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedDivisionFilter === div.id && !showOnlyJoined
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-950 border border-amber-400/50"
                      : "bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700/90 border border-stone-700/60"
                  }`}
                >
                  <span>{div.label}</span>
                </button>
              ))}

              <button
                onClick={() => setShowOnlyJoined(!showOnlyJoined)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  showOnlyJoined
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-950 border border-emerald-400"
                    : "bg-stone-800/90 text-emerald-400 hover:text-white border border-stone-700/60"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>قبائلي المنضم لها ({joinedTribeIds.length})</span>
              </button>
            </div>

            {/* Search & Statistics Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="ابحث عن قبيلة، فخذ، قرية، أو بلدة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-xs sm:text-sm text-stone-400 flex items-center gap-2">
                <span>عرض: <strong className="text-amber-400 font-mono">{filteredTribes.length}</strong> قبيلة</span>
                <span>•</span>
                <span>إجمالي الفخوذ: <strong className="text-emerald-400 font-mono">+{tribesList.reduce((acc, t) => acc + t.afkhadh.length, 0)}</strong> فخذ</span>
              </div>
            </div>

            {/* Tribes Cards Grid (Compact 2 Columns on Mobile / Multi-column Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
              {filteredTribes.map((tribe) => {
                const isJoined = joinedTribeIds.includes(tribe.id);

                return (
                  <div
                    key={tribe.id}
                    className={`group p-3 sm:p-4 rounded-2xl bg-[#1c1917] border transition-all flex flex-col justify-between hover:shadow-xl ${
                      isJoined
                        ? "border-emerald-500/60 bg-gradient-to-b from-[#1c1917] via-[#1c1917] to-emerald-950/20 ring-1 ring-emerald-500/40"
                        : "border-stone-800 hover:border-amber-500/60 hover:bg-stone-900"
                    }`}
                  >
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Top Bar: Division Badge + Compact Icon/Text Join Button */}
                        <div className="flex items-center justify-between gap-1.5 mb-2 pb-2 border-b border-stone-800/60">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-950/90 border border-stone-800 text-[10px] text-amber-300/90 font-medium truncate max-w-[110px] sm:max-w-none">
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
                        <h3 className="text-base sm:text-xl font-bold font-['Amiri'] text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {tribe.name}
                        </h3>

                        {/* Center / Homeland */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-400 mt-1 mb-1.5">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{tribe.center}</span>
                        </div>

                        {/* Short Description */}
                        <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed mb-2">
                          {tribe.description}
                        </p>
                      </div>

                      {/* Main Afkhadh Pills */}
                      <div className="pt-2 border-t border-stone-800/80">
                        <span className="text-[10px] text-stone-400 block mb-1 font-medium">الفخوذ:</span>
                        <div className="flex flex-wrap gap-1">
                          {tribe.afkhadh.slice(0, 2).map((f) => (
                            <span
                              key={f.id}
                              className="px-1.5 py-0.5 rounded bg-stone-950/80 border border-stone-800 text-[10px] text-stone-300 truncate max-w-[80px]"
                            >
                              {f.name}
                            </span>
                          ))}
                          {tribe.afkhadh.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-[10px] text-amber-300 font-bold">
                              +{tribe.afkhadh.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2.5 mt-2.5 border-t border-stone-800 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedTribe(tribe);
                          setSelectedFakhdhId(tribe.afkhadh[0]?.id || "");
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-[10px] sm:text-xs shadow transition-all"
                        title="دخول ملف القبيلة وشجرة الأنساب"
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
                        className="p-1.5 rounded-lg border border-emerald-500/40 bg-stone-950/40 hover:bg-stone-800 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 transition-all shrink-0"
                        title="رشّح نفسك لتكون مشرف لقبيلتك"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        )}

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: DETAILED SINGLE TRIBE VIEW */
          /* ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Tribe Profile Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/90 border border-stone-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0 mt-1">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-['Amiri'] text-white">
                      {currentTribe.name}
                    </h1>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {currentTribe.division}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1.5 flex flex-wrap items-center gap-3">
                    <span>المركز والديار: <strong className="text-emerald-300">{currentTribe.center}</strong></span>
                    <span>•</span>
                    <span>الجد المؤسس: <strong className="text-amber-300">{currentTribe.ancestorName}</strong></span>
                  </p>
                  <p className="text-xs text-stone-400 mt-2 max-w-3xl leading-relaxed">
                    {currentTribe.description}
                  </p>
                </div>
              </div>

              {/* Actions: Return to List, Join, & Nominate Supervisor */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setSelectedTribe(null)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all border border-stone-700 min-h-[44px]"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>قائمة كافة القبائل</span>
                </button>

                <button
                  onClick={() => toggleJoinTribe(currentTribe)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg min-h-[44px] ${
                    joinedTribeIds.includes(currentTribe.id)
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-amber-600 text-white hover:bg-amber-500"
                  }`}
                >
                  {joinedTribeIds.includes(currentTribe.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>أنت منضم للقبيلة ✓</span>
                    </>
                  ) : (
                    <>
                      <BellRing className="w-4 h-4" />
                      <span>الانضمام وتلقي التنبيهات</span>
                    </>
                  )}
                </button>

                {/* Requested Button Inside Tribe Detail Page */}
                <button
                  onClick={() => {
                    setNominationDefaultTribeId(currentTribe.id);
                    setShowSupervisorModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/50 bg-stone-900/90 hover:bg-stone-800 text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-md min-h-[44px]"
                  title="ترشيح نفسك كمشرف لهذه القبيلة"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>رشّح نفسك لتكون مشرف لقبيلتك</span>
                </button>
              </div>

            </div>

            {/* Inner Sub-Navigation Tabs */}
            <div className="bg-stone-900/90 p-2 rounded-2xl border border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("afkhadh")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "afkhadh"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                    : "bg-stone-800 text-stone-300 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>فخوذ {currentTribe.name} ({currentTribe.afkhadh.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("tree")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "tree"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                    : "bg-stone-800 text-stone-300 hover:text-white"
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>شجرة الأنساب التفاعلية</span>
              </button>

              <button
                onClick={() => setActiveTab("memories")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "memories"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                    : "bg-stone-800 text-stone-300 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>ذاكرة وقصص القبيلة ({currentTribeMemories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("announcements")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "announcements"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                    : "bg-stone-800 text-stone-300 hover:text-white"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>المناسبات والأعراس</span>
              </button>

              <button
                onClick={() => setActiveTab("comments")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "comments"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                    : "bg-stone-800 text-stone-300 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>مجلس القبيلة والتهاني</span>
              </button>

              <button
                id="tribe-forum-tab-btn"
                onClick={() => setActiveTab("forum")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  activeTab === "forum"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950 ring-2 ring-amber-400/40"
                    : "bg-stone-800 text-amber-300 hover:text-white border border-amber-500/30"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>أسئلة وقصص ({currentTribe.name})</span>
              </button>
            </div>

            {/* TAB CONTENT 1: AFKHADH (فخوذ القبيلة) */}
            {activeTab === "afkhadh" && (
              <div className="space-y-6">
                
                {isAdminLoggedIn && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-300">
                      <ShieldCheck className="w-4 h-4" />
                      <span>صلاحيات المشرف مفعلة: يمكنك إضافة فخوذ جديدة أو تعديل شجرة الأنساب.</span>
                    </div>
                    <button
                      onClick={() => setShowAddFakhdhModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة فخذ جديد</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentTribe.afkhadh.map((fakhdh) => (
                    <div
                      key={fakhdh.id}
                      className={`p-5 rounded-2xl bg-stone-900/90 border transition-all flex flex-col justify-between space-y-4 hover:border-amber-500/50 ${
                        selectedFakhdhId === fakhdh.id ? "border-amber-500 ring-1 ring-amber-500/50" : "border-stone-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="text-xl font-bold font-['Amiri'] text-amber-300">
                            {fakhdh.name}
                          </h4>
                          {fakhdh.subTitle && (
                            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-950 text-stone-400 border border-stone-800">
                              {fakhdh.subTitle}
                            </span>
                          )}
                        </div>

                        {fakhdh.ancestorName && (
                          <p className="text-xs text-stone-400">
                            الجد المؤسس: <span className="text-amber-200 font-semibold">{fakhdh.ancestorName}</span>
                          </p>
                        )}

                        <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                          {fakhdh.description}
                        </p>

                        {/* Villages list */}
                        {fakhdh.villages && fakhdh.villages.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-stone-800">
                            <span className="text-[11px] text-stone-400 block mb-1.5">القرى والديار:</span>
                            <div className="flex flex-wrap gap-1">
                              {fakhdh.villages.map((v, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-stone-950 text-[10px] text-stone-300 border border-stone-800">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedFakhdhId(fakhdh.id);
                          setActiveTab("tree");
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-300 text-xs font-bold transition-colors border border-stone-700"
                      >
                        <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                        <span>فتح شجرة نسب {fakhdh.name}</span>
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: GENEALOGY TREE (شجرة الأنساب) */}
            {activeTab === "tree" && (
              <div className="space-y-6">
                
                {/* Tree Controls & Fakhdh Selector */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-stone-400 font-bold">اختر الفخذ:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {currentTribe.afkhadh.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFakhdhId(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            (currentFakhdh?.id === f.id)
                              ? "bg-amber-600 text-white shadow-md"
                              : "bg-stone-800 text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث عن اسم في الشجرة..."
                      value={treeSearchQuery}
                      onChange={(e) => setTreeSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Tree Visual Container */}
                <div className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-stone-800 shadow-inner overflow-x-auto min-h-[500px] flex justify-center items-start">
                  {currentFakhdh ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 text-center">
                        <span className="text-xs text-amber-400 font-semibold font-mono">
                          شجرة أنساب {currentFakhdh.name} - قبيلة {currentTribe.name}
                        </span>
                      </div>
                      {renderTreeNode(currentFakhdh.familyTree)}
                    </div>
                  ) : (
                    <div className="text-center text-stone-400 py-12">
                      يرجى اختيار فخذ لعرض شجرة الأنساب
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT 3: MEMORIES & STORIES (ذاكرة وقصص القبيلة) */}
            {activeTab === "memories" && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold font-['Amiri'] text-white">
                      ذاكرة وتاريخ وروايات {currentTribe.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      قصص الأجداد، الوثائق التاريخية، المعارك، والأشعار النبطية الموروثة
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddStoryModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>توثيق قصة أو رواية عن القبيلة</span>
                  </button>
                </div>

                {currentTribeMemories.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-stone-900/80 border border-stone-800 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-stone-500 mx-auto" />
                    <h4 className="text-base font-bold text-stone-300 font-['Amiri']">
                      لا توجد قصص موثقة بعد لـ {currentTribe.name}
                    </h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      كن أول من يوثق قصة أو رواية عن أجداد وبطولات وأشعار {currentTribe.name} لإرسالها لمشرف القبيلة للاعتماد.
                    </p>
                    <button
                      onClick={() => setShowAddStoryModal(true)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                    >
                      توثيق أول قصة للقبيلة
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentTribeMemories.map((story) => (
                      <div
                        key={story.id}
                        className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-bold">
                              {story.category}
                            </span>
                            <span className="text-[11px] text-stone-400">{story.villageOrLocation}</span>
                          </div>

                          <h4 className="text-xl font-bold font-['Amiri'] text-white mt-1">
                            {story.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed">
                            {story.content}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                          <span>الراوي: <strong className="text-stone-200">{story.narratorName}</strong></span>
                          <span>الموثق: <strong className="text-amber-300">{story.contributorName}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT 4: ANNOUNCEMENTS & WEDDINGS (المناسبات والأعراس) */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold font-['Amiri'] text-white">
                      لوحة إعلانات وأفراح ومناسبات {currentTribe.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      الأعراس، المناسبات الرسمية، التكريمات، واجتماعات القبيلة
                    </p>
                  </div>

                  {isAdminLoggedIn && (
                    <button
                      onClick={() => setBroadcastSent(false)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>نشر إعلان رسمي جديد</span>
                    </button>
                  )}
                </div>

                {/* Supervisor Post Creator */}
                {isAdminLoggedIn && (
                  <form onSubmit={handleSendBroadcast} className="p-6 rounded-3xl bg-stone-900 border border-emerald-500/40 shadow-xl space-y-4">
                    <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span>إرسال تعميم رسمي لأعضاء القبيلة</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">عنوان الإعلان / المناسبة</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: حفل زواج الشاب فلان..."
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">التصنيف</label>
                        <select
                          value={broadcastCategory}
                          onChange={(e) => setBroadcastCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        >
                          <option value="حفل زواج">حفل زواج</option>
                          <option value="مناسبة وتكريم">مناسبة وتكريم</option>
                          <option value="إعلان رسمي">إعلان رسمي</option>
                          <option value="اجتماع قبلي">اجتماع قبلي</option>
                          <option value="تعزية ومواساة">تعزية ومواساة</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 block mb-1">نص الدعوة أو التفاصيل</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="اكتب تفاصيل المناسبة والترحيب بالضيوف..."
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">الموعد والتاريخ</label>
                        <input
                          type="text"
                          placeholder="الجمعة القادم بعد صلاة العصر"
                          value={broadcastEventDate}
                          onChange={(e) => setBroadcastEventDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">الموقع أو القصر</label>
                        <input
                          type="text"
                          placeholder="قصر السحاب - النماص"
                          value={broadcastLocation}
                          onChange={(e) => setBroadcastLocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      بث الإشعار الآن لكافة المنضمين
                    </button>
                  </form>
                )}

                {/* Notifications Cards */}
                <div className="space-y-4">
                  {notifications.filter(n => n.tribeId === currentTribe.id || n.tribeId === "all").map((notif) => (
                    <div
                      key={notif.id}
                      className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 text-xs font-bold">
                            {notif.category}
                          </span>
                          <span className="text-xs text-stone-400">{notif.timestamp}</span>
                        </div>

                        <h4 className="text-lg font-bold font-['Amiri'] text-white">
                          {notif.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                          {notif.message}
                        </p>

                        {(notif.eventDate || notif.location) && (
                          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-400 font-medium pt-2">
                            {notif.eventDate && <span>📅 {notif.eventDate}</span>}
                            {notif.location && <span>📍 {notif.location}</span>}
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-stone-400 shrink-0">
                        الناشر: <strong className="text-stone-200">{notif.author}</strong>
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB CONTENT 5: GUESTBOOK & COMMENTS (مجلس القبيلة) */}
            {activeTab === "comments" && (
              <div className="space-y-6">
                
                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl">
                  <h4 className="text-lg font-bold font-['Amiri'] text-amber-300 mb-4">
                    أضف كلمة أو تهنئة في سجل مجلس {currentTribe.name}
                  </h4>

                  <form onSubmit={handleAddComment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">الاسم الكامل</label>
                        <input
                          type="text"
                          required
                          placeholder="الاسم الكريم..."
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-300 block mb-1">القرية أو المدينة</label>
                        <input
                          type="text"
                          placeholder="قرية النمور..."
                          value={newCommentVillage}
                          onChange={(e) => setNewCommentVillage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 block mb-1">رسالة التهنئة أو التعليق</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="اكتب تهنئتك أو كلمتك الطيبة..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow"
                    >
                      إرسال الكلمة للمجلس
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {(tribeComments[currentTribe.id] || []).map((comm) => (
                    <div
                      key={comm.id}
                      className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="font-bold text-amber-300">{comm.author} ({comm.village})</span>
                        <span>{comm.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB CONTENT 6: TRIBAL FORUM (أسئلة وقصص القبيلة) */}
            {activeTab === "forum" && (
              <div className="space-y-6 animate-fadeIn">
                <TribalForumSection 
                  currentTribeName={currentTribe.name}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Admin Supervisor PIN Auth Modal */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-['Amiri'] text-white">
              دخول مشرف القبيلة المعتمد
            </h3>
            <p className="text-xs text-stone-300">
              أدخل رمز المرور السري الخاص بإشراف القبيلة لتتمكن من إضافة وتعديل الأسماء في شجرة الأنساب وبث الإشعارات الرسمية.
            </p>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                placeholder="رمز المرور (رمز التجربة: 1234 أو 707)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-700 text-center text-lg tracking-widest text-amber-300 focus:outline-none focus:border-amber-500"
              />

              {adminError && <p className="text-xs text-rose-400 font-bold">{adminError}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminAuthModal(false)}
                  className="px-4 py-3 rounded-xl bg-stone-800 text-stone-300 text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tree Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-['Amiri'] text-amber-300">
              إضافة متفرع جديد تحت: {targetParentName}
            </h3>
            <form onSubmit={handleAddChildNode} className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 block mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  placeholder="اسم الابن أو المتفرع..."
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 block mb-1">اللقب أو الصفة (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: شيخ، راوية، فارس..."
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="text-xs text-stone-300 block mb-1">نبذة قصيرة</label>
                <textarea
                  rows={2}
                  placeholder="معلومات تاريخية أو مكان سكن الفخذ..."
                  value={newNodeBio}
                  onChange={(e) => setNewNodeBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                >
                  إضافة للشجرة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 h-full border-r border-stone-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold font-['Amiri'] text-white">
                    تنبيهات القبائل المنضم إليها
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotificationsDrawer(false)}
                  className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {notifications.filter(n => joinedTribeIds.includes(n.tribeId)).map((notif) => (
                  <div key={notif.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                      <span>{notif.tribeName}</span>
                      <span className="text-stone-500">{notif.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    <p className="text-xs text-stone-300">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="w-full mt-6 py-3 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
            >
              إغلاق
            </button>
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
        onSuccessSubmitted={(data) => {
          setLastNominationInfo(data);
        }}
      />

    </div>
  );
};
