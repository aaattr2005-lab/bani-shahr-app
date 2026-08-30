import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles,
  Quote
} from "lucide-react";
import { DIALECT_WORDS } from "../data/baniShahrData";
import { DialectWord } from "../types";

export const DialectAndCultureQuiz: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dictionary" | "quiz">("dictionary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Quiz state
  const quizQuestions = [
    {
      id: 1,
      question: "ماذا تعني عبارة 'أرحبوا تراحيب المطر' في مجالس وأعراف بني شهر؟",
      options: [
        "طلب الاستعداد لهطول الأمطار في الحقول",
        "ترحيب عارم ودافئ يعبر عن شدة الفرح بالضيف كمطر الخير",
        "دعوة لتأجيل الجلسة لما بعد السيل",
        "نداء لمزارعي السراة لجني المحاصيل",
      ],
      correctAnswer: 1,
      explanation: "تعد 'أرحبوا تراحيب المطر والسيل' من أرفع عبارات الترحيب في السراة وتدل على الكرم وفيض المشاعر الطيبة.",
    },
    {
      id: 2,
      question: "عندما يقول شخص في تنومة أو النماص: 'يا هَوْلَه'، ماذا يقصد عادة؟",
      options: [
        "التعبير عن الخوف والهلع",
        "طلب النجدة في الجبال",
        "التعبير عن التعجب والإعجاب والدهشة",
        "التحذير من هبوط الضباب",
      ],
      correctAnswer: 2,
      explanation: "'هوله' أداة تنبيه وتعجب شهريّة فصيحة تعبر عن الإعجاب بجمال الشيء أو ضخامته.",
    },
    {
      id: 3,
      question: "ما هي 'الحَويَّة' في العمارة الحجرية التراثية لبني شهر؟",
      options: [
        "فناء البيت الداخلي أو الحوش المحاط بالغرف والحصون",
        "نافذة المراقبة في أعلى القصبة",
        "المخزن المخصص لحفظ حبوب القمح",
        "المدفأة الحجرية الأرضية",
      ],
      correctAnswer: 0,
      explanation: "الحوية هي الفناء المفتوح داخل البيوت التراثية حيث تجتمع العائلة وحولها الغرف والمجالس.",
    },
    {
      id: 4,
      question: "ماذا تعني كلمة 'إفلحْ' عند توديع الضيف أو المسافر؟",
      options: [
        "ازرع الأرض في الصباح",
        "انطلق مصحوباً بالتوفيق والفلاح والسلامة",
        "تراجع عن قرارك ولا تسافر",
        "انتظر حتى ينجلي الضباب",
      ],
      correctAnswer: 1,
      explanation: "'إفلح' من الفلاح والنجاح، وهي دعوة مخلصة بالتوفيق والتيسير للمغادر.",
    },
    {
      id: 5,
      question: "ما هو المكون الأساسي لطبق 'العصيدة' الشهري التراثي؟",
      options: [
        "الأرز البسمتي مع اللبن",
        "دقيق البر أو الذرة البلدي مع السمن والعسل أو المرق",
        "السميد المحلى بماء الورد",
        "القرصان المجفف مع التمر",
      ],
      correctAnswer: 1,
      explanation: "تُضرب العصيدة من دقيق البر الصافي وتقدم في صحفة خشبية مع السمن البري وعسل السدر أو المرق الطازج.",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const filteredWords = DIALECT_WORDS.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.word.includes(searchQuery) ||
      item.meaning.includes(searchQuery) ||
      item.exampleSentence.includes(searchQuery);

    return matchesCat && matchesSearch;
  });

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <section id="dialect" className="py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>بلاغة السراة وموروث الأجداد اللغوي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-3">
            معجم اللهجة والأمثال وثقافة بني شهر
          </h2>
          <p className="text-[#5A524C] text-base sm:text-lg font-light">
            استكشف فصاحة المفردات والعبارات الشهرية الأصيلة وتعرف على معانيها وسياقاتها التراثية في المجالس والحياة اليومية.
          </p>
        </div>

        {/* Tab Switcher (Dictionary vs Interactive Quiz) */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-white border border-[#E6DEC8] flex items-center gap-2 shadow-sm">
            <button
              id="tab-dictionary-btn"
              onClick={() => setActiveTab("dictionary")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "dictionary"
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>معجم الكلمات والعبارات</span>
            </button>
            <button
              id="tab-quiz-btn"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-700 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>تحدي واختبار اللهجة</span>
            </button>
          </div>
        </div>

        {/* View 1: Dictionary & Search */}
        {activeTab === "dictionary" ? (
          <div className="space-y-8">
            
            {/* Search and Filters */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E6DEC8] flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن كلمة، معنى، أو مثل..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {["all", "ترحيب وتحية", "حياة يومية", "أوصاف وطبيعة", "أمثال شعبية"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-800 text-white"
                        : "bg-[#F8F4EA] text-stone-700 hover:bg-stone-100 border border-[#E6DEC8]"
                    }`}
                  >
                    {cat === "all" ? "الكل" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-white hover:bg-[#F8F4EA] border border-[#E6DEC8] hover:border-emerald-600/50 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {item.category}
                      </span>
                      <Quote className="w-4 h-4 text-amber-700/40" />
                    </div>

                    <h3 className="text-2xl font-extrabold font-['Amiri'] text-[#12201A] mb-2">
                      «{item.word}»
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5A524C] font-light leading-relaxed mb-4">
                      {item.meaning}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6DEC8] space-y-2">
                    <div className="p-3 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs text-stone-800 font-['Amiri'] italic">
                      <span className="text-emerald-800 font-bold ml-1">مثال الاستخدام:</span>
                      "{item.exampleSentence}"
                    </div>
                    <span className="text-[11px] text-stone-600 block">
                      📌 <strong>السياق:</strong> {item.context}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* View 2: Interactive Dialect Quiz Challenge */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E6DEC8] p-6 sm:p-8 shadow-lg">
            
            {!isQuizCompleted ? (
              <div>
                
                {/* Quiz Header & Progress */}
                <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                      السؤال {currentQuestionIndex + 1} من {quizQuestions.length}
                    </span>
                  </div>
                  <span className="text-xs text-stone-600">
                    النقاط الحالية: <strong className="text-emerald-800 font-bold">{score}</strong>
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-lg sm:text-xl font-bold font-['Amiri'] text-[#12201A] leading-relaxed mb-6">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === quizQuestions[currentQuestionIndex].correctAnswer;
                    
                    let btnStyle = "bg-[#F8F4EA] border-[#E6DEC8] text-stone-800 hover:bg-stone-100";
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-red-100 border-red-500 text-red-950";
                      } else {
                        btnStyle = "bg-[#F8F4EA]/40 border-[#E6DEC8] text-stone-400 opacity-60";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-sm";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-right p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation after submission */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs text-stone-700 mb-6 animate-fadeIn">
                    <strong className="text-amber-800 block mb-1">💡 التوضيح التراثي:</strong>
                    {quizQuestions[currentQuestionIndex].explanation}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  {!isAnswerSubmitted ? (
                    <button
                      id="submit-quiz-answer-btn"
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-40"
                    >
                      تأكيد الإجابة
                    </button>
                  ) : (
                    <button
                      id="next-quiz-question-btn"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? "السؤال التالي" : "عرض النتيجة النهائية"}
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* Quiz Completion Score Card */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 shadow-inner">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-['Amiri'] text-[#12201A] mb-2">
                    كفو! أتممت اختبار اللهجة والتراث الشهري
                  </h3>
                  <p className="text-stone-600 text-sm font-light">
                    نتيجتك: <strong className="text-emerald-800 text-xl font-bold">{score}</strong> من أصل{" "}
                    <strong>{quizQuestions.length}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-700 text-xs max-w-md mx-auto leading-relaxed">
                  {score === 5
                    ? "🌟 ماشاء الله تبارك الله! معرفتك بالتراث واللهجة الشهرية أصيلة وعميقة كعراقة حصون السراة."
                    : score >= 3
                    ? "👍 ممتاز جداً! لديك إلمام رائع بأعراف ومصطلحات أهل بني شهر الكرام."
                    : "🌿 بداية جميلة للتعرف على بلاغة وفصاحة ديار بني شهر وسراة عسير."}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleRestartQuiz}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة الاختبار</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("dictionary")}
                    className="px-6 py-2.5 rounded-xl bg-[#F8F4EA] hover:bg-stone-100 text-stone-700 border border-[#E6DEC8] text-xs sm:text-sm"
                  >
                    العودة للمعجم
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
