import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  User, 
  MapPin, 
  Clock, 
  Tag, 
  Send, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  X,
  Award,
  Flame,
  ArrowUpDown
} from "lucide-react";
import { TribalPost, TribalPostReply } from "../types";
import { DataStore } from "../lib/datastore";

interface TribalForumSectionProps {
  currentTribeName?: string;
  onAskAi?: (prompt: string) => void;
  onSharePost?: (post: TribalPost) => void;
}

export const TribalForumSection: React.FC<TribalForumSectionProps> = ({
  currentTribeName,
  onAskAi,
  onSharePost
}) => {
  const [posts, setPosts] = useState<TribalPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "question" | "story">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  
  // New Post Form Modal / Collapsible
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostType, setNewPostType] = useState<"question" | "story">("question");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostTribe, setNewPostTribe] = useState(currentTribeName || "بني شهر");
  const [newPostCity, setNewPostCity] = useState("النماص");
  const [newPostCategory, setNewPostCategory] = useState("طرق ومسارات");
  const [newPostTags, setNewPostTags] = useState("");
  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  // Replying state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyAuthorMap, setReplyAuthorMap] = useState<Record<string, string>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const reloadPosts = () => {
    const list = DataStore.getTribalPosts();
    setPosts(list);
  };

  useEffect(() => {
    reloadPosts();
  }, []);

  const categories = [
    { id: "all", label: "كافة المواضيع" },
    { id: "طرق ومسارات", label: "طرق ومسارات" },
    { id: "بطولات الأجداد", label: "بطولات الأجداد" },
    { id: "مزارع وضيافة", label: "مزارع وضيافة" },
    { id: "لهجة وأمثال", label: "لهجة وأمثال" },
    { id: "أنساب وديار", label: "أنساب وديار" },
  ];

  const handleLikePost = (postId: string) => {
    DataStore.toggleLikeTribalPost(postId);
    reloadPosts();
  };

  const handleLikeReply = (postId: string, replyId: string) => {
    DataStore.toggleLikeTribalReply(postId, replyId);
    reloadPosts();
  };

  const handleAddReply = (postId: string) => {
    const text = replyTextMap[postId]?.trim();
    if (!text) return;
    const author = replyAuthorMap[postId]?.trim() || "عضو من القبيلة";

    DataStore.addTribalPostReply(postId, {
      author,
      content: text,
      tribe: currentTribeName || "بني شهر",
      city: "النماص",
      isVerifiedMember: false
    });

    setReplyTextMap(prev => ({ ...prev, [postId]: "" }));
    setExpandedReplies(prev => ({ ...prev, [postId]: true }));
    reloadPosts();
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostAuthor.trim()) return;

    const tagsArray = newPostTags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    DataStore.addTribalPost({
      type: newPostType,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      author: newPostAuthor.trim(),
      authorRole: newPostType === "story" ? "راوٍ ومشارك مجتمعي" : "سائل ومستفسر",
      tribe: newPostTribe.trim() || "بني شهر",
      villageOrCity: newPostCity.trim() || "النماص",
      category: newPostCategory,
      tags: tagsArray.length > 0 ? tagsArray : [newPostCategory, newPostType === "story" ? "قصة" : "سؤال"]
    });

    setFormSuccessMessage(
      newPostType === "story" 
        ? "تم نشر القصة بنجاح في منتدى القبيلة!" 
        : "تم طرح سؤالك بنجاح! سيتلقى إجابات من أهالي وخبراء القبيلة."
    );

    setTimeout(() => {
      setFormSuccessMessage("");
      setShowNewPostModal(false);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags("");
    }, 1500);

    reloadPosts();
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المشاركة؟")) {
      DataStore.deleteTribalPost(postId);
      reloadPosts();
    }
  };

  const handleShareClick = (post: TribalPost) => {
    if (onSharePost) {
      onSharePost(post);
      return;
    }
    navigator.clipboard?.writeText?.(`${post.title}\n\n${post.content}\n\n— منتدى قبيلة بني شهر التفاعلي`);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesType = selectedType === "all" || post.type === selectedType;
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tribe.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return (b.likes + b.replies.length) - (a.likes + a.replies.length);
      }
      return 0; // Default matches store order (newest first)
    });

  const questionCount = posts.filter(p => p.type === "question").length;
  const storyCount = posts.filter(p => p.type === "story").length;

  return (
    <div className="space-y-6">
      {/* Forum Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>مجتمع وأسئلة وقصص القبيلة (TripAdvisor Forum)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-white">
              منتدى الحوار، الاستفسارات السياحية، والروايات التاريخية
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              مساحة تفاعلية مفتوحة لأبناء القبيلة والزوار لطرح الأسئلة عن الطرق والمعالم والضيافة، ومشاركة القصص والمرويات التراثية الموثقة مع إمكانية الرد والإثراء.
            </p>
          </div>

          <button
            id="open-new-post-modal-btn"
            onClick={() => setShowNewPostModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/30 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>طرح سؤال أو مشاركة قصة</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800/80">
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">إجمالي المشاركات</span>
            <span className="text-lg font-bold text-amber-300 font-mono">{posts.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">أسئلة واستفسارات</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{questionCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">قصص وروايات الأجداد</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{storyCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">إجمالي الردود والإجابات</span>
            <span className="text-lg font-bold text-sky-400 font-mono">
              {posts.reduce((acc, p) => acc + p.replies.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث في الأسئلة، القصص، الكلمات الدلالية، أو الراوي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedType === "all"
                  ? "bg-amber-600 text-white shadow"
                  : "bg-stone-950 text-stone-300 hover:text-white border border-stone-800"
              }`}
            >
              الكل ({posts.length})
            </button>
            <button
              onClick={() => setSelectedType("question")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedType === "question"
                  ? "bg-emerald-700 text-white shadow"
                  : "bg-stone-950 text-stone-300 hover:text-white border border-stone-800"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>أسئلة واستفسارات ({questionCount})</span>
            </button>
            <button
              onClick={() => setSelectedType("story")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedType === "story"
                  ? "bg-amber-600 text-white shadow"
                  : "bg-stone-950 text-stone-300 hover:text-white border border-stone-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>قصص وروايات ({storyCount})</span>
            </button>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSortBy(sortBy === "latest" ? "popular" : "latest")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-semibold text-stone-300 hover:text-white"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>{sortBy === "latest" ? "الأحدث أولاً" : "الأكثر تفاعلاً"}</span>
            </button>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-stone-800">
          <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-amber-400" />
            <span>الموضوع:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? "bg-stone-800 text-amber-300 border border-amber-500/50 font-bold"
                  : "bg-stone-950/80 text-stone-400 hover:text-stone-200 border border-stone-800/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
            <MessageSquare className="w-12 h-12 text-stone-600 mx-auto" />
            <h4 className="text-lg font-bold text-stone-300">لم يتم العثور على أي مشاركات مطابقة</h4>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              كن أول من يطرح سؤالاً أو يشارك قصة تاريخية ملهمة في منتدى القبيلة!
            </p>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول مشاركة الآن</span>
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = !!expandedReplies[post.id];
            const isQuestion = post.type === "question";
            const replyDraft = replyTextMap[post.id] || "";
            const authorDraft = replyAuthorMap[post.id] || "";

            return (
              <div
                key={post.id}
                id={`tribal-post-${post.id}`}
                className={`p-5 sm:p-6 rounded-3xl bg-stone-900/90 border transition-all shadow-md ${
                  isQuestion 
                    ? "border-stone-800 hover:border-emerald-500/40" 
                    : "border-stone-800 hover:border-amber-500/40"
                }`}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                        isQuestion
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-950 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {post.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-stone-100">{post.author}</span>
                        {post.authorRole && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-amber-300/90 border border-stone-800">
                            {post.authorRole}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <span>{post.tribe}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{post.villageOrCity}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{post.createdAt}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isQuestion
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {isQuestion ? (
                        <>
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>سؤال واستفسار</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>قصة ورواية</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Post Title */}
                <h4 className="text-base sm:text-lg font-bold font-['Amiri'] text-stone-100 mt-2 mb-2.5 leading-snug">
                  {post.title}
                </h4>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line bg-stone-950/40 p-3.5 sm:p-4 rounded-2xl border border-stone-800/80">
                  {post.content}
                </p>

                {/* Tags Bar */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-3">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-950 text-stone-400 border border-stone-800 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>#{tag}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-stone-800/80 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* Upvote / Like Button */}
                    <button
                      id={`like-post-${post.id}`}
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 hover:text-amber-300 transition-all active:scale-95"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>إعجاب وتأييد ({post.likes})</span>
                    </button>

                    {/* Expand Replies Button */}
                    <button
                      id={`toggle-replies-${post.id}`}
                      onClick={() => setExpandedReplies(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 hover:text-white transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                      <span>
                        الردود ({post.replies.length})
                      </span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Button */}
                    <button
                      onClick={() => handleShareClick(post)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-400 hover:text-stone-200 transition-all"
                      title="مشاركة المنشور"
                    >
                      {copiedPostId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>مشاركة</span>
                        </>
                      )}
                    </button>

                    {/* Ask AI about this post */}
                    {onAskAi && (
                      <button
                        onClick={() => onAskAi(`استفسار بخصوص منتدى القبيلة: "${post.title}". ${post.content}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-xs font-bold text-amber-300 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>تحليل الذكاء الاصطناعي</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 rounded-xl bg-stone-950 hover:bg-rose-950/60 border border-stone-800 hover:border-rose-700/60 text-stone-500 hover:text-rose-400 transition-all"
                      title="حذف المشاركة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* REPLIES SECTION (Collapsible & Expandable) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-800 space-y-3.5 bg-stone-950/60 p-4 rounded-2xl border">
                    <h5 className="text-xs font-bold text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>الردود والمشاركات المعتمدة ({post.replies.length})</span>
                      </span>
                      <span className="text-[10px] text-stone-400">مجتمع بني شهر المترابط</span>
                    </h5>

                    {post.replies.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-3">
                        لا توجد ردود بعد. شارك بمعرفتك أو إجابتك الأولى أدناه!
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {post.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-200">{rep.author}</span>
                                {rep.isVerifiedMember && (
                                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium">
                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                    <span>مشرف موثق</span>
                                  </span>
                                )}
                                {rep.authorRole && !rep.isVerifiedMember && (
                                  <span className="text-[10px] text-amber-400">{rep.authorRole}</span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400">{rep.createdAt}</span>
                            </div>

                            <p className="text-stone-300 leading-relaxed">{rep.content}</p>

                            <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                              <span>{rep.tribe} {rep.city ? `(${rep.city})` : ""}</span>
                              <button
                                onClick={() => handleLikeReply(post.id, rep.id)}
                                className="flex items-center gap-1 text-stone-400 hover:text-amber-300 active:scale-95 transition-all"
                              >
                                <ThumbsUp className="w-3 h-3 text-amber-400" />
                                <span>{rep.likes} إعجاب</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Reply Form */}
                    <div className="pt-3 border-t border-stone-800 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="اسمك أو لقبك (اختياري)..."
                          value={authorDraft}
                          onChange={(e) => setReplyAuthorMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 sm:w-1/3"
                        />
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="اكتب ردك أو إجابتك الموثقة هنا..."
                            value={replyDraft}
                            onChange={(e) => setReplyTextMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddReply(post.id);
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => handleAddReply(post.id)}
                            disabled={!replyDraft.trim()}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow flex items-center gap-1 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>إرسال</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* NEW POST MODAL */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewPostModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 font-mono">منتدى قبيلة بني شهر</span>
              <h3 className="text-xl font-bold font-['Amiri'] text-white">طرح سؤال أو مشاركة قصة تاريخية</h3>
              <p className="text-xs text-stone-400">
                شارك معلوماتك أو استفسارك مع الآلاف من أبناء القبيلة وزوار السراة وتهامة.
              </p>
            </div>

            {formSuccessMessage ? (
              <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">{formSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-4">
                {/* Post Type Switcher */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPostType("question")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newPostType === "question"
                        ? "bg-emerald-950 text-emerald-200 border-emerald-400 shadow-md ring-2 ring-emerald-500/30"
                        : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>❓ سؤال واستفسار سياحي</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType("story")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newPostType === "story"
                        ? "bg-amber-950 text-amber-200 border-amber-400 shadow-md ring-2 ring-amber-500/30"
                        : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>📜 قصة ورواية تراثية</span>
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    {newPostType === "question" ? "عنوان السؤال / الاستفسار *" : "عنوان القصة أو الرواية *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      newPostType === "question"
                        ? "مثال: ما هو أفضل وقت لزيارة شلالات تنومة ومسار جبل ناصر؟"
                        : "مثال: قصة كرم أهالي جبل منعاء وتشييد الحصون الحجرية..."
                    }
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    {newPostType === "question" ? "تفاصيل السؤال والموقع *" : "نص القصة والرواية الموثقة *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اكتب هنا التفاصيل الكاملة..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Author Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">اسم الكاتب / الراوي *</label>
                    <input
                      type="text"
                      required
                      placeholder="اسمك الكامل"
                      value={newPostAuthor}
                      onChange={(e) => setNewPostAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">القبيلة / الانتساب</label>
                    <input
                      type="text"
                      placeholder="مثال: بني بكر / العوامر"
                      value={newPostTribe}
                      onChange={(e) => setNewPostTribe(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">المدينة / المنطقة</label>
                    <input
                      type="text"
                      placeholder="النماص، تنومة، المجاردة..."
                      value={newPostCity}
                      onChange={(e) => setNewPostCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">تصنيف الموضوع</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="طرق ومسارات">طرق ومسارات وهايكنج</option>
                      <option value="بطولات الأجداد">بطولات الأجداد والتاريخ</option>
                      <option value="مزارع وضيافة">مزارع وضيافة وتقاليد</option>
                      <option value="لهجة وأمثال">لهجة وأمثال شعبية</option>
                      <option value="أنساب وديار">أنساب وديار قديمة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">كلمات مفتاحية (مفصولة بفواصل)</label>
                    <input
                      type="text"
                      placeholder="مثال: قلاع, هايكنج, صيف"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 text-xs font-bold hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/30 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>نشر المشاركة فوراً</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
