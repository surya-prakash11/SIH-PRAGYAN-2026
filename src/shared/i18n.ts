export type Language = "en" | "hi" | "te";

export const LANGUAGES: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
];

export const TRANSLATIONS = {
  // Navigation & Header
  nav_dashboard: { en: "Dashboard", hi: "डैशबोर्ड", te: "డాష్‌బోర్డ్" },
  nav_leaderboard: { en: "Leaderboard", hi: "लीडरबोर्ड", te: "లీడర్‌బోర్డ్" },
  nav_account: { en: "My Account", hi: "मेरा खाता", te: "నా ఖాతా" },
  data_saver_on: { en: "Data Saver ON", hi: "डेटा सेवर चालू", te: "డేటా సేవర్ ఆన్" },
  data_saver_off: { en: "Data Saver OFF", hi: "डेटा सेवर बंद", te: "డేటా సేవర్ ఆఫ్" },
  total_xp: { en: "Total XP", hi: "कुल एक्सपी (XP)", te: "మొత్తం XP" },
  select_language: { en: "Language", hi: "भाषा", te: "భాష" },

  // Dashboard Stats & Headers
  student_dashboard: { en: "Student Dashboard", hi: "छात्र डैशबोर्ड", te: "విద్యార్థి డాష్‌బోర్డ్" },
  faculty_console: { en: "Faculty Console", hi: "फैकल्टी कंसोल", te: "ఫ్యాకల్టీ కన్సోల్" },
  namaste: { en: "Namaste", hi: "नमस्ते", te: "నమస్కారం" },
  welcome: { en: "Welcome", hi: "स्वागत है", te: "స్వాగతం" },
  class_rank: { en: "Class Rank", hi: "कक्षा रैंक", te: "తరగతి ర్యాంక్" },
  accuracy: { en: "Accuracy", hi: "सटीकता", te: "ఖచ్చితత్వం" },
  notes_shared: { en: "Notes Shared", hi: "साझा किए गए नोट्स", te: "పంచుకున్న నోట్స్" },
  view_leaderboard_btn: { en: "View Leaderboard", hi: "लीडरबोर्ड देखें", te: "లీడర్‌బోర్డ్ చూడండి" },
  ncert_subjects: { en: "NCERT Subjects", hi: "एनसीईआरटी विषय", te: "NCERT సబ్జెక్టులు" },
  assessments_available: { en: "Assessments available for you", hi: "उपलब्ध मूल्यांकन व टेस्ट", te: "అందుబాటులో ఉన్న మూల్యాంకనాలు" },
  recent_xp_activity: { en: "Recent XP activity", hi: "हाल की एक्सपी गतिविधि", te: "ఇటీవలి XP కార్యాచరణ" },
  moderation_queue: { en: "Moderation queue", hi: "समीक्षा कतार", te: "సమీక్ష క్యూ" },
  awaiting_review: { en: "awaiting review", hi: "समीक्षा की प्रतीक्षा में", te: "సమీక్ష కోసం వేచి ఉంది" },
  not_attempted: { en: "Not attempted", hi: "प्रयास नहीं किया", te: "ప్రయత్నించలేదు" },
  best_score: { en: "Best", hi: "सर्वश्रेष्ठ", te: "ఉత్తమ స్కోర్" },
  chapters_across_subjects: { en: "chapters across 6 subjects", hi: "6 विषयों में कुल अध्याय", te: "6 సబ్జెక్టులలోని అధ్యాయాలు" },
  chapters_with_assessments: { en: "with assessments", hi: "टेस्ट उपलब्ध", te: "పరీక్షలతో" },
  chapters_word: { en: "chapters", hi: "अध्याय", te: "అధ్యాయాలు" },
  content_contribution: { en: "Content contribution", hi: "सामग्री योगदान", te: "కంటెంట్ సహకారం" },
  earn_in_every_test: { en: "Earn it in every test", hi: "हर टेस्ट में अर्जित करें", te: "ప్రతి పరీక్షలో సంపాదించండి" },
  community_contributions: { en: "Community contributions", hi: "सामुदायिक योगदान", te: "కమ్యూనిటీ సహకారం" },
  guest_session: { en: "Guest session", hi: "अतिथि सत्र", te: "అతిథి సెషన్" },
  no_assessments_yet: {
    en: "Assessments for your class are being uploaded by faculty. Check back soon!",
    hi: "आपकी कक्षा के लिए मूल्यांकन सामग्री फैकल्टी द्वारा अपलोड की जा रही है।",
    te: "మీ తరగతి కోసం మూల్యాంకనాలు త్వరలో అందుబాటులోకి వస్తాయి.",
  },
  no_xp_yet: {
    en: "No activity yet. Take your first objective test to start earning XP!",
    hi: "अभी कोई गतिविधि नहीं है। एक्सपी अर्जित करने के लिए अपना पहला टेस्ट दें!",
    te: "ఇంకా కార్యాచరణ లేదు. XP సంపాదించడానికి మీ మొదటి పరీక్షను రాయండి!",
  },
  all_notes_verified: {
    en: "All community notes are verified. New submissions will appear here.",
    hi: "सभी सामुदायिक नोट्स सत्यापित हैं। नई प्रस्तुतियां यहाँ दिखाई देंगी।",
    te: "అన్ని కమ్యూనిటీ నోట్స్ ధృవీకరించబడ్డాయి. కొత్తవి ఇక్కడ కనిపిస్తాయి.",
  },
  moderation_tip: {
    en: "Open any chapter’s Notes section and use the one-click Verify toggle — verified notes jump to the top with a green tick.",
    hi: "किसी भी अध्याय के नोट्स अनुभाग में जाएँ और सत्यापित टॉगल का उपयोग करें — सत्यापित नोट्स हरे टिक के साथ शीर्ष पर आते हैं।",
    te: "ఏదైనా అధ్యాయం నోట్స్ విభాగాన్ని తెరిచి వెరిఫై చేయండి — ధృవీకరించబడిన నోట్స్ ఆకుపచ్చ టిక్‌తో పైకి వస్తాయి.",
  },
  mapping_note: {
    en: "Chapter metadata is mapped to NCERT learning-outcome IDs (LO-…) and DIKSHA codes — see any chapter page for the full mapping.",
    hi: "अध्याय मेटाडेटा एनसीईआरटी लर्निंग आउटकम आईडी (LO-…) और दीक्षा (DIKSHA) कोड से मैप किया गया है।",
    te: "అధ్యాయం మెటాడేటా NCERT లెర్నింగ్ అవుట్‌కమ్ IDలు మరియు DIKSHA కోడ్‌లకు మ్యాప్ చేయబడింది.",
  },
  by_author: { en: "by", hi: "द्वारा", te: "రచన" },

  // Tabs & Chapter sections
  tab_learning_hub: { en: "1 · Learning Hub", hi: "1 · लर्निंग हब (वीडियो व नोट्स)", te: "1 · లెర్నింగ్ హబ్ (పాఠాలు)" },
  tab_objective: { en: "2 · Objective (20 MCQs)", hi: "2 · वस्तुनिष्ठ (20 बहुविकल्पीय प्रश्न)", te: "2 · ఆబ్జెక్టివ్ (20 MCQs)" },
  tab_subjective: { en: "3 · Subjective (2/3/5M)", hi: "3 · वर्णनात्मक अभ्यास (2/3/5 अंक)", te: "3 · సబ్జెక్టివ్ ప్రాక్టీస్ (2/3/5M)" },

  // Video & Notes
  faculty_videos: { en: "Faculty Video Lectures", hi: "फैकल्टी वीडियो व्याख्यान", te: "ఫ్యాకల్టీ వీడియో పాఠాలు" },
  community_notes: { en: "Community Notes & Handouts", hi: "सामुदायिक नोट्स व हैंडआउट्स", te: "కమ్యూనిటీ నోట్స్ & హ్యాండ్‌అవుట్‌లు" },
  contribute_notes: { en: "Contribute notes", hi: "नोट्स जोड़ें", te: "నోట్స్ జోడించండి" },
  faculty_verified: { en: "Faculty Verified", hi: "फैकल्टी सत्यापित", te: "ఫ్యాకల్టీ ధృవీకరించబడింది" },
  verify_note: { en: "Verify note", hi: "सत्यापित करें", te: "ధృవీకరించండి" },
  un_verify: { en: "Un-verify", hi: "सत्यापन हटाएं", te: "ధృవీకరణ తొలగించు" },
  helpful: { en: "helpful", hi: "उपयोगी", te: "సహాయకరం" },
  recommended: { en: "Recommended", hi: "अनुशंसित", te: "సిఫార్సు చేయబడింది" },
  chapter_markers: { en: "Chapter Markers", hi: "अध्याय टाइमस्टैम्प", te: "అధ్యాయం టైమ్‌స్టాంప్‌లు" },
  top_performers: { en: "Top performers · this chapter", hi: "शीर्ष प्रदर्शनकर्ता · यह अध्याय", te: "టాప్ పెర్ఫార్మర్స్ · ఈ అధ్యాయం" },
  full_leaderboard_btn: { en: "Full chapter leaderboard", hi: "पूरा चैप्टर लीडरबोर्ड", te: "పూర్తి అధ్యాయం లీడర్‌బోర్డ్" },
  xp_available: { en: "XP available here", hi: "यहाँ उपलब्ध एक्सपी", te: "ఇక్కడ అందుబాటులో ఉన్న XP" },
  no_notes_yet: { en: "No notes yet for this chapter. Be the first contributor!", hi: "इस अध्याय के लिए अभी कोई नोट्स नहीं हैं। पहले योगदानकर्ता बनें!", te: "ఈ అధ్యాయానికి ఇంకా నోట్స్ లేవు. మొదటి సహకారి అవ్వండి!" },
  publish_note: { en: "Publish note", hi: "नोट्स प्रकाशित करें", te: "नोट्स ప్రచురించండి" },
  title_label: { en: "Title", hi: "शीर्षक", te: "శీర్షిక" },
  content_label: { en: "Content", hi: "सामग्री", te: "కంటెంట్" },
  upload_file: { en: "Attach PDF / Image", hi: "पीडीएफ / चित्र जोड़ें", te: "PDF / చిత్రం జోడించండి" },
  close: { en: "Close", hi: "बंद करें", te: "మూసివేయి" },

  // Tests & Practice
  pyq_badge: { en: "PYQ Verified", hi: "पिछले वर्ष के प्रश्न", te: "గత సంవత్సరాల ప్రశ్నలు" },
  question: { en: "Question", hi: "प्रश्न", te: "ప్రశ్న" },
  marks: { en: "Marks", hi: "अंक", te: "మార్కులు" },
  submit_quiz: { en: "Submit Test", hi: "टेस्ट सबमिट करें", te: "పరీక్ష సమర్పించండి" },
  next: { en: "Next", hi: "अगला", te: "తరువాతి" },
  prev: { en: "Previous", hi: "पिछला", te: "మునుపటి" },
  time_remaining: { en: "Time remaining", hi: "शेष समय", te: "మిగిలిన సమయం" },
  score: { en: "Score", hi: "स्कोर", te: "స్కోరు" },
  explanation: { en: "Explanation", hi: "स्पष्टीकरण", te: "వివరణ" },
  download_marking_scheme: { en: "Download Model Marking Scheme", hi: "मॉडल मार्किंग स्कीम डाउनलोड करें", te: "మోడల్ మార్కింగ్ స్కీమ్‌ను డౌన్‌లోడ్ చేయండి" },
  step_rubric: { en: "Marking Rubric & Step-by-Step Breakdown", hi: "मार्किंग रूब्रिक व स्टेप-बाय-स्टेप विभाजन", te: "మార్కింగ్ రూబ్రిక్ & స్టెప్-బై-స్టెప్ బ్రేక్‌డౌన్" },
  model_answer: { en: "Official NCERT Model Answer", hi: "आधिकारिक एनसीईआरटी मॉडल उत्तर", te: "అధికారిక NCERT మోడల్ సమాధానం" },
  your_answer_placeholder: { en: "Type your step-by-step answer or rough working here…", hi: "यहाँ अपना स्टेप-बाय-स्टेप उत्तर टाइप करें…", te: "మీ సమాధానాన్ని ఇక్కడ టైప్ చేయండి…" },

  // Leaderboard
  class_leaderboard_title: { en: "Class Leaderboard", hi: "कक्षा लीडरबोर्ड", te: "తరగతి లీడర్‌బోర్డ్" },
  state_leaderboard_title: { en: "State Benchmarking", hi: "राज्यवार रैंकिंग", te: "రాష్ట్రాల ర్యాంకింగ్" },
  all_india_rank: { en: "All India Rank", hi: "अखिल भारतीय रैंक", te: "ఆల్ ఇండియా ర్యాంక్" },
  students: { en: "Students", hi: "छात्र", te: "విద్యార్థులు" },
  avg_accuracy: { en: "Avg. Accuracy", hi: "औसत सटीकता", te: "సగటు ఖచ్చితత్వం" },

  // Roles & Auth
  faculty: { en: "Faculty", hi: "फैकल्टी", te: "ఫ్యాకల్టీ" },
  student: { en: "Student", hi: "छात्र", te: "విద్యార్థి" },
  guest: { en: "Guest", hi: "अतिथि", te: "అతిథి" },
  switch_persona: { en: "Switch Persona", hi: "खाता बदलें", te: "ఖాతా మార్చండి" },
  sign_in: { en: "Sign In", hi: "साइन इन करें", te: "లాగిన్" },
  register: { en: "Create Account", hi: "नया खाता बनाएं", te: "ఖాతా సృష్టించండి" },
  logout: { en: "Log Out", hi: "लॉगआउट", te: "లాగౌట్" },

  // Subjects
  subj_science: { en: "Science", hi: "विज्ञान (Science)", te: "సైన్స్ (Science)" },
  subj_mathematics: { en: "Mathematics", hi: "गणित (Mathematics)", te: "గణితం (Mathematics)" },
  subj_social_science: { en: "Social Science", hi: "सामाजिक विज्ञान (Social Science)", te: "సాంఘిక శాస్త్రం (Social Science)" },
  subj_english: { en: "English", hi: "अंग्रेज़ी (English)", te: "ఇంగ్లీష్ (English)" },
  subj_hindi: { en: "हिन्दी · Hindi", hi: "हिन्दी (Hindi)", te: "హిందీ (Hindi)" },
  subj_arts_vocational: { en: "Arts & Vocational", hi: "कला व व्यावसायिक शिक्षा", te: "కళలు & వృత్తి విద్య" },

  // Footer
  footer_tagline: {
    en: "Knowledge is Supreme Consciousness — Open Digital Learning & Assessment Portal",
    hi: "प्रज्ञानं ब्रह्म · ज्ञान ही परम चेतना है — खुला डिजिटल शिक्षण एवं मूल्यांकन पोर्टल",
    te: "ప్రజ్ఞానం బ్రహ్మ · జ్ఞానమే పరమ చైతన్యం — ఓపెన్ డిజిటల్ లెర్నింగ్ & అసెస్‌మెంట్ పోర్టల్",
  },
  footer_rights: {
    en: "Pragyan © 2026 · Smart India Hackathon (SIH 2026) · Team PRAGYAN",
    hi: "प्रज्ञान © 2026 · स्मार्ट इंडिया हैकथॉन (SIH 2026) · टीम प्रज्ञान",
    te: "ప్రజ్ఞాన్ © 2026 · స్మార్ట్ ఇండియా హ్యాకథాన్ (SIH 2026) · టీమ్ ప్రజ్ఞాన్",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function getTranslation(key: TranslationKey, lang: Language): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}

export function getSubjectLocalizedName(slug: string, lang: Language): string {
  switch (slug) {
    case "science":
      return lang === "hi" ? "विज्ञान · Science" : lang === "te" ? "సైన్స్ · Science" : "Science";
    case "mathematics":
      return lang === "hi" ? "गणित · Mathematics" : lang === "te" ? "గణితం · Mathematics" : "Mathematics";
    case "social-science":
      return lang === "hi" ? "सामाजिक विज्ञान · Social Science" : lang === "te" ? "సాంఘిక శాస్త్రం · Social Science" : "Social Science";
    case "english":
      return lang === "hi" ? "अंग्रेज़ी · English" : lang === "te" ? "ఇంగ్లీష్ · English" : "English";
    case "hindi":
      return lang === "hi" ? "हिन्दी · Hindi" : lang === "te" ? "హిందీ · Hindi" : "हिन्दी · Hindi";
    case "arts-vocational":
      return lang === "hi" ? "कला व व्यावसायिक शिक्षा" : lang === "te" ? "కళలు & వృత్తి విద్య" : "Arts & Vocational";
    default:
      return slug;
  }
}
