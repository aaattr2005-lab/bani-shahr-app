/**
 * شجرة قبيلة بني شهر — الفروع والبطون المعتمدة
 * 
 * المصدر المعتمد: كتاب "محمد بن دهمان الشهري ودوره في بسط نفوذ الدولة السعودية الأولى إلى بلاد بني شهر"
 * تأليف: علي بن شايخ البكري الشهري
 * 
 * الأصل والنسب الشريف:
 * أولاد الأزد الغوث ← أولاد الهنو بن الأزد ← أولاد الحجر بن الهنو ← أولاد ربيعة بن الحجر
 */

export interface LineageRoot {
  grandFather: string;
  lineagePath: string[];
  description: string;
  sourceBook: string;
  author: string;
}

export const BANI_SHAHR_ROOT_LINEAGE: LineageRoot = {
  grandFather: "ربيعة بن الحجر بن الهنو بن الأزد",
  lineagePath: [
    "الأزد الغوث",
    "الهنو بن الأزد",
    "الحجر بن الهنو",
    "ربيعة بن الحجر",
    "قبائل وبطون بني شهر"
  ],
  description: "قبيلة قحطانية أزدية عريقة استقرت في أعالي جبال السراة وسفوح وأودية تهامة والبادية.",
  sourceBook: "محمد بن دهمان الشهري ودوره في بسط نفوذ الدولة السعودية الأولى إلى بلاد بني شهر",
  author: "علي بن شايخ البكري الشهري"
};

export interface BatnItem {
  id: string; // Unique ID to distinguish duplicate names across branches
  name: string;
  parentBranchId: string;
  branchName: string;
  subGroup?: string; // e.g. "بنو عبد" or "بنو سعد" or "حاضرة وبادية"
  region: "السراة" | "تهامة" | "البادية" | "السراة وتهامة" | "السراة والبادية" | "السراة وتهامة والبادية";
  notes?: string;
  prominentFigures?: string[];
  villagesOrCenters?: string[];
}

export interface MainBranch {
  id: string;
  number: number;
  name: string;
  alias?: string;
  ancestorLineage: string;
  settlementLocation: string;
  region: "السراة" | "تهامة" | "البادية" | "السراة وتهامة" | "السراة والبادية" | "السراة وتهامة والبادية";
  butoonCount: number;
  description: string;
  subGroups?: {
    id: string;
    name: string;
    region: string;
    butoonIds: string[];
  }[];
  butoon: BatnItem[];
}

