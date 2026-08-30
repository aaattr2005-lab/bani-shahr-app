export * from "./genealogyData";

export interface TreeNode {
  id: string;
  name: string;
  title?: string;
  generation: number;
  fakhdhId?: string;
  bio?: string;
  birthYear?: string;
  sonsCount?: number;
  isPatriarch?: boolean;
  children?: TreeNode[];
}

export interface FakhdhItem {
  id: string;
  name: string;
  subTitle?: string;
  sheikhOrLeader?: string;
  villages: string[];
  description: string;
  approximateFamilies: number;
  rootAncestor: string;
  familyTree: TreeNode;
}

export type TribeDivision = 
  | "السراة والبادية"
  | "السراة وتهامة"
  | "شمال السراة"
  | "تهامة وجبل أثرب"
  | "تهامة وجبل ثربان"
  | "تهامة وأودية المجاردة";

export interface DetailedTribe {
  id: string;
  name: string;
  division: TribeDivision;
  divisionNumber: number; // 1 to 12
  region: "السراة" | "تهامة" | "البادية" | "السراة وتهامة" | "السراة وتهامة والبادية";
  center: string;
  description: string;
  ancestorName: string;
  villagesCount: number;
  highlights: string[];
  afkhadh: FakhdhItem[];
  joinedUsersCount?: number;
  supervisorName?: string;
  supervisorCode?: string;
}

/**
 * القبائل والفروع الـ 12 المعتمدة لبني شهر
 * المصدر المعتمد: كتاب "محمد بن دهمان الشهري ودوره في بسط نفوذ الدولة السعودية الأولى إلى بلاد بني شهر"
 * تأليف: علي بن شايخ البكري الشهري
 */
