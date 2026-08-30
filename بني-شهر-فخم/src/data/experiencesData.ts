import { BaniShahrExperience } from "../types";

export const EXPERIENCES_DATA: BaniShahrExperience[] = [
  {
    id: "exp-areekah",
    title: "تعلم سر صناعة العريكة الشهري بالسمن البلدي وعسل السدر",
    category: "طبخ ومأكولات شعبية",
    hostName: "أم خالد الشهري",
    hostRole: "سيدة الضيافة ومتقنة المأكولات التراثية",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0543219876",
    villageOrCity: "قرية العقيقة التراثية - النماص",
    region: "النماص",
    duration: "ساعتان ونصف",
    pricePerPerson: 120,
    maxGroupSize: 8,
    rating: 4.9,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "تجربة حية تفاعلية داخل بيت طيني وحجري أصيل في قرية العقيقة، تتعلم فيها خطوات عجن دقيق البُر الشهري الفاخر، وطهيه على الصاج، وهرسه الساخن وتقديمه مزيناً بالتمر والرضيفة والسمن البلدي وعسل السدر الطبيعي.",
    included: [
      "جميع المكونات (دقيق بُر السراة، سمن بلدي طازج، عسل سدر أصلي، تمر)",
      "جلسة تذوق وتناول وجبة العريكة مع القهوة السعودية بالهيل والمسمار",
      "مريلة طبخ تذكارية وعلبة عسل صغيرة كهدية لكل زائر",
      "كتيب الوصفات التراثية لأشهر أكلات بني شهر"
    ],
    requirements: [
      "مناسبة للعائلات والأفراد",
      "ارتداء ملابس مريحة للحركة"
    ],
    schedule: "يومياً من 4:30 عصراً حتى 7:00 مساءً",
    locationDetails: "ديوانية أم خالد في قرية العقيقة التراثية بجوار الحصن القديم",
    coordinates: { lat: 19.119, lng: 42.141 },
    isPopular: true
  },
  {
    id: "exp-honey",
    title: "يوم النحال: جني واستخلاص عسل السدر والشوكة في مناحل السراة",
    category: "طبيعة وزراعة وعسل",
    hostName: "العم أبو فهد الشهري",
    hostRole: "نحال متمرس بخبرة 35 عاماً في جبال عسير",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0505112233",
    villageOrCity: "سفوح جبل منعاء - تنومة",
    region: "تنومة",
    duration: "3 ساعات",
    pricePerPerson: 180,
    maxGroupSize: 10,
    rating: 5.0,
    reviewsCount: 56,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80"
    ],
    description: "ارتدِ بدلة النحال الاحترافية وانطلق مع خبير النحل في سفوح وادي تنومة بين أشجار السدر والطلح. ستتعرف على دورة حياة النحلة الجبلية، وكيفية فحص الخلايا، وقص الشمع وجني العسل الطبيعي وتصفيته وتعبئته بيدك.",
    included: [
      "توفير بدلات وقفازات الحماية الكاملة لجميع المشاركين",
      "مرطبان عسل سدر طازج مصفى بيدك (250 جرام) تأخذه معك",
      "تذوق أنواع مختلفة من العسل (سدر، سمرة، مجرى، شوكة، قتاد)",
      "شاي الجمر بالنعناع الجبلي وخبز المقنى الساخن"
    ],
    requirements: [
      "لا ينصح به لمن يعانون من حساسية شديدة ومثبتة فلسعات النحل",
      "حذاء مشي مريح للمشي في المزرعة والمنحل"
    ],
    schedule: "صباحاً: 7:00 ص - 10:00 ص | عصراً: 3:30 م - 6:30 م",
    locationDetails: "مناحل جبال منعاء ووادي ترج بتنومة",
    coordinates: { lat: 18.942, lng: 42.155 },
    isPopular: true
  },
  {
    id: "exp-ghee",
    title: "صناعة السمن البلدي وخض الشكوة وإعداد الرضيفة الشهري",
    category: "طبخ ومأكولات شعبية",
    hostName: "أم عبد الله الشهري",
    hostRole: "خبيرة الألبان والسمن البلدي والأكلات الشعبية",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0554123890",
    villageOrCity: "قرية المدانة التاريخية - النماص",
    region: "النماص",
    duration: "ساعتان",
    pricePerPerson: 95,
    maxGroupSize: 6,
    rating: 4.8,
    reviewsCount: 31,
    imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "تجربة تقليدية ممتعة لخض الحليب الطازج بالشكوة الجلدية القديمة لاستخراج الزبدة، ثم صهرها على نار الحطب مع دقيق البُر والأعشاب العطرية لصناعة السمن الذهبي واستخلاص الرضيفة الشهية.",
    included: [
      "المشاركة العملية في خض اللبن وصهر السمن",
      "تذوق اللبن المخضوض الطازج مع الرضيفة وخبز الميفى",
      "عبوة سمن بلدي فاخر مختومة لكل مشارك"
    ],
    requirements: [
      "مناسبة لكافة الأعمار",
      "جلسة أرضية مريحة في السقيفة التراثية"
    ],
    schedule: "كل سبت وثلاثاء وخميس (4:00 عصراً)",
    locationDetails: "سقيفة قرية المدانة القديمة بجانب قصبة المرو",
    coordinates: { lat: 19.135, lng: 42.125 }
  },
  {
    id: "exp-qatt-craft",
    title: "ورشة فن القط العسيري والحرف اليدوية النسائية بالألوان الطبيعية",
    category: "حرف وصناعات تقليدية",
    hostName: "الأستاذة سارة الشهري",
    hostRole: "فنانة تشكيلية وحرفية معتمدة للتراث السعودي",
    hostAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0567890123",
    villageOrCity: "النماص - مركز الحي التراثي",
    region: "النماص",
    duration: "ساعتان ونصف",
    pricePerPerson: 140,
    maxGroupSize: 12,
    rating: 4.9,
    reviewsCount: 38,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
    ],
    description: "اكتشف أسرار الزخارف الهندسية الجنوبية المدرجة في قائمة التراث العالمي (اليونسكو). ستتعلم دلالات النقوش (البترة، الحظية، البلسنة) وتستخدم الألوان الطبيعية المستخلصة من صخور ونباتات السراة لرسم لوحتك الخاصة على لوح خشبي تذكاري.",
    included: [
      "لوح خشبي تذكاري فاخر وألوان وفرش رسم احترافية",
      "شرح وافٍ لتاريخ ومعاني النقوش الجدارية لقبائل السراة",
      "شهادة حضور ورشة فنية تذكارية",
      "ضيافة شاي كرك وقهوة جنوبية"
    ],
    requirements: [
      "مناسب لجميع المستويات ولا يتطلب خبرة مسبقة في الرسم",
      "متاح للسيدات والفتيات والعائلات"
    ],
    schedule: "عصراً من 4:00 م حتى 6:30 م",
    locationDetails: "أستوديو القط التراثي بمدينة النماص",
    coordinates: { lat: 19.120, lng: 42.130 },
    isPopular: true
  },
  {
    id: "exp-astrophotography",
    title: "ورشة تصوير النجوم وبحر الغيوم على قمة جبل ناصر الشاهق",
    category: "تراث وتصوير",
    hostName: "المصور ماجد الشهري",
    hostRole: "مصور فلكي وطبيعة فائز بجوائز محلية",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0533445566",
    villageOrCity: "منتزه جبل ناصر - النماص",
    region: "النماص",
    duration: "4 ساعات",
    pricePerPerson: 220,
    maxGroupSize: 8,
    rating: 5.0,
    reviewsCount: 29,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "ورشة تصوير ليلية واحترافية على ارتفاع يتجاوز 2,600 م فوق سطح البحر. ستتعلم ضبط التعريض الطويل، وتصوير درب التبانة، وتوثيق حركة الغيوم فوق القرى والحصون القديمة بكاميرتك أو بهاتفك الذكي.",
    included: [
      "شرح عملي لإعدادات الكاميرا والهواتف لتصوير النجوم والفلك",
      "جلسة سمر مع موقد نار وقهوة وشاي على قمة الجبل",
      "توفير حوامل ثلاثية (Tripods) لمن يحتاجها",
      "معالجة صور مباشرة عبر تطبيقات الهواتف"
    ],
    requirements: [
      "إحضار سترة دافئة (الأجواء باردة ليلاً في القمة)",
      "كاميرا احترافية أو هاتف ذكي يدعم التصوير الليلي Pro"
    ],
    schedule: "يومياً من 7:00 مساءً حتى 11:00 ليلاً",
    locationDetails: "مطل جبل ناصر المرتفع بالنماص",
    coordinates: { lat: 19.140, lng: 42.115 }
  },
  {
    id: "exp-botany-arar",
    title: "جولة الغابات العطرية واستخلاص زيوت العرعر والضرم والريحان",
    category: "طبيعة وزراعة وعسل",
    hostName: "المرشد حسن الشهري",
    hostRole: "مرشد نباتي وبيئي مرخص",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0556677881",
    villageOrCity: "غابات الشرف ومنتزه المحفار - تنومة",
    region: "تنومة",
    duration: "3 ساعات",
    pricePerPerson: 110,
    maxGroupSize: 15,
    rating: 4.9,
    reviewsCount: 34,
    imageUrl: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "مسار استكشافي بين أشجار العرعر المعمرة ونباتات السراة العطرية كالضرم (اللافندر البري) والشث والريحان الجبلي. ستتعرف على الاستخدامات الطبية والشعبية التاريخية وتشارك في جهاز التقطير البخاري البسيط لاستخراج زيت عطري خالص.",
    included: [
      "جولة ميدانية بإشراف خبير نباتي متمكن",
      "زجاجة زيت عطري مقطر طبيعي (10 مل) كهدية",
      "كتيب مصور للنباتات البرية العطرية في جبال بني شهر",
      "مشروب الأعشاب الجبلية الدافئ"
    ],
    requirements: [
      "حذاء مشي جبلي مريح",
      "قبعة شمسية وزجاجة ماء"
    ],
    schedule: "صباحاً: 8:00 ص - 11:00 ص",
    locationDetails: "منتزه المحفار وغابة الشرف - تنومة",
    coordinates: { lat: 18.930, lng: 42.160 }
  },
  {
    id: "exp-kids-heritage",
    title: "مغامرة الحرفي الصغير: فخار وتراث وألعاب زمان للأطفال",
    category: "أنشطة عائلية وأطفال",
    hostName: "الأستاذة نورة الشهري",
    hostRole: "مربية ومعلمة تراث للأطفال والناشئة",
    hostAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0544332211",
    villageOrCity: "قرية آل عليان التراثية - النماص",
    region: "النماص",
    duration: "ساعتان",
    pricePerPerson: 75,
    maxGroupSize: 15,
    rating: 4.9,
    reviewsCount: 47,
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
    ],
    description: "نشاط تفاعلي محبب للأطفال يتعلمون فيه تشكيل الطين الفخاري، ورسم النقوش الملونة على الفخار، وتجربة الألعاب الشعبية القديمة في ساحة القرية الحجرية وسط بيئة آمنة ومليئة بالمرح والمحتوى التعليمي الهادف.",
    included: [
      "صلصال وفخار وألوان آمنة للأطفال",
      "المجسم الفخاري الذي يصنعه الطفل يأخذه معه للبيت",
      "وجبة خفيفة وعصيرات طازجة",
      "ألعاب حركية ومسابقات تراثية وجوائز فورية"
    ],
    requirements: [
      "مناسب للأطفال من عمر 5 إلى 14 سنة",
      "إمكانية مرافقة أولياء الأمور مجاناً"
    ],
    schedule: "عصراً من 4:30 م إلى 6:30 م أيام الخميس والجمعة والسبت",
    locationDetails: "ساحة الفعاليات بقرية آل عليان التراثية",
    coordinates: { lat: 19.128, lng: 42.134 },
    isPopular: true
  },
  {
    id: "exp-samar-campfire",
    title: "أمسية السمر الشهري: حكايات الرواة، الشعر النبطي والعرضة على الحطب",
    category: "تراث وتصوير",
    hostName: "الشيخ علي بن ظافر والراوي أبو فهد",
    hostRole: "رواة وشعراء من كبار أعيان المنطقة",
    hostAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    hostPhone: "0509876543",
    villageOrCity: "حصن وقرية العقيقة بالسراة",
    region: "النماص",
    duration: "3 ساعات",
    pricePerPerson: 150,
    maxGroupSize: 20,
    rating: 5.0,
    reviewsCount: 63,
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"
    ],
    description: "أمسية دافئة حول موقد الحطب في فناء الحصن الحجري العتيق. استمع لقصص الشجاعة والكرم وأشعار وقصائد الحداء والمدقال والعرضة مع كبار السن، وتعرف على تاريخ قبائل السراة في أجواء مفعمة بالأصالة والمودة.",
    included: [
      "جلسة بيت شعر وفناء حجري مجهزة بالسجاد والوسائد التقليدية",
      "عشاء شعبي فاخر (مفطح / حنيذ شهري مع الرز أو المرقوق والعريكة)",
      "تقديم الشاي المهيل والقهوة بالهيل والزعفران والتمر السريسي",
      "تعلم حركات وإيقاعات العرضة واللعب الشهري"
    ],
    requirements: [
      "مناسبة للزوار والعائلات والمجموعات السياحية",
      "ارتداء ملابس دافئة للمساء"
    ],
    schedule: "يومياً من 7:30 م حتى 10:30 م",
    locationDetails: "فناء ديوانية حصن العقيقة التراثي",
    coordinates: { lat: 19.119, lng: 42.141 },
    isPopular: true
  }
];