export const MAIN_BRANCHES_DATA: MainBranch[] = [
  // =========================================================================
  // 1. شهر ثرامين
  // =========================================================================
  {
    id: "shahr-tharameen",
    number: 1,
    name: "شهر ثرامين",
    alias: "ثرامين",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "يحلّون وسط بلاد بني شهر تقريبًا (السراة والبادية)",
    region: "السراة وتهامة والبادية",
    butoonCount: 5,
    description: "أحد الفروع الكبرى في بني شهر، يحلون وسط البلاد ويضم بطوناً عريقة ذات حاضرة وبادية.",
    butoon: [
      {
        id: "tharameen-kalathimah",
        name: "الكلاثمة",
        parentBranchId: "shahr-tharameen",
        branchName: "شهر ثرامين",
        subGroup: "حاضرة وبادية",
        region: "السراة",
        notes: "حاضرة وبادية، تضم قصر العسابلة وحاضرة النماص التاريخية.",
        villagesOrCenters: ["النماص القديمة", "حي الجهينات", "قصر العسابلة"]
      },
      {
        id: "tharameen-banubakr",
        name: "بنو بكر",
        parentBranchId: "shahr-tharameen",
        branchName: "شهر ثرامين",
        subGroup: "حاضرة وبادية",
        region: "السراة",
        notes: "حاضرة وبادية، تمتاز بالقلاع المنيعة وسفوح الجبال.",
        villagesOrCenters: ["تنومة", "سد وادي بكر"]
      },
      {
        id: "tharameen-banufushair",
        name: "بنو فشير",
        parentBranchId: "shahr-tharameen",
        branchName: "شهر ثرامين",
        subGroup: "حاضرة وبادية",
        region: "السراة",
        notes: "حاضرة وبادية في سراة وبادية بني شهر.",
        villagesOrCenters: ["السراة والبادية"]
      },
      {
        id: "tharameen-banujubair",
        name: "بنو جبير",
        parentBranchId: "shahr-tharameen",
        branchName: "شهر ثرامين",
        region: "السراة",
        notes: "أهل مزارع وبساتين وحصون في محيط النماص.",
        villagesOrCenters: ["النماص", "وادي جبير"]
      },
      {
        id: "tharameen-al-briaa",
        name: "آل بريّاع (آل بن رياع)",
        parentBranchId: "shahr-tharameen",
        branchName: "شهر ثرامين",
        subGroup: "حاضرة وبادية",
        region: "السراة",
        notes: "حاضرة وبادية في وسط بلاد بني شهر.",
        villagesOrCenters: ["السراة والبادية"]
      }
    ]
  },

  // =========================================================================
  // 2. بنو التيم
  // =========================================================================
  {
    id: "banu-altaym",
    number: 2,
    name: "بنو التيم",
    alias: "التيم",
    ancestorLineage: "بنو التيم بن مالك بن ربيعة بن الحجر",
    settlementLocation: "يسكنون السراة وتهامة",
    region: "السراة وتهامة",
    butoonCount: 11,
    description: "بنو التيم بن مالك بن ربيعة بن الحجر، فرع رئيسي يمتد في السراة وتهامة ويضم 11 بطناً موثقاً.",
    butoon: [
      {
        id: "taym-zaydan-mohammed",
        name: "آل زيدان بن محمد",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة",
        notes: "من كبار بطون بني التيم في السراة.",
        villagesOrCenters: ["سراة بني التيم", "آل حلبان", "آل يعلى"]
      },
      {
        id: "taym-waleed-amer",
        name: "آل وليد بن عامر",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة",
        notes: "فرع كريم في السراة والشعف.",
        villagesOrCenters: ["شعف آل وليد", "الظهارة"]
      },
      {
        id: "taym-laylah-ali",
        name: "آل ليلح بن علي",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة",
        notes: "أهل الخضراء وقرى السراة البديعة.",
        villagesOrCenters: ["قرية الخضراء", "آل قحطان"]
      },
      {
        id: "taym-beljeda",
        name: "بلجدع",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة وتهامة",
        notes: "أحد بطون بني التيم العريقة."
      },
      {
        id: "taym-banu-zuhair",
        name: "بنو زهير",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة",
        notes: "بطن أصيل من بني التيم بن مالك."
      },
      {
        id: "taym-banu-hussein",
        name: "بنو حسين",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة",
        notes: "أهل شجاعة ومزارع تاريخية."
      },
      {
        id: "taym-al-someid",
        name: "آل صميد",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة وتهامة",
        notes: "فرع من بني التيم."
      },
      {
        id: "taym-al-shughaib",
        name: "آل شغيب",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "السراة وتهامة",
        notes: "أحد بطون بني التيم."
      },
      {
        id: "taym-al-mumallah",
        name: "آل مملح",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "تهامة",
        notes: "بطن من بطون بني التيم في تهامة."
      },
      {
        id: "taym-al-majardah",
        name: "المجاردة",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "تهامة",
        notes: "حاضرة تهامة الشهيرة وأهل الأودية الخصيبة.",
        villagesOrCenters: ["مدينة المجاردة", "وادي خاط"]
      },
      {
        id: "taym-al-mukhlad",
        name: "آل مخلد",
        parentBranchId: "banu-altaym",
        branchName: "بنو التيم",
        region: "تهامة",
        notes: "بطن من بطون بني التيم في تهامة."
      }
    ]
  },

  // =========================================================================
  // 3. بلحارث
  // =========================================================================
  {
    id: "balharith",
    number: 3,
    name: "بلحارث",
    alias: "بنو الحارث",
    ancestorLineage: "بنو الحارث بن ربيعة بن الحجر",
    settlementLocation: "يسكنون السراة وتهامة والبادية",
    region: "السراة وتهامة والبادية",
    butoonCount: 9,
    description: "بنو الحارث بن ربيعة بن الحجر، يسكنون السراة وتهامة والبادية، ومنهم الأمير محمد بن دهمان الشهري قائد جيوش الدولة السعودية الأولى.",
    butoon: [
      {
        id: "balharith-nazilah",
        name: "نازلة",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة والبادية",
        notes: "من كبار بطون بلحارث."
      },
      {
        id: "balharith-al-jahadhimah",
        name: "الجهاضمة (اليهاضمة)",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة",
        notes: "أهل شجاعة وحصون منيعة."
      },
      {
        id: "balharith-banu-jar",
        name: "بنو جار",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة والبادية",
        notes: "بطن أصيل من بلحارث."
      },
      {
        id: "balharith-jubaihah",
        name: "جبيهة (ييبهة)",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة والبادية",
        notes: "فرع من فروع بلحارث."
      },
      {
        id: "balharith-al-awsaa",
        name: "العوصاء",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة",
        notes: "أهل قرى وحصون في بلحارث."
      },
      {
        id: "balharith-al-dahman",
        name: "آل دهمان",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة والبادية",
        notes: "منها الأمير محمد بن دهمان الشهري، بطل وقائد تاريخي في توحيد البلاد.",
        prominentFigures: ["الأمير محمد بن دهمان الشهري"]
      },
      {
        id: "balharith-al-saadi",
        name: "آل الصعدي",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة",
        notes: "أهل نخوة ومواقف مشهودة في سراة بلحارث."
      },
      {
        id: "balharith-al-omarah",
        name: "العُمَرة",
        parentBranchId: "balharith",
        branchName: "بلحارث",
        region: "السراة والبادية",
        notes: "بطن من بطون بلحارث."
      },
      {
        id: "balharith-al-shaafeen",
        name: "الشعفين",
        parentBranchId: "balharith",
        branchName: "بلحارth",
        region: "السراة",
        notes: "أهل شعاف ومطلات جبلية شامخة."
      }
    ]
  },

  // =========================================================================
  // 4. العوامر
  // =========================================================================
  {
    id: "al-awamir",
    number: 4,
    name: "العوامر",
    ancestorLineage: "عامر بن الحجر",
    settlementLocation: "السراة وتهامة",
    region: "السراة وتهامة",
    butoonCount: 6,
    description: "ينتسبون إلى عامر بن الحجر، وينقسمون إلى فرعين رئيسيين (بنو عبد، وبنو سعد) يتفرع منهما 6 بطون.",
    subGroups: [
      {
        id: "awamir-banu-abd",
        name: "بنو عبد",
        region: "السراة وتهامة",
        butoonIds: ["awamir-belhasin", "awamir-al-bohaish", "awamir-al-nahy", "awamir-banu-lam"]
      },
      {
        id: "awamir-banu-saad",
        name: "بنو سعد",
        region: "السراة وتهامة",
        butoonIds: ["awamir-kinanah", "awamir-banu-mashhoor"]
      }
    ],
    butoon: [
      // أ. بنو عبد
      {
        id: "awamir-belhasin",
        name: "بلحصين",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو عبد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو عبد، يمتدون بين السراة وتهامة.",
        villagesOrCenters: ["جنوب النماص", "تنومة"]
      },
      {
        id: "awamir-al-bohaish",
        name: "آل بهيش",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو عبد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو عبد، أهل وادي مليح وتنومة والشلالات.",
        villagesOrCenters: ["تنومة", "وادي مليح"]
      },
      {
        id: "awamir-al-nahy",
        name: "آل النهي",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو عبد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو عبد في السراة وتهامة."
      },
      {
        id: "awamir-banu-lam",
        name: "بنو لام",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو عبد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو عبد في السراة وتهامة."
      },
      // ب. بنو سعد
      {
        id: "awamir-kinanah",
        name: "كنانة",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو سعد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو سعد في السراة وتهامة."
      },
      {
        id: "awamir-banu-mashhoor",
        name: "بنو مشهور",
        parentBranchId: "al-awamir",
        branchName: "العوامر",
        subGroup: "بنو سعد (السراة وتهامة)",
        region: "السراة وتهامة",
        notes: "من فرع بنو سعد، أهل تاريخ عريق وحصون ومزارع.",
        villagesOrCenters: ["النماص", "المشرفة"]
      }
    ]
  },

  // =========================================================================
  // 5. شهر الشام
  // =========================================================================
  {
    id: "shahr-alsham",
    number: 5,
    name: "شهر الشام",
    ancestorLineage: "أولاد ربيعة بن الحجر (شمال السراة)",
    settlementLocation: "3 بطون في السراة (شمال بلاد بني شهر)",
    region: "السراة",
    butoonCount: 3,
    description: "قبائل شمال السراة (شهر الشام)، بوابة السراة الشمالية وموطن السرح والمدرجات الزراعية.",
    butoon: [
      {
        id: "alsham-banu-thabit",
        name: "بنو ثابت",
        parentBranchId: "shahr-alsham",
        branchName: "شهر الشام",
        region: "السراة",
        notes: "بوابة السراة الشمالية في مركز السرح وسهوله الزراعية.",
        villagesOrCenters: ["مركز السرح", "الدارة", "السرح الشمالي"]
      },
      {
        id: "alsham-banu-yous",
        name: "بنو يوس",
        parentBranchId: "shahr-alsham",
        branchName: "شهر الشام",
        region: "السراة",
        notes: "قبيلة عريقة تضم شعف آل وليد وقصر المقر الحضاري.",
        villagesOrCenters: ["شعف آل وليد", "النماص الشمالية"]
      },
      {
        id: "alsham-al-hashem",
        name: "آل هاشم",
        parentBranchId: "shahr-alsham",
        branchName: "شهر الشام",
        region: "السراة",
        notes: "أهل كرم وحكمة ومزارع البُر الشهري الأصيل في السرح."
      }
    ]
  },

  // =========================================================================
  // 6. أثرب
  // =========================================================================
  {
    id: "athrib",
    number: 6,
    name: "أثرب",
    alias: "جبل أثرب",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "7 بطون في تهامة (محيط جبل أثرب وأوديته)",
    region: "تهامة",
    butoonCount: 7,
    description: "قبائل جبل أثرب وتهامة، أهل المنحدرات الشاهقة ومزارع البن والموز وعسل السدر.",
    butoon: [
      {
        id: "athrib-al-yahmad",
        name: "آل يحمد",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "من بطون أثرب في تهامة."
      },
      {
        id: "athrib-al-yalaa",
        name: "آل يعلاء",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "بطن من بطون أثرب التهامية."
      },
      {
        id: "athrib-al-waheesh",
        name: "آل وحيش",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "أهل شجاعة في جبل أثرب وتهامة."
      },
      {
        id: "athrib-al-asim",
        name: "آل عاصم",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "بطن من بطون أثرب."
      },
      {
        id: "athrib-al-mahjoobah",
        name: "آل محجوبة",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "من فروع أثرب التهامية."
      },
      {
        id: "athrib-al-shunayf",
        name: "آل الشنيف",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "أهل مزارع ونخيل في أودية أثرب."
      },
      {
        id: "athrib-al-yamani",
        name: "آل يماني",
        parentBranchId: "athrib",
        branchName: "أثرب",
        region: "تهامة",
        notes: "فرع من أثرب في تهامة بني شهر."
      }
    ]
  },

  // =========================================================================
  // 7. الشهارية (إم شهارية)
  // =========================================================================
  {
    id: "al-shahariyah",
    number: 7,
    name: "الشهارية (إم شهارية)",
    alias: "إم شهارية",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "12 بطنًا في تهامة",
    region: "تهامة",
    butoonCount: 12,
    description: "الشهارية (إم شهارية) وتضم 12 بطناً تنتشر في سهول وأودية تهامة بني شهر الخصيبة.",
    butoon: [
      { id: "shahariyah-naas", name: "آل نعص", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-mandhar", name: "آل المنظر", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-yaryooa", name: "آل يريوع", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-shaniyah", name: "آل شنية", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-zarai", name: "آل الزرعي", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-hassan", name: "آل حسن", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-shabeen", name: "آل الشعبين", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-maarbah", name: "المعربة", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-hudailah", name: "آل حديلة", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-helwah", name: "آل حلوة", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-jameel", name: "آل جميل", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" },
      { id: "shahariyah-mashhakah", name: "آل المشحكة", parentBranchId: "al-shahariyah", branchName: "الشهارية", region: "تهامة" }
    ]
  },

  // =========================================================================
  // 8. ثربان
  // =========================================================================
  {
    id: "tharban",
    number: 8,
    name: "ثربان",
    alias: "أهل ثربان",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "10 بطون في تهامة (محيط جبل ثربان الشامخ)",
    region: "تهامة",
    butoonCount: 10,
    description: "قبائل جبل ثربان الأشم في تهامة، وتضم 10 بطون يشتهرون بمناحل عسل السدر والسمر ومزارع الحبوب.",
    butoon: [
      { id: "tharban-talaleea", name: "الطلاليع", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة", notes: "مركز الطلاليع وسفح جبل ثربان." },
      { id: "tharban-mujamid", name: "آل مجامد", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-qahmah", name: "القحمة", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-awajirah", name: "العواجرة", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-zookah", name: "الزوكة", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-hazmah", name: "آل حزمة", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-ghailan", name: "آل غيلان", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-salman", name: "آل سلمان", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-rashed", name: "آل راشد", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" },
      { id: "tharban-lalaa", name: "آل لعلاء", parentBranchId: "tharban", branchName: "ثربان", region: "تهامة" }
    ]
  },

  // =========================================================================
  // 9. آل العلاء (آل لعلا)
  // =========================================================================
  {
    id: "al-ala",
    number: 9,
    name: "آل العلاء (آل لعلا)",
    alias: "آل لعلا",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "10 بطون في تهامة",
    region: "تهامة",
    butoonCount: 10,
    description: "قبائل آل العلاء في تهامة، وتضم 10 بطون عريقة تستقر في أودية المجاردة وتهامة بني شهر.",
    butoon: [
      { id: "ala-eyaf", name: "آل عياف", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      // Note: Distinct from mousa of jeehni by parentBranchId & ID
      { id: "ala-mousa", name: "آل موسى", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة", notes: "آل موسى (فرع آل العلاء في تهامة)" },
      { id: "ala-sobaan", name: "آل صعبان", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-amer", name: "آل عامر", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-musabbah", name: "آل مصبح", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-amer-moafa", name: "آل عامر بن معافا", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-khudair", name: "آل خضير", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-saad", name: "آل سعد", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-muqashish", name: "آل مقشش", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" },
      { id: "ala-rashed-theeban", name: "آل راشد وآل ذيبان", parentBranchId: "al-ala", branchName: "آل العلاء", region: "تهامة" }
    ]
  },

  // =========================================================================
  // 10. آل الجيحني (آل إم جحيني)
  // =========================================================================
  {
    id: "al-jeehni",
    number: 10,
    name: "آل الجيحني (آل إم جحيني)",
    alias: "آل إم جحيني",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "3 بطون كبيرة في تهامة",
    region: "تهامة",
    butoonCount: 3,
    description: "3 بطون كبيرة في تهامة تمتاز بالتلاحم والكرم وحماية الأودية التهامية.",
    butoon: [
      { id: "jeehni-qabeeb", name: "آل قبيب", parentBranchId: "al-jeehni", branchName: "آل الجيحني", region: "تهامة" },
      // Note: Distinct from mousa of ala by parentBranchId & ID
      { id: "jeehni-mousa", name: "آل موسى", parentBranchId: "al-jeehni", branchName: "آل الجيحني", region: "تهامة", notes: "آل موسى (فرع آل الجيحني في تهامة)" },
      { id: "jeehni-anqaa", name: "آل العنقاء", parentBranchId: "al-jeehni", branchName: "آل الجيحني", region: "تهامة" }
    ]
  },

  // =========================================================================
  // 11. سفيان
  // =========================================================================
  {
    id: "sufyan",
    number: 11,
    name: "سفيان",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "4 بطون في تهامة",
    region: "تهامة",
    butoonCount: 4,
    description: "قبائل سفيان في تهامة، وتتفرع إلى 4 بطون عريقة.",
    butoon: [
      { id: "sufyan-osmah", name: "العصمة", parentBranchId: "sufyan", branchName: "سفيان", region: "تهامة" },
      { id: "sufyan-muhlaff", name: "المحلف", parentBranchId: "sufyan", branchName: "سفيان", region: "تهامة" },
      { id: "sufyan-kharmaa", name: "آل خرماء", parentBranchId: "sufyan", branchName: "سفيان", region: "تهامة" },
      { id: "sufyan-mujayesh", name: "آل مجايش", parentBranchId: "sufyan", branchName: "سفيان", region: "تهامة" }
    ]
  },

  // =========================================================================
  // 12. عبس
  // =========================================================================
  {
    id: "abs",
    number: 12,
    name: "عبس",
    ancestorLineage: "أولاد ربيعة بن الحجر",
    settlementLocation: "4 بطون في تهامة",
    region: "تهامة",
    butoonCount: 4,
    description: "قبائل عبس في تهامة بني شهر، وتضم 4 بطون ذات تاريخ وتراث أصيل.",
    butoon: [
      { id: "abs-obaid", name: "آل عبيد", parentBranchId: "abs", branchName: "عبس", region: "تهامة" },
      { id: "abs-haid", name: "حيد عبس", parentBranchId: "abs", branchName: "عبس", region: "تهامة" },
      { id: "abs-ammar", name: "آل عَمَّار", parentBranchId: "abs", branchName: "عبس", region: "تهامة" },
      { id: "abs-hasanah", name: "الحصنة", parentBranchId: "abs", branchName: "عبس", region: "تهامة" }
    ]
  }
];

// Flat list of all 83+ Batn items with unique parent_id references
export const ALL_BANI_SHAHR_BUTOON: BatnItem[] = MAIN_BRANCHES_DATA.flatMap(b => b.butoon);

// Total counts summary
export const GENEALOGY_STATISTICS = {
  totalBranches: 12,
  totalButoon: ALL_BANI_SHAHR_BUTOON.length,
  sarawatCount: ALL_BANI_SHAHR_BUTOON.filter(b => b.region.includes("السراة")).length,
  tihamahCount: ALL_BANI_SHAHR_BUTOON.filter(b => b.region.includes("تهامة")).length,
  badiyahCount: ALL_BANI_SHAHR_BUTOON.filter(b => b.region.includes("البادية")).length,
};