export const DETAILED_TRIBES: DetailedTribe[] = [
  // =========================================================================
  // 1. شهر ثرامين
  // =========================================================================
  {
    id: "shahr-tharameen",
    name: "شهر ثرامين",
    division: "السراة والبادية",
    divisionNumber: 1,
    region: "السراة وتهامة والبادية",
    center: "النماص ووادي بكر وقصر العسابلة وبادية بني شهر",
    ancestorName: "أولاد ربيعة بن الحجر بن الهنو بن الأزد",
    villagesCount: 42,
    description: "أحد الفروع الكبرى في بني شهر، يحلون وسط البلاد ويضم 5 بطون عريقة ذات حاضرة وبادية وقلاع تاريخية.",
    highlights: ["حاضرة النماص التاريخية", "قصر العسابلة العريق", "سد وادي بكر", "سراة وبادية ثرامين"],
    joinedUsersCount: 520,
    supervisorName: "مشرف شهر ثرامين",
    supervisorCode: "1101",
    afkhadh: [
      {
        id: "tharameen-kalathimah",
        name: "الكلاثمة",
        subTitle: "حاضرة وبادية",
        sheikhOrLeader: "أعيان ومشايخ الكلاثمة",
        villages: ["النماص القديمة", "حي الجهينات", "قصر العسابلة", "قرية آل خازم", "شعب العارضة"],
        description: "حاضرة وبادية عريقة، تضم قصر العسابلة الشامخ وحاضرة النماص التاريخية ومزارع السراة.",
        approximateFamilies: 650,
        rootAncestor: "كلثم بن ربيعة",
        familyTree: {
          id: "root-kalathimah",
          name: "الجد كلثم بن ربيعة",
          title: "الجد الجامع لبطن الكلاثمة",
          generation: 1,
          isPatriarch: true,
          bio: "الجد المؤسس لبطن الكلاثمة، عُرف بالحكمة والشجاعة وعمارة السراة وباديتها.",
          children: [
            {
              id: "kal-1",
              name: "عسبل بن كلثم",
              generation: 2,
              bio: "فرع العسابلة وبناة قصر العسابلة التاريخي في النماص.",
              children: [
                { id: "kal-1-1", name: "محمد بن عسبل", generation: 3, children: [] },
                { id: "kal-1-2", name: "علي بن عسبل", generation: 3, children: [] }
              ]
            },
            {
              id: "kal-2",
              name: "ظافر بن كلثم",
              generation: 2,
              children: [
                { id: "kal-2-1", name: "سعيد بن ظافر", generation: 3, children: [] }
              ]
            }
          ]
        }
      },
      {
        id: "tharameen-banubakr",
        name: "بنو بكر",
        subTitle: "حاضرة وبادية",
        sheikhOrLeader: "معرفو وأعيان بني بكر",
        villages: ["تنومة", "سد وادي بكر", "قرية المطعن", "الحصون الحجرية"],
        description: "حاضرة وبادية، تمتاز بالقلاع المنيعة والمدرجات الزراعية وسفوح الجبال.",
        approximateFamilies: 480,
        rootAncestor: "بكر بن ربيعة",
        familyTree: {
          id: "root-banubakr",
          name: "الجد بكر بن ربيعة",
          title: "الجد الجامع لبني بكر",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "bakr-1", name: "سالم بن بكر", generation: 2, children: [] },
            { id: "bakr-2", name: "عبدالله بن بكر", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "tharameen-banufushair",
        name: "بنو فشير",
        subTitle: "حاضرة وبادية",
        sheikhOrLeader: "أعيان بني فشير",
        villages: ["سراة بني شهر", "بادية ثرامين", "السهول والمراعي"],
        description: "حاضرة وبادية في سراة وبادية بني شهر، أهل نخوة وشجاعة ومزارع تاريخية.",
        approximateFamilies: 390,
        rootAncestor: "فشير بن ربيعة",
        familyTree: {
          id: "root-banufushair",
          name: "الجد فشير بن ربيعة",
          title: "الجد الجامع لبني فشير",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "fush-1", name: "حسن بن فشير", generation: 2, children: [] },
            { id: "fush-2", name: "مسفر بن فشير", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "tharameen-banujubair",
        name: "بنو جبير",
        subTitle: "حاضرة السراة",
        sheikhOrLeader: "أعيان بني جبير",
        villages: ["النماص", "وادي جبير", "قرى البساتين", "المدرجات الزراعية"],
        description: "أهل مزارع وبساتين وحصون في محيط النماص وسراة بني شهر.",
        approximateFamilies: 410,
        rootAncestor: "جبير بن ربيعة",
        familyTree: {
          id: "root-banujubair",
          name: "الجد جبير بن ربيعة",
          title: "الجد الجامع لبني جبير",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "jub-1", name: "أحمد بن جبير", generation: 2, children: [] },
            { id: "jub-2", name: "صالح بن جبير", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "tharameen-al-briaa",
        name: "آل بريّاع (آل بن رياع)",
        subTitle: "حاضرة وبادية",
        sheikhOrLeader: "معرفو آل بريّاع",
        villages: ["السراة", "البادية", "قرى المرتفعات"],
        description: "حاضرة وبادية في وسط بلاد بني شهر، أهل كرم ومواقف مشهودة.",
        approximateFamilies: 360,
        rootAncestor: "رياع بن ربيعة",
        familyTree: {
          id: "root-briaa",
          name: "الجد رياع بن ربيعة",
          title: "الجد الجامع لآل بريّاع",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "ria-1", name: "علي بن رياع", generation: 2, children: [] }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 2. بنو التيم
  // =========================================================================
  {
    id: "banu-altaym",
    name: "بنو التيم",
    division: "السراة وتهامة",
    divisionNumber: 2,
    region: "السراة وتهامة",
    center: "شعف آل وليد وقرية الخضراء ومدينة المجاردة ووادي خاط",
    ancestorName: "بنو التيم بن مالك بن ربيعة بن الحجر",
    villagesCount: 65,
    description: "بنو التيم بن مالك بن ربيعة بن الحجر، فرع رئيسي عريق يمتد بين قمم السراة وسهول وأودية تهامة ويضم 11 بطناً موثقاً.",
    highlights: ["شعف آل وليد المطل", "مدينة المجاردة التهامية", "قرية الخضراء التاريخية", "حصون ومزارع آل زيدان"],
    joinedUsersCount: 640,
    supervisorName: "مشرف بني التيم",
    supervisorCode: "1102",
    afkhadh: [
      {
        id: "taym-zaydan-mohammed",
        name: "آل زيدان بن محمد",
        subTitle: "سراة بني التيم",
        sheikhOrLeader: "أعيان ومشايخ آل زيدان",
        villages: ["سراة بني التيم", "آل حلبان", "آل يعلى", "القرى الحجرية"],
        description: "من كبار بطون بني التيم في السراة، أهل شجاعة وحصون أثرية ومزارع خصيبة.",
        approximateFamilies: 520,
        rootAncestor: "زيدان بن محمد بن التيم",
        familyTree: {
          id: "root-zaydan",
          name: "الجد زيدان بن محمد",
          title: "الجد الجامع لآل زيدان",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "zyd-1", name: "محمد بن زيدان", generation: 2, children: [] },
            { id: "zyd-2", name: "يعلى بن زيدان", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "taym-waleed-amer",
        name: "آل وليد بن عامر",
        subTitle: "شعف السراة",
        sheikhOrLeader: "أعيان آل وليد",
        villages: ["شعف آل وليد", "الظهارة", "الحصن المرتفع", "مطلات السراة"],
        description: "فرع كريم في السراة والشعف، حماة المرتفعات وأهل الكرم والشهامة.",
        approximateFamilies: 490,
        rootAncestor: "وليد بن عامر بن التيم",
        familyTree: {
          id: "root-waleed",
          name: "الجد وليد بن عامر",
          title: "الجد الجامع لآل وليد",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "wal-1", name: "عامر بن وليد", generation: 2, children: [] },
            { id: "wal-2", name: "ظافر بن وليد", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "taym-laylah-ali",
        name: "آل ليلح بن علي",
        subTitle: "أهل الخضراء",
        sheikhOrLeader: "أعيان آل ليلح",
        villages: ["قرية الخضراء التاريخية", "آل قحطان", "وادي آل ليلح"],
        description: "أهل قرية الخضراء التاريخية وقرى السراة البديعة ذات الحصون الحجرية والمزارع.",
        approximateFamilies: 380,
        rootAncestor: "ليلح بن علي بن التيم",
        familyTree: {
          id: "root-laylah",
          name: "الجد ليلح بن علي",
          title: "الجد الجامع لآل ليلح",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "lay-1", name: "علي بن ليلح", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "taym-beljeda",
        name: "بلجدع",
        subTitle: "السراة وتهامة",
        sheikhOrLeader: "معرفو بلجدع",
        villages: ["سراة بني التيم", "منحدرات تهامة"],
        description: "أحد بطون بني التيم العريقة المنتشرة بين السراة وسفوح تهامة.",
        approximateFamilies: 320,
        rootAncestor: "جدع بن التيم",
        familyTree: {
          id: "root-beljeda",
          name: "الجد جدع بن التيم",
          generation: 1,
          isPatriarch: true,
          children: []
        }
      },
      {
        id: "taym-banu-zuhair",
        name: "بنو زهير",
        subTitle: "سراة بني التيم",
        sheikhOrLeader: "أعيان بني زهير",
        villages: ["قرى بني زهير بالسراة", "الحصون"],
        description: "بطن أصيل من بني التيم بن مالك بن ربيعة بن الحجر.",
        approximateFamilies: 310,
        rootAncestor: "زهير بن التيم",
        familyTree: { id: "root-zuhair", name: "الجد زهير بن التيم", generation: 1, isPatriarch: true }
      },
      {
        id: "taym-banu-hussein",
        name: "بنو حسين",
        subTitle: "السراة",
        sheikhOrLeader: "أعيان بني حسين",
        villages: ["قرى بني حسين", "المدرجات الزراعية"],
        description: "أهل شجاعة ومزارع تاريخية في سراة بني التيم.",
        approximateFamilies: 280,
        rootAncestor: "حسين بن التيم",
        familyTree: { id: "root-hussein", name: "الجد حسين بن التيم", generation: 1, isPatriarch: true }
      },
      {
        id: "taym-al-someid",
        name: "آل صميد",
        subTitle: "السراة وتهامة",
        sheikhOrLeader: "أعيان آل صميد",
        villages: ["السراة", "أودية تهامة"],
        description: "فرع عريق من بني التيم يمتد في السراة وسفوح تهامة.",
        approximateFamilies: 290,
        rootAncestor: "صميد بن التيم",
        familyTree: { id: "root-someid", name: "الجد صميد بن التيم", generation: 1, isPatriarch: true }
      },
      {
        id: "taym-al-shughaib",
        name: "آل شغيب",
        subTitle: "السراة وتهامة",
        sheikhOrLeader: "أعيان آل شغيب",
        villages: ["قرى آل شغيب", "أودية السفوح"],
        description: "أحد بطون بني التيم أهل حكمة وشجاعة وكرم.",
        approximateFamilies: 270,
        rootAncestor: "شغيب بن التيم",
        familyTree: { id: "root-shughaib", name: "الجد شغيب بن التيم", generation: 1, isPatriarch: true }
      },
      {
        id: "taym-al-mumallah",
        name: "آل مملح",
        subTitle: "تهامة بني التيم",
        sheikhOrLeader: "أعيان آل مملح",
        villages: ["تهامة", "أودية خاط"],
        description: "بطن من بطون بني التيم في سهول وأودية تهامة الخصيبة.",
        approximateFamilies: 330,
        rootAncestor: "مملح بن التيم",
        familyTree: { id: "root-mumallah", name: "الجد مملح بن التيم", generation: 1, isPatriarch: true }
      },
      {
        id: "taym-al-majardah",
        name: "المجاردة",
        subTitle: "حاضرة تهامة",
        sheikhOrLeader: "مشايخ وأعيان المجاردة",
        villages: ["مدينة المجاردة", "وادي خاط", "سوق الاثنين التراثي", "قرى الأودية"],
        description: "حاضرة تهامة الشهيرة وأهل الأودية الخصيبة والتجارة والزراعة العريقة.",
        approximateFamilies: 780,
        rootAncestor: "مجرد بن التيم",
        familyTree: {
          id: "root-majardah",
          name: "الجد مجرد بن التيم",
          title: "الجد الجامع للمجاردة",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "maj-1", name: "علي بن مجرد", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "taym-al-mukhlad",
        name: "آل مخلد",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل مخلد",
        villages: ["قرى آل مخلد", "أودية تهامة"],
        description: "بطن أصيل من بطون بني التيم في تهامة بني شهر.",
        approximateFamilies: 310,
        rootAncestor: "مخلد بن التيم",
        familyTree: { id: "root-mukhlad", name: "الجد مخلد بن التيم", generation: 1, isPatriarch: true }
      }
    ]
  },

  // =========================================================================
  // 3. بلحارث
  // =========================================================================
  {
    id: "balharith",
    name: "بلحارث",
    division: "السراة والبادية",
    divisionNumber: 3,
    region: "السراة وتهامة والبادية",
    center: "سراة بلحارث وقرى وادي دهمان وبادية بني شهر",
    ancestorName: "بنو الحارث بن ربيعة بن الحجر",
    villagesCount: 54,
    description: "بنو الحارث بن ربيعة بن الحجر، يسكنون السراة وتهامة والبادية، ومنهم الأمير محمد بن دهمان الشهري قائد جيوش الدولة السعودية الأولى.",
    highlights: ["موطن الأمير محمد بن دهمان الشهري", "شعاف بلحارث الشاهقة", "حصون وقلاع الجهاضمة", "مراعي ومزارع السراة والبادية"],
    joinedUsersCount: 580,
    supervisorName: "مشرف بلحارث",
    supervisorCode: "1103",
    afkhadh: [
      {
        id: "balharith-al-dahman",
        name: "آل دهمان",
        subTitle: "موطن الأمير محمد بن دهمان",
        sheikhOrLeader: "مشايخ وأعيان آل دهمان",
        villages: ["وادي دهمان", "قرية الحصن", "مزارع السراة", "مراعي البادية"],
        description: "منها الأمير محمد بن دهمان الشهري، بطل وقائد تاريخي في توحيد البلاد وبسط نفوذ الدولة السعودية الأولى.",
        approximateFamilies: 460,
        rootAncestor: "دهمان بن الحارث",
        familyTree: {
          id: "root-dahman",
          name: "الجد دهمان بن الحارث",
          title: "الجد الجامع لآل دهمان",
          generation: 1,
          isPatriarch: true,
          bio: "ينتسب إليه الأمير البطل محمد بن دهمان الشهري، أحد أعظم قادة الجزيرة العربية التاريخيين.",
          children: [
            {
              id: "dah-1",
              name: "الأمير محمد بن دهمان الشهري",
              title: "قائد جيوش الدولة السعودية الأولى",
              generation: 2,
              bio: "قاد الجيوش ووحّد الصفوف وفتح بلاد عسير وتهامة والحجاز تحت راية التوحيد.",
              children: [
                { id: "dah-1-1", name: "علي بن محمد بن دهمان", generation: 3, children: [] },
                { id: "dah-1-2", name: "سعيد بن محمد بن دهمان", generation: 3, children: [] }
              ]
            }
          ]
        }
      },
      {
        id: "balharith-nazilah",
        name: "نازلة",
        subTitle: "السراة والبادية",
        sheikhOrLeader: "أعيان نازلة",
        villages: ["سراة بلحارث", "البادية", "المراعي الخصيبة"],
        description: "من كبار بطون بلحارث المنتشرة بين السراة والبادية.",
        approximateFamilies: 430,
        rootAncestor: "نازل بن الحارث",
        familyTree: { id: "root-nazilah", name: "الجد نازل بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-al-jahadhimah",
        name: "الجهاضمة (اليهاضمة)",
        subTitle: "أهل القلاع والحصون",
        sheikhOrLeader: "أعيان الجهاضمة",
        villages: ["قرى الجهاضمة", "الحصون الحجرية", "المرتفعات"],
        description: "أهل شجاعة وحصون منيعة ومزارع عريقة في سراة بلحارث.",
        approximateFamilies: 390,
        rootAncestor: "جيهض بن الحارث",
        familyTree: { id: "root-jahadhimah", name: "الجد جيهض بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-banu-jar",
        name: "بنو جار",
        subTitle: "السراة والبادية",
        sheikhOrLeader: "أعيان بني جار",
        villages: ["قرى بني جار", "المزارع والمراعي"],
        description: "بطن أصيل من بلحارث أهل كرم ونخوة وجوار حسن.",
        approximateFamilies: 350,
        rootAncestor: "جار بن الحارث",
        familyTree: { id: "root-banujar", name: "الجد جار بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-jubaihah",
        name: "جبيهة (ييبهة)",
        subTitle: "السراة والبادية",
        sheikhOrLeader: "أعيان جبيهة",
        villages: ["قرى جبيهة", "السراة والبادية"],
        description: "فرع أصيل من فروع بلحارث في السراة والبادية.",
        approximateFamilies: 310,
        rootAncestor: "جبيهة بن الحارث",
        familyTree: { id: "root-jubaihah", name: "الجد جبيهة بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-al-awsaa",
        name: "العوصاء",
        subTitle: "السراة",
        sheikhOrLeader: "أعيان العوصاء",
        villages: ["قرى العوصاء", "الحصون والمدرجات"],
        description: "أهل قرى وحصون ومدرجات زراعية في سراة بلحارث.",
        approximateFamilies: 340,
        rootAncestor: "عويص بن الحارث",
        familyTree: { id: "root-awsaa", name: "الجد عويص بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-al-saadi",
        name: "آل الصعدي",
        subTitle: "سراة بلحارث",
        sheikhOrLeader: "أعيان آل الصعدي",
        villages: ["قرى الصعدي", "المدرجات الزراعية"],
        description: "أهل نخوة ومواقف مشهودة ومزارع حنطة أصيلة.",
        approximateFamilies: 300,
        rootAncestor: "صعد بن الحارث",
        familyTree: { id: "root-saadi", name: "الجد صعد بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-al-omarah",
        name: "العُمَرة",
        subTitle: "السراة والبادية",
        sheikhOrLeader: "أعيان العُمَرة",
        villages: ["قرى العُمَرة بالسراة", "مراعي البادية"],
        description: "بطن من بطون بلحارث أهل إقدام ومواشي ومزارع.",
        approximateFamilies: 320,
        rootAncestor: "عمر بن الحارث",
        familyTree: { id: "root-omarah", name: "الجد عمر بن الحارث", generation: 1, isPatriarch: true }
      },
      {
        id: "balharith-al-shaafeen",
        name: "الشعفين",
        subTitle: "مطلات الشعاف",
        sheikhOrLeader: "أعيان الشعفين",
        villages: ["شعاف بلحارث", "المطلات الشاهقة"],
        description: "أهل شعاف ومطلات جبلية شامخة تشرف على أودية تهامة والسراة.",
        approximateFamilies: 290,
        rootAncestor: "شعف بن الحارث",
        familyTree: { id: "root-shaafeen", name: "الجد شعف بن الحارث", generation: 1, isPatriarch: true }
      }
    ]
  },

  // =========================================================================
  // 4. العوامر
  // =========================================================================
  {
    id: "al-awamir",
    name: "العوامر",
    division: "السراة وتهامة",
    divisionNumber: 4,
    region: "السراة وتهامة",
    center: "تنومة ووادي مليح وجنوب النماص والمشرفة",
    ancestorName: "عامر بن الحجر بن الهنو بن الأزد",
    villagesCount: 48,
    description: "ينتسبون إلى عامر بن الحجر، وينقسمون إلى فرعين رئيسيين (بنو عبد، وبنو سعد) يتفرع منهما 6 بطون كبرى تمتد بين السراة وتهامة.",
    highlights: ["شلالات ومدرجات تنومة", "وادي مليح الخصيب", "حصون وقلاع المشرفة", "شريان بنو عبد وبنو سعد"],
    joinedUsersCount: 610,
    supervisorName: "مشرف العوامر",
    supervisorCode: "1104",
    afkhadh: [
      {
        id: "awamir-belhasin",
        name: "بلحصين",
        subTitle: "بنو عبد (السراة وتهامة)",
        sheikhOrLeader: "أعيان بلحصين",
        villages: ["جنوب النماص", "تنومة", "المدرجات الزراعية"],
        description: "من فرع بنو عبد، يمتدون بين السراة وتهامة، أهل كرم ومزارع تاريخية.",
        approximateFamilies: 420,
        rootAncestor: "حصين بن عبد بن عامر بن الحجر",
        familyTree: {
          id: "root-belhasin",
          name: "الجد حصين بن عبد",
          title: "الجد الجامع لبلحصين",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "has-1", name: "ظافر بن حصين", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "awamir-al-bohaish",
        name: "آل بهيش",
        subTitle: "بنو عبد (أهل وادي مليح)",
        sheikhOrLeader: "مشايخ وأعيان آل بهيش",
        villages: ["تنومة", "وادي مليح الخصيب", "شلال الدهناء", "الحصون التاريخية"],
        description: "من فرع بنو عبد، أهل وادي مليح وتنومة والشلالات والمدرجات المنيعة.",
        approximateFamilies: 490,
        rootAncestor: "بهيش بن عبد بن عامر بن الحجر",
        familyTree: {
          id: "root-bohaish",
          name: "الجد بهيش بن عبد",
          title: "الجد الجامع لآل بهيش",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "boh-1", name: "عبدالرحمن بن بهيش", generation: 2, children: [] },
            { id: "boh-2", name: "فايز بن بهيش", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "awamir-al-nahy",
        name: "آل النهي",
        subTitle: "بنو عبد (السراة وتهامة)",
        sheikhOrLeader: "أعيان آل النهي",
        villages: ["قرى النهي بالسراة", "أودية السفوح"],
        description: "من فرع بنو عبد في السراة وتهامة، أهل شجاعة وحصون أثرية.",
        approximateFamilies: 320,
        rootAncestor: "نهي بن عبد بن عامر بن الحجر",
        familyTree: { id: "root-nahy", name: "الجد نهي بن عبد", generation: 1, isPatriarch: true }
      },
      {
        id: "awamir-banu-lam",
        name: "بنو لام",
        subTitle: "بنو عبد (السراة وتهامة)",
        sheikhOrLeader: "أعيان بني لام",
        villages: ["قرى بني لام", "السراة وتهامة"],
        description: "من فرع بنو عبد في السراة وتهامة، أهل مزارع ومدرجات حجرية.",
        approximateFamilies: 280,
        rootAncestor: "لام بن عبد بن عامر بن الحجر",
        familyTree: { id: "root-banulam", name: "الجد لام بن عبد", generation: 1, isPatriarch: true }
      },
      {
        id: "awamir-kinanah",
        name: "كنانة",
        subTitle: "بنو سعد (السراة وتهامة)",
        sheikhOrLeader: "أعيان كنانة",
        villages: ["قرى كنانة بتنومة", "المدرجات الزراعية", "سفوح تهامة"],
        description: "من فرع بنو سعد في السراة وتهامة، أهل شجاعة وحكمة وتاريخ عريق.",
        approximateFamilies: 440,
        rootAncestor: "كنانة بن سعد بن عامر بن الحجر",
        familyTree: {
          id: "root-kinanah",
          name: "الجد كنانة بن سعد",
          title: "الجد الجامع لكنانة",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "kin-1", name: "سعد بن كنانة", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "awamir-banu-mashhoor",
        name: "بنو مشهور",
        subTitle: "بنو سعد (النماص والمشرفة)",
        sheikhOrLeader: "أعيان بني مشهور",
        villages: ["النماص", "المشرفة", "الحصون الحجرية", "مدرجات السراة"],
        description: "من فرع بنو سعد، أهل تاريخ عريق وحصون وبساتين ومزارع حنطة شهيرة.",
        approximateFamilies: 460,
        rootAncestor: "مشهور بن سعد بن عامر بن الحجر",
        familyTree: {
          id: "root-mashhoor",
          name: "الجد مشهور بن سعد",
          title: "الجد الجامع لبني مشهور",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "msh-1", name: "حسن بن مشهور", generation: 2, children: [] }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 5. شهر الشام
  // =========================================================================
  {
    id: "shahr-alsham",
    name: "شهر الشام",
    division: "شمال السراة",
    divisionNumber: 5,
    region: "السراة",
    center: "مركز السرح وشمال النماص وقصر المقر الحضاري",
    ancestorName: "أولاد ربيعة بن الحجر (شمال السراة)",
    villagesCount: 36,
    description: "قبائل شمال السراة (شهر الشام)، بوابة السراة الشمالية وموطن السرح والمدرجات الزراعية الخصيبة وقصر المقر التراثي الحضاري.",
    highlights: ["بوابة السراة الشمالية", "مزارع البُر الشهري بالسرح", "قصر المقر الحضاري", "شعاف وقرى شمال النماص"],
    joinedUsersCount: 470,
    supervisorName: "مشرف شهر الشام",
    supervisorCode: "1105",
    afkhadh: [
      {
        id: "alsham-banu-thabit",
        name: "بنو ثابت",
        subTitle: "بوابة السراة الشمالية",
        sheikhOrLeader: "أعيان بني ثابت",
        villages: ["مركز السرح", "الدارة", "السرح الشمالي", "قرى المزارع"],
        description: "بوابة السراة الشمالية في مركز السرح وسهوله الزراعية ومزارع القمح والرمان.",
        approximateFamilies: 450,
        rootAncestor: "ثابت بن ربيعة",
        familyTree: {
          id: "root-banuthabit",
          name: "الجد ثابت بن ربيعة",
          title: "الجد الجامع لبني ثابت",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "thb-1", name: "محمد بن ثابت", generation: 2, children: [] },
            { id: "thb-2", name: "علي بن ثابت", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "alsham-banu-yous",
        name: "بنو يوس",
        subTitle: "شعف آل وليد وقصر المقر",
        sheikhOrLeader: "أعيان بني يوس",
        villages: ["شعف آل وليد", "النماص الشمالية", "محيط قصر المقر", "الخرماء"],
        description: "قبيلة عريقة تضم قصر المقر الحضاري والشعاف الشمالية ومزارع السراة.",
        approximateFamilies: 480,
        rootAncestor: "يوس بن ربيعة",
        familyTree: {
          id: "root-banuyous",
          name: "الجد يوس بن ربيعة",
          title: "الجد الجامع لبني يوس",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "yos-1", name: "أحمد بن يوس", generation: 2, children: [] }
          ]
        }
      },
      {
        id: "alsham-al-hashem",
        name: "آل هاشم",
        subTitle: "أهل السرح والكرم",
        sheikhOrLeader: "أعيان آل هاشم",
        villages: ["قرى آل هاشم بالسرح", "المدرجات الزراعية"],
        description: "أهل كرم وحكمة ومزارع البُر الشهري الأصيل في مركز السرح وسهوله.",
        approximateFamilies: 360,
        rootAncestor: "هاشم بن ربيعة",
        familyTree: {
          id: "root-hashem",
          name: "الجد هاشم بن ربيعة",
          title: "الجد الجامع لآل هاشم",
          generation: 1,
          isPatriarch: true,
          children: [
            { id: "hsh-1", name: "ظافر بن هاشم", generation: 2, children: [] }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // 6. أثرب
  // =========================================================================
  {
    id: "athrib",
    name: "أثرب",
    division: "تهامة وجبل أثرب",
    divisionNumber: 6,
    region: "تهامة",
    center: "جبل أثرب الشامخ وأوديته التهامية الخصيبة",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 38,
    description: "قبائل جبل أثرب وتهامة، أهل المنحدرات الشاهقة ومزارع البن والموز وعسل السدر ومدرجات الجبال الخضراء.",
    highlights: ["جبل أثرب الشاهق التراثي", "مناحل عسل السدر والسمر", "مزارع البن والموز", "مدرجات تهامة الخضراء"],
    joinedUsersCount: 390,
    supervisorName: "مشرف أثرب",
    supervisorCode: "1106",
    afkhadh: [
      {
        id: "athrib-al-yahmad",
        name: "آل يحمد",
        subTitle: "جبل أثرب",
        sheikhOrLeader: "أعيان آل يحمد",
        villages: ["قرى سفوح جبل أثرب", "وادي أثرب"],
        description: "من بطون أثرب الشامخة في تهامة، أهل زراعة ومناحل عسل سدر.",
        approximateFamilies: 280,
        rootAncestor: "يحمد بن أثرب",
        familyTree: { id: "root-yahmad", name: "الجد يحمد بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-yalaa",
        name: "آل يعلاء",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل يعلاء",
        villages: ["قرى آل يعلاء", "الأودية الخصيبة"],
        description: "بطن أصيل من بطون أثرب التهامية.",
        approximateFamilies: 260,
        rootAncestor: "يعلى بن أثرب",
        familyTree: { id: "root-yalaa", name: "الجد يعلى بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-waheesh",
        name: "آل وحيش",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل وحيش",
        villages: ["منحدرات جبل أثرب", "الحصون"],
        description: "أهل شجاعة وحصون في جبل أثرب وتهامة.",
        approximateFamilies: 240,
        rootAncestor: "وحيش بن أثرب",
        familyTree: { id: "root-waheesh", name: "الجد وحيش بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-asim",
        name: "آل عاصم",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل عاصم",
        villages: ["قرى آل عاصم بأثرب"],
        description: "بطن عريق من بطون أثرب أهل كرم وشجاعة.",
        approximateFamilies: 250,
        rootAncestor: "عاصم بن أثرب",
        familyTree: { id: "root-asim", name: "الجد عاصم بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-mahjoobah",
        name: "آل محجوبة",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل محجوبة",
        villages: ["قرى محجوبة", "أودية النخيل"],
        description: "من فروع أثرب التهامية أهل زراعة ونخيل.",
        approximateFamilies: 230,
        rootAncestor: "محجوب بن أثرب",
        familyTree: { id: "root-mahjoobah", name: "الجد محجوب بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-shunayf",
        name: "آل الشنيف",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل الشنيف",
        villages: ["بساتين أثرب", "الأودية"],
        description: "أهل مزارع ونخيل ومناحل عسل في أودية أثرب.",
        approximateFamilies: 220,
        rootAncestor: "شنيف بن أثرب",
        familyTree: { id: "root-shunayf", name: "الجد شنيف بن أثرب", generation: 1, isPatriarch: true }
      },
      {
        id: "athrib-al-yamani",
        name: "آل يماني",
        subTitle: "تهامة",
        sheikhOrLeader: "أعيان آل يماني",
        villages: ["قرى آل يماني", "سفوح أثرب"],
        description: "فرع أصيل من أثرب في تهامة بني شهر.",
        approximateFamilies: 210,
        rootAncestor: "يماني بن أثرب",
        familyTree: { id: "root-yamani", name: "الجد يماني بن أثرب", generation: 1, isPatriarch: true }
      }
    ]
  },

  // =========================================================================
  // 7. الشهارية (إم شهارية)
  // =========================================================================
  {
    id: "al-shahariyah",
    name: "الشهارية (إم شهارية)",
    division: "تهامة وأودية المجاردة",
    divisionNumber: 7,
    region: "تهامة",
    center: "أودية وسهول تهامة بني شهر",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 46,
    description: "الشهارية (إم شهارية) وتضم 12 بطناً تنتشر في سهول وأودية تهامة بني شهر الخصيبة المشهورة بالزراعة والتكاتف الاجتماعي.",
    highlights: ["سهول تهامة الخصيبة", "مزارع الحبوب والسمسم", "عادات وتراث إم شهارية الأصيل", "12 بطناً متلاحماً"],
    joinedUsersCount: 430,
    supervisorName: "مشرف الشهارية",
    supervisorCode: "1107",
    afkhadh: [
      { id: "shahariyah-naas", name: "آل نعص", subTitle: "تهامة", sheikhOrLeader: "أعيان آل نعص", villages: ["قرى آل نعص"], description: "بطن أصيل من الشهارية في تهامة.", approximateFamilies: 240, rootAncestor: "نعص بن شهر", familyTree: { id: "root-naas", name: "الجد نعص", generation: 1, isPatriarch: true } },
      { id: "shahariyah-mandhar", name: "آل المنظر", subTitle: "تهامة", sheikhOrLeader: "أعيان آل المنظر", villages: ["قرى المنظر"], description: "من بطون الشهارية في تهامة.", approximateFamilies: 220, rootAncestor: "منظر بن شهر", familyTree: { id: "root-mandhar", name: "الجد منظر", generation: 1, isPatriarch: true } },
      { id: "shahariyah-yaryooa", name: "آل يريوع", subTitle: "تهامة", sheikhOrLeader: "أعيان آل يريوع", villages: ["قرى يريوع"], description: "بطن من بطون الشهارية التهامية.", approximateFamilies: 210, rootAncestor: "يريوع بن شهر", familyTree: { id: "root-yaryooa", name: "الجد يريوع", generation: 1, isPatriarch: true } },
      { id: "shahariyah-shaniyah", name: "آل شنية", subTitle: "تهامة", sheikhOrLeader: "أعيان آل شنية", villages: ["قرى شنية"], description: "فرع من فروع الشهارية.", approximateFamilies: 200, rootAncestor: "شنية بن شهر", familyTree: { id: "root-shaniyah", name: "الجد شنية", generation: 1, isPatriarch: true } },
      { id: "shahariyah-zarai", name: "آل الزرعي", subTitle: "تهامة", sheikhOrLeader: "أعيان آل الزرعي", villages: ["قرى الزرعي"], description: "أهل مزارع وبساتين في تهامة.", approximateFamilies: 230, rootAncestor: "زرعي بن شهر", familyTree: { id: "root-zarai", name: "الجد زرعي", generation: 1, isPatriarch: true } },
      { id: "shahariyah-hassan", name: "آل حسن", subTitle: "تهامة", sheikhOrLeader: "أعيان آل حسن", villages: ["قرى آل حسن"], description: "بطن من بطون الشهارية.", approximateFamilies: 250, rootAncestor: "حسن بن شهر", familyTree: { id: "root-sh-hassan", name: "الجد حسن", generation: 1, isPatriarch: true } },
      { id: "shahariyah-shabeen", name: "آل الشعبين", subTitle: "تهامة", sheikhOrLeader: "أعيان آل الشعبين", villages: ["الشعبين"], description: "أهل أودية ومزارع بتهامة بني شهر.", approximateFamilies: 220, rootAncestor: "شعبين بن شهر", familyTree: { id: "root-shabeen", name: "الجد شعبين", generation: 1, isPatriarch: true } },
      { id: "shahariyah-maarbah", name: "المعربة", subTitle: "تهامة", sheikhOrLeader: "أعيان المعربة", villages: ["قرى المعربة"], description: "بطن أصيل من الشهارية.", approximateFamilies: 210, rootAncestor: "معرب بن شهر", familyTree: { id: "root-maarbah", name: "الجد معرب", generation: 1, isPatriarch: true } },
      { id: "shahariyah-hudailah", name: "آل حديلة", subTitle: "تهامة", sheikhOrLeader: "أعيان آل حديلة", villages: ["قرى حديلة"], description: "فرع من فروع الشهارية بتهامة.", approximateFamilies: 190, rootAncestor: "حديلة بن شهر", familyTree: { id: "root-hudailah", name: "الجد حديلة", generation: 1, isPatriarch: true } },
      { id: "shahariyah-helwah", name: "آل حلوة", subTitle: "تهامة", sheikhOrLeader: "أعيان آل حلوة", villages: ["قرى حلوة"], description: "أهل نخوة وكرم في تهامة.", approximateFamilies: 200, rootAncestor: "حلوة بن شهر", familyTree: { id: "root-helwah", name: "الجد حلوة", generation: 1, isPatriarch: true } },
      { id: "shahariyah-jameel", name: "آل جميل", subTitle: "تهامة", sheikhOrLeader: "أعيان آل جميل", villages: ["قرى جميل"], description: "بطن من بطون الشهارية.", approximateFamilies: 220, rootAncestor: "جميل بن شهر", familyTree: { id: "root-jameel", name: "الجد جميل", generation: 1, isPatriarch: true } },
      { id: "shahariyah-mashhakah", name: "آل المشحكة", subTitle: "تهامة", sheikhOrLeader: "أعيان المشحكة", villages: ["قرى المشحكة"], description: "بطن عريق في تهامة بني شهر.", approximateFamilies: 210, rootAncestor: "مشحك بن شهر", familyTree: { id: "root-mashhakah", name: "الجد مشحك", generation: 1, isPatriarch: true } }
    ]
  },

  // =========================================================================
  // 8. ثربان
  // =========================================================================
  {
    id: "tharban",
    name: "ثربان",
    division: "تهامة وجبل ثربان",
    divisionNumber: 8,
    region: "تهامة",
    center: "مركز الطلاليع وسفح جبل ثربان الأشم والأودية التهامية",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 52,
    description: "قبائل جبل ثربان الأشم في تهامة، وتضم 10 بطون يشتهرون بمناحل عسل السدر والسمر ومزارع الحبوب وشجاعة أهلها.",
    highlights: ["قمة جبل ثربان الأشم", "مركز الطلاليع التاريخي", "أودية ثربان الغناء", "أجود أنواع العسل التهامي"],
    joinedUsersCount: 510,
    supervisorName: "مشرف ثربان",
    supervisorCode: "1108",
    afkhadh: [
      {
        id: "tharban-talaleea",
        name: "الطلاليع",
        subTitle: "مركز الطلاليع",
        sheikhOrLeader: "مشايخ وأعيان الطلاليع",
        villages: ["مركز الطلاليع", "سفح جبل ثربان", "سوق الطلاليع", "الأودية"],
        description: "مركز الطلاليع وسفح جبل ثربان، أهل كرم وحاضرة تجارية وزراعية في ثربان.",
        approximateFamilies: 480,
        rootAncestor: "طليع بن ثربان",
        familyTree: { id: "root-talaleea", name: "الجد طليع بن ثربان", generation: 1, isPatriarch: true }
      },
      { id: "tharban-mujamid", name: "آل مجامد", subTitle: "تهامة", sheikhOrLeader: "أعيان آل مجامد", villages: ["قرى مجامد"], description: "من كبار بطون ثربان في تهامة.", approximateFamilies: 270, rootAncestor: "مجامد بن ثربان", familyTree: { id: "root-mujamid", name: "الجد مجامد", generation: 1, isPatriarch: true } },
      { id: "tharban-qahmah", name: "القحمة", subTitle: "تهامة", sheikhOrLeader: "أعيان القحمة", villages: ["قرى القحمة"], description: "بطن أصيل من ثربان.", approximateFamilies: 250, rootAncestor: "قاحم بن ثربان", familyTree: { id: "root-qahmah", name: "الجد قاحم", generation: 1, isPatriarch: true } },
      { id: "tharban-awajirah", name: "العواجرة", subTitle: "تهامة", sheikhOrLeader: "أعيان العواجرة", villages: ["قرى العواجرة"], description: "أهل شجاعة ومزارع في ثربان.", approximateFamilies: 260, rootAncestor: "عوجار بن ثربان", familyTree: { id: "root-awajirah", name: "الجد عوجار", generation: 1, isPatriarch: true } },
      { id: "tharban-zookah", name: "الزوكة", subTitle: "تهامة", sheikhOrLeader: "أعيان الزوكة", villages: ["قرى الزوكة"], description: "بطن من بطون ثربان.", approximateFamilies: 240, rootAncestor: "زايك بن ثربان", familyTree: { id: "root-zookah", name: "الجد زايك", generation: 1, isPatriarch: true } },
      { id: "tharban-hazmah", name: "آل حزمة", subTitle: "تهامة", sheikhOrLeader: "أعيان آل حزمة", villages: ["قرى حزمة"], description: "أهل كرم ونخوة في ثربان.", approximateFamilies: 230, rootAncestor: "حازم بن ثربان", familyTree: { id: "root-hazmah", name: "الجد حازم", generation: 1, isPatriarch: true } },
      { id: "tharban-ghailan", name: "آل غيلان", subTitle: "تهامة", sheikhOrLeader: "أعيان آل غيلان", villages: ["قرى غيلان"], description: "أهل أودية ومناحل عسل في ثربان.", approximateFamilies: 220, rootAncestor: "غيلان بن ثربان", familyTree: { id: "root-ghailan", name: "الجد غيلان", generation: 1, isPatriarch: true } },
      { id: "tharban-salman", name: "آل سلمان", subTitle: "تهامة", sheikhOrLeader: "أعيان آل سلمان", villages: ["قرى سلمان"], description: "بطن أصيل من ثربان.", approximateFamilies: 240, rootAncestor: "سلمان بن ثربان", familyTree: { id: "root-th-salman", name: "الجد سلمان", generation: 1, isPatriarch: true } },
      { id: "tharban-rashed", name: "آل راشد", subTitle: "تهامة", sheikhOrLeader: "أعيان آل راشد", villages: ["قرى راشد"], description: "فرع من فروع ثربان.", approximateFamilies: 230, rootAncestor: "راشد بن ثربان", familyTree: { id: "root-th-rashed", name: "الجد راشد", generation: 1, isPatriarch: true } },
      { id: "tharban-lalaa", name: "آل لعلاء", subTitle: "تهامة", sheikhOrLeader: "أعيان آل لعلاء", villages: ["قرى لعلاء"], description: "بطن من بطون ثربان في تهامة.", approximateFamilies: 210, rootAncestor: "لعلى بن ثربان", familyTree: { id: "root-lalaa", name: "الجد لعلى", generation: 1, isPatriarch: true } }
    ]
  },

  // =========================================================================
  // 9. آل العلاء (آل لعلا)
  // =========================================================================
  {
    id: "al-ala",
    name: "آل العلاء (آل لعلا)",
    division: "تهامة وأودية المجاردة",
    divisionNumber: 9,
    region: "تهامة",
    center: "أودية المجاردة وسهول تهامة بني شهر",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 44,
    description: "قبائل آل العلاء في تهامة، وتضم 10 بطون عريقة تستقر في أودية المجاردة وتهامة بني شهر، ويمتاز أهلها بالكرم والتكاتف.",
    highlights: ["أودية تهامة الممتدة", "قلاع وحصون آل لعلا", "بساتين النخيل والزراعة التهامية", "التلاحم القبلي العريق"],
    joinedUsersCount: 450,
    supervisorName: "مشرف آل العلاء",
    supervisorCode: "1109",
    afkhadh: [
      { id: "ala-eyaf", name: "آل عياف", subTitle: "تهامة", sheikhOrLeader: "أعيان آل عياف", villages: ["قرى آل عياف"], description: "من كبار بطون آل العلاء.", approximateFamilies: 260, rootAncestor: "عياف بن العلاء", familyTree: { id: "root-eyaf", name: "الجد عياف", generation: 1, isPatriarch: true } },
      { id: "ala-mousa", name: "آل موسى", subTitle: "فرع آل العلاء في تهامة", sheikhOrLeader: "أعيان آل موسى (آل العلاء)", villages: ["قرى آل موسى"], description: "بطن أصيل من آل العلاء (معرّف مستقل عن آل موسى الجيحني).", approximateFamilies: 250, rootAncestor: "موسى بن العلاء", familyTree: { id: "root-ala-mousa", name: "الجد موسى بن العلاء", generation: 1, isPatriarch: true } },
      { id: "ala-sobaan", name: "آل صعبان", subTitle: "تهامة", sheikhOrLeader: "أعيان آل صعبان", villages: ["قرى صعبان"], description: "أهل شجاعة وحصون في تهامة.", approximateFamilies: 240, rootAncestor: "صعبان بن العلاء", familyTree: { id: "root-sobaan", name: "الجد صعبان", generation: 1, isPatriarch: true } },
      { id: "ala-amer", name: "آل عامر", subTitle: "تهامة", sheikhOrLeader: "أعيان آل عامر", villages: ["قرى عامر"], description: "فرع أصيل من آل العلاء.", approximateFamilies: 230, rootAncestor: "عامر بن العلاء", familyTree: { id: "root-ala-amer", name: "الجد عامر بن العلاء", generation: 1, isPatriarch: true } },
      { id: "ala-musabbah", name: "آل مصبح", subTitle: "تهامة", sheikhOrLeader: "أعيان آل مصبح", villages: ["قرى مصبح"], description: "بطن من بطون آل العلاء.", approximateFamilies: 220, rootAncestor: "مصبح بن العلاء", familyTree: { id: "root-musabbah", name: "الجد مصبح", generation: 1, isPatriarch: true } },
      { id: "ala-amer-moafa", name: "آل عامر بن معافا", subTitle: "تهامة", sheikhOrLeader: "أعيان آل عامر بن معافا", villages: ["قرى عامر بن معافا"], description: "أهل كرم وحكمة في تهامة.", approximateFamilies: 210, rootAncestor: "معافا بن العلاء", familyTree: { id: "root-amer-moafa", name: "الجد معافا", generation: 1, isPatriarch: true } },
      { id: "ala-khudair", name: "آل خضير", subTitle: "تهامة", sheikhOrLeader: "أعيان آل خضير", villages: ["قرى خضير"], description: "بطن من بطون آل العلاء.", approximateFamilies: 200, rootAncestor: "خضير بن العلاء", familyTree: { id: "root-khudair", name: "الجد خضير", generation: 1, isPatriarch: true } },
      { id: "ala-saad", name: "آل سعد", subTitle: "تهامة", sheikhOrLeader: "أعيان آل سعد", villages: ["قرى سعد"], description: "أهل مزارع ونخيل بتهامة.", approximateFamilies: 220, rootAncestor: "سعد بن العلاء", familyTree: { id: "root-ala-saad", name: "الجد سعد بن العلاء", generation: 1, isPatriarch: true } },
      { id: "ala-muqashish", name: "آل مقشش", subTitle: "تهامة", sheikhOrLeader: "أعيان آل مقشش", villages: ["قرى مقشش"], description: "بطن من بطون آل العلاء.", approximateFamilies: 190, rootAncestor: "مقشش بن العلاء", familyTree: { id: "root-muqashish", name: "الجد مقشش", generation: 1, isPatriarch: true } },
      { id: "ala-rashed-theeban", name: "آل راشد وآل ذيبان", subTitle: "تهامة", sheikhOrLeader: "أعيان آل راشد وذيبان", villages: ["قرى راشد وذيبان"], description: "فرع متآلف من آل العلاء في تهامة.", approximateFamilies: 230, rootAncestor: "راشد وذيبان", familyTree: { id: "root-rashed-theeban", name: "الجدان راشد وذيبان", generation: 1, isPatriarch: true } }
    ]
  },

  // =========================================================================
  // 10. آل الجيحني (آل إم جحيني)
  // =========================================================================
  {
    id: "al-jeehni",
    name: "آل الجيحني (آل إم جحيني)",
    division: "تهامة وأودية المجاردة",
    divisionNumber: 10,
    region: "تهامة",
    center: "تهامة بني شهر ومحيط المجاردة والأودية",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 26,
    description: "3 بطون كبيرة في تهامة تمتاز بالتلاحم والكرم وحماية الأودية التهامية.",
    highlights: ["أهل الكرم والنخوة", "أودية تهامة وحصونها", "3 بطون كبيرة متآزرة", "حماية الطرق والأودية التهامية"],
    joinedUsersCount: 340,
    supervisorName: "مشرف آل الجيحني",
    supervisorCode: "1110",
    afkhadh: [
      { id: "jeehni-qabeeb", name: "آل قبيب", subTitle: "تهامة", sheikhOrLeader: "أعيان آل قبيب", villages: ["قرى قبيب"], description: "من بطون آل الجيحني في تهامة.", approximateFamilies: 260, rootAncestor: "قبيب بن جحيش", familyTree: { id: "root-qabeeb", name: "الجد قبيب", generation: 1, isPatriarch: true } },
      { id: "jeehni-mousa", name: "آل موسى", subTitle: "فرع آل الجيحني في تهامة", sheikhOrLeader: "أعيان آل موسى (الجيحني)", villages: ["قرى آل موسى التهامية"], description: "بطن أصيل من آل الجيحني (معرّف مستقل عن آل موسى آل العلاء).", approximateFamilies: 270, rootAncestor: "موسى بن جحيش", familyTree: { id: "root-jeehni-mousa", name: "الجد موسى بن جحيش", generation: 1, isPatriarch: true } },
      { id: "jeehni-anqaa", name: "آل العنقاء", subTitle: "تهامة", sheikhOrLeader: "أعيان آل العنقاء", villages: ["قرى العنقاء"], description: "بطن من بطون آل الجيحني في تهامة.", approximateFamilies: 240, rootAncestor: "عنق بن جحيش", familyTree: { id: "root-anqaa", name: "الجد عنق", generation: 1, isPatriarch: true } }
    ]
  },

  // =========================================================================
  // 11. سفيان
  // =========================================================================
  {
    id: "sufyan",
    name: "سفيان",
    division: "تهامة وأودية المجاردة",
    divisionNumber: 11,
    region: "تهامة",
    center: "أودية وقرى سفيان التهامية بمحيط المجاردة",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 28,
    description: "قبائل سفيان في تهامة، وتتفرع إلى 4 بطون عريقة تشتهر بالشجاعة وحماية الأودية ومزارع الحبوب ومناحل العسل.",
    highlights: ["تاريخ عريق في تهامة", "مزارع الحبوب ومناحل العسل", "حيد وحصون سفيان", "4 بطون أصيلة"],
    joinedUsersCount: 320,
    supervisorName: "مشرف سفيان",
    supervisorCode: "1111",
    afkhadh: [
      { id: "sufyan-osmah", name: "العصمة", subTitle: "تهامة", sheikhOrLeader: "أعيان العصمة", villages: ["قرى العصمة"], description: "من كبار بطون سفيان في تهامة.", approximateFamilies: 250, rootAncestor: "عاصم بن سفيان", familyTree: { id: "root-osmah", name: "الجد عاصم بن سفيان", generation: 1, isPatriarch: true } },
      { id: "sufyan-muhlaff", name: "المحلف", subTitle: "تهامة", sheikhOrLeader: "أعيان المحلف", villages: ["قرى المحلف"], description: "بطن أصيل من سفيان.", approximateFamilies: 240, rootAncestor: "حليف بن سفيان", familyTree: { id: "root-muhlaff", name: "الجد حليف", generation: 1, isPatriarch: true } },
      { id: "sufyan-kharmaa", name: "آل خرماء", subTitle: "تهامة", sheikhOrLeader: "أعيان آل خرماء", villages: ["قرى خرماء"], description: "فرع من فروع سفيان في تهامة.", approximateFamilies: 220, rootAncestor: "خارم بن سفيان", familyTree: { id: "root-kharmaa", name: "الجد خارم", generation: 1, isPatriarch: true } },
      { id: "sufyan-mujayesh", name: "آل مجايش", subTitle: "تهامة", sheikhOrLeader: "أعيان آل مجايش", villages: ["قرى مجايش"], description: "أهل كرم ونخوة في سفيان.", approximateFamilies: 210, rootAncestor: "مجيش بن سفيان", familyTree: { id: "root-mujayesh", name: "الجد مجيش", generation: 1, isPatriarch: true } }
    ]
  },

  // =========================================================================
  // 12. عبس
  // =========================================================================
  {
    id: "abs",
    name: "عبس",
    division: "تهامة وأودية المجاردة",
    divisionNumber: 12,
    region: "تهامة",
    center: "حيد عبس وأودية تهامة الخصيبة",
    ancestorName: "أولاد ربيعة بن الحجر",
    villagesCount: 30,
    description: "قبائل عبس في تهامة بني شهر، وتضم 4 بطون ذات تاريخ وتراث أصيل وتستقر في حيد عبس وأودية تهامة الخصيبة.",
    highlights: ["حيد عبس التاريخي المنيع", "أودية عبس الخصيبة", "تراث الآباء والأجداد", "4 بطون شامخة"],
    joinedUsersCount: 330,
    supervisorName: "مشرف عبس",
    supervisorCode: "1112",
    afkhadh: [
      { id: "abs-obaid", name: "آل عبيد", subTitle: "تهامة", sheikhOrLeader: "أعيان آل عبيد", villages: ["قرى آل عبيد"], description: "من بطون عبس في تهامة.", approximateFamilies: 250, rootAncestor: "عبيد بن عبس", familyTree: { id: "root-obaid", name: "الجد عبيد بن عبس", generation: 1, isPatriarch: true } },
      { id: "abs-haid", name: "حيد عبس", subTitle: "حيد عبس المنيع", sheikhOrLeader: "أعيان حيد عبس", villages: ["حيد عبس", "الحصون المنيعة"], description: "سكان حيد عبس التاريخي المنيع في تهامة.", approximateFamilies: 260, rootAncestor: "حيد بن عبس", familyTree: { id: "root-haid", name: "الجد حيد بن عبس", generation: 1, isPatriarch: true } },
      { id: "abs-ammar", name: "آل عَمَّار", subTitle: "تهامة", sheikhOrLeader: "أعيان آل عَمَّار", villages: ["قرى آل عَمَّار"], description: "بطن أصيل من عبس في تهامة بني شهر.", approximateFamilies: 230, rootAncestor: "عَمَّار بن عبس", familyTree: { id: "root-ammar", name: "الجد عَمَّار بن عبس", generation: 1, isPatriarch: true } },
      { id: "abs-hasanah", name: "الحصنة", subTitle: "تهامة", sheikhOrLeader: "أعيان الحصنة", villages: ["قرى الحصنة"], description: "أهل نخوة ومواقف مشهودة في عبس.", approximateFamilies: 220, rootAncestor: "حصين بن عبس", familyTree: { id: "root-hasanah", name: "الجد حصين بن عبس", generation: 1, isPatriarch: true } }
    ]
  }
];
