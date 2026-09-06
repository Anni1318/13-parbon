const fs = require('fs');
const path = require('path');

const locales = ['en', 'bn', 'hi'];
const basePath = path.join(__dirname, '..', 'public', 'locales');

const translations = {
  en: {
    festivals_section: {
      title: "Baro Mase Tero Parbon",
      subtitle: "Bengal is the land of 13 festivals in 12 months. Explore the rich cultural calendar of West Bengal."
    },
    festivals: {
      poila_baisakh: {
        name: "Poila Baisakh",
        shortDesc: "Bengali New Year",
        details: "Marks the beginning of the Bengali calendar. Businesses open new ledgers known as Hal Khata.",
        pb1: { name: "Chaitra Sankranti", details: "End of Bengali year, Charak Puja." },
        pb2: { name: "Poila Baisakh", details: "First day of the Bengali new year." }
      },
      jamai_sasthi: {
        name: "Jamai Sasthi",
        shortDesc: "Son-in-law's Day",
        details: "Dedicated to sons-in-law, who are invited to their in-laws' homes for a feast and traditional blessings.",
        js1: { name: "Jamai Sasthi", details: "Traditional feast and blessings." }
      },
      rath_yatra: {
        name: "Rath Yatra",
        shortDesc: "Chariot Festival",
        details: "The grand chariot festival of Lord Jagannath, marked by massive processions.",
        ry1: { name: "Rath Yatra", details: "Chariot procession begins." },
        ry2: { name: "Ulta Rath", details: "Return journey of the chariots." }
      },
      jhulan_purnima: {
        name: "Jhulan Purnima",
        shortDesc: "Swing Festival",
        details: "Celebrates the romance of Radha and Krishna featuring decorated swings during the monsoon.",
        jp1: { name: "Jhulan Purnima", details: "Swings decorated with flowers." }
      },
      janmashtami: {
        name: "Janmashtami",
        shortDesc: "Birth of Lord Krishna",
        details: "Marked by fasting and midnight prayers.",
        jm1: { name: "Janmashtami", details: "Midnight prayers and fasting." }
      },
      vishwakarma: {
        name: "Vishwakarma Puja",
        shortDesc: "Worship of the Divine Architect",
        details: "Industrial workers and drivers bless their tools and vehicles, and the sky fills with kites.",
        vp1: { name: "Vishwakarma Puja", details: "Kite flying and tool worship." }
      },
      durga_puja: {
        name: "Durga Puja",
        shortDesc: "The Grand Celebration",
        details: "The multi-day celebration of Goddess Durga’s victory over Mahishasura.",
        dp1: { name: "Mahalaya", details: "Brahma Muhurta (4:30 AM)" },
        dp2: { name: "Maha Shashthi", details: "Bodhon & Adhibas" },
        dp3: { name: "Maha Saptami", details: "Navapatrika Snan" },
        dp4: { name: "Maha Ashtami", details: "Sandhi Puja (11:48 PM)" },
        dp5: { name: "Maha Navami", details: "Maha Yagna & Bhog" },
        dp6: { name: "Vijaya Dashami", details: "Bisarjan & Sindoor Khela" }
      },
      kojagari: {
        name: "Kojagari Lakshmi Puja",
        shortDesc: "Worship of the Goddess of Wealth",
        details: "Families draw intricate alpana and pray for prosperity.",
        kl1: { name: "Kojagari Purnima", details: "Night-long vigil and prayers." }
      },
      kali_puja: {
        name: "Kali Puja",
        shortDesc: "Festival of Lights",
        details: "Worship of the fierce Goddess Kali alongside the lighting of diyas.",
        kp1: { name: "Bhoot Chaturdashi", details: "Lighting of 14 diyas." },
        kp2: { name: "Kali Puja", details: "Midnight worship & Diwali." }
      },
      bhai_phonta: {
        name: "Bhai Phonta",
        shortDesc: "Brother's Day",
        details: "Sisters apply a sandalwood dot on their brothers' foreheads praying for their long lives.",
        bp1: { name: "Bhai Phonta", details: "Phonta ceremony in the morning." }
      },
      jagaddhatri: {
        name: "Jagaddhatri Puja",
        shortDesc: "Worship of Goddess Jagaddhatri",
        details: "Famous for massive idols and light displays in Chandannagar.",
        jdp1: { name: "Jagaddhatri Puja", details: "Main Puja day." }
      },
      poush_parbon: {
        name: "Poush Parbon",
        shortDesc: "Winter Harvest Festival",
        details: "Centers around date palm jaggery and traditional sweets (pithe and puli).",
        pp1: { name: "Makar Sankranti", details: "Holy dip in the Ganges & Pithe Puli." }
      },
      saraswati: {
        name: "Saraswati Puja",
        shortDesc: "Festival of Knowledge",
        details: "Worship of the Goddess of Knowledge, often considered the Bengali Valentine's Day.",
        sp1: { name: "Vasant Panchami", details: "Pushpanjali and cultural events." }
      }
    }
  },
  bn: {
    festivals_section: {
      title: "বারো মাসে তেরো পার্বণ",
      subtitle: "বাংলা হল ১২ মাসে ১৩ পার্বণের দেশ। পশ্চিমবঙ্গের সমৃদ্ধ সাংস্কৃতিক ক্যালেন্ডার অন্বেষণ করুন।"
    },
    festivals: {
      poila_baisakh: {
        name: "পয়লা বৈশাখ",
        shortDesc: "বাংলা নববর্ষ",
        details: "বাংলা ক্যালেন্ডারের শুরু। ব্যবসায়ীরা হালখাতা নামে নতুন খাতা খোলেন।",
        pb1: { name: "চৈত্র সংক্রান্তি", details: "বাংলা বছরের শেষ, চড়ক পূজা।" },
        pb2: { name: "পয়লা বৈশাখ", details: "বাংলা নববর্ষের প্রথম দিন।" }
      },
      jamai_sasthi: {
        name: "জামাই ষষ্ঠী",
        shortDesc: "জামাইদের দিন",
        details: "জামাইদের জন্য উৎসর্গীকৃত, যাদের শ্বশুরবাড়িতে ভোজ এবং আশীর্বাদের জন্য আমন্ত্রণ জানানো হয়।",
        js1: { name: "জামাই ষষ্ঠী", details: "ঐতিহ্যবাহী ভোজ এবং আশীর্বাদ।" }
      },
      rath_yatra: {
        name: "রথযাত্রা",
        shortDesc: "রথ উৎসব",
        details: "ভগবান জগন্নাথের রথ উৎসব, যা বিশাল শোভাযাত্রা দ্বারা চিহ্নিত।",
        ry1: { name: "রথযাত্রা", details: "রথযাত্রা শুরু।" },
        ry2: { name: "উল্টো রথ", details: "রথগুলির ফিরতি যাত্রা।" }
      },
      jhulan_purnima: {
        name: "ঝুলন পূর্ণিমা",
        shortDesc: "দোলনা উৎসব",
        details: "বর্ষাকালে রাধা-কৃষ্ণের প্রেম উদযাপন করা হয় ফুলের দোলনায়।",
        jp1: { name: "ঝুলন পূর্ণিমা", details: "ফুল দিয়ে সাজানো দোলনা।" }
      },
      janmashtami: {
        name: "জন্মাষ্টমী",
        shortDesc: "ভগবান কৃষ্ণের জন্ম",
        details: "উপবাস এবং মধ্যরাতের প্রার্থনার মাধ্যমে উদযাপিত হয়।",
        jm1: { name: "জন্মাষ্টমী", details: "মধ্যরাতের প্রার্থনা এবং উপবাস।" }
      },
      vishwakarma: {
        name: "বিশ্বকর্মা পূজা",
        shortDesc: "স্বর্গীয় স্থপতির আরাধনা",
        details: "শ্রমিক এবং চালকরা তাদের সরঞ্জাম এবং যানবাহনকে আশীর্বাদ করেন এবং আকাশে ঘুড়ি ওড়ে।",
        vp1: { name: "বিশ্বকর্মা পূজা", details: "ঘুড়ি ওড়ানো এবং সরঞ্জাম পূজা।" }
      },
      durga_puja: {
        name: "দুর্গাপূজা",
        shortDesc: "মহা উৎসব",
        details: "মহিষাসুরের উপর দেবী দুর্গার বিজয়ের বহু-দিনের উদযাপন।",
        dp1: { name: "মহালয়া", details: "ব্রাহ্ম মুহূর্ত (সকাল ৪:৩০)" },
        dp2: { name: "মহা ষষ্ঠী", details: "বোধন ও অধিবাস" },
        dp3: { name: "মহা সপ্তমী", details: "নবপত্রিকা স্নান" },
        dp4: { name: "মহা অষ্টমী", details: "সন্ধি পূজা (রাত ১১:৪৮)" },
        dp5: { name: "মহা নবমী", details: "মহা যজ্ঞ ও ভোগ" },
        dp6: { name: "বিজয়া দশমী", details: "বিসর্জন ও সিঁদুর খেলা" }
      },
      kojagari: {
        name: "কোজাগরী লক্ষ্মীপূজা",
        shortDesc: "ধনদেবী আরাধনা",
        details: "পরিবারগুলি জটিল আলপনা আঁকে এবং সমৃদ্ধির জন্য প্রার্থনা করে।",
        kl1: { name: "কোজাগরী পূর্ণিমা", details: "রাত জাগা এবং প্রার্থনা।" }
      },
      kali_puja: {
        name: "কালীপূজা",
        shortDesc: "আলোর উৎসব",
        details: "প্রদীপ জ্বালানোর পাশাপাশি দেবী কালীর আরাধনা।",
        kp1: { name: "ভূত চতুর্দশী", details: "১৪টি প্রদীপ জ্বালানো।" },
        kp2: { name: "কালীপূজা", details: "মধ্যরাতের পূজা ও দীপাবলি।" }
      },
      bhai_phonta: {
        name: "ভাইফোঁটা",
        shortDesc: "ভাইদের দিন",
        details: "বোনেরা তাদের ভাইদের কপালে চন্দনের ফোঁটা দেয় তাদের দীর্ঘায়ু কামনা করে।",
        bp1: { name: "ভাইফোঁটা", details: "সকালে ফোঁটা অনুষ্ঠান।" }
      },
      jagaddhatri: {
        name: "জগদ্ধাত্রী পূজা",
        shortDesc: "দেবী জগদ্ধাত্রীর আরাধনা",
        details: "চন্দননগরে বিশাল প্রতিমা এবং আলোর প্রদর্শনীর জন্য বিখ্যাত।",
        jdp1: { name: "জগদ্ধাত্রী পূজা", details: "প্রধান পূজার দিন।" }
      },
      poush_parbon: {
        name: "পৌষ পার্বণ",
        shortDesc: "শীতকালীন ফসল উৎসব",
        details: "খেজুর গুড় এবং ঐতিহ্যবাহী মিষ্টি (পিঠে ও পুলি) ঘিরে উদযাপিত।",
        pp1: { name: "মকর সংক্রান্তি", details: "গঙ্গায় পুণ্যস্নান ও পিঠে-পুলি।" }
      },
      saraswati: {
        name: "সরস্বতী পূজা",
        shortDesc: "জ্ঞানের উৎসব",
        details: "বিদ্যার দেবীর আরাধনা, প্রায়শই বাংলার ভ্যালেন্টাইন্স ডে হিসেবে বিবেচিত হয়।",
        sp1: { name: "বসন্ত পঞ্চমী", details: "পুষ্পাঞ্জলি এবং সাংস্কৃতিক অনুষ্ঠান।" }
      }
    }
  },
  hi: {
    festivals_section: {
      title: "बारह महीने तेरह त्योहार",
      subtitle: "बंगाल 12 महीनों में 13 त्योहारों की भूमि है। पश्चिम बंगाल के समृद्ध सांस्कृतिक कैलेंडर का अन्वेषण करें।"
    },
    festivals: {
      poila_baisakh: {
        name: "पोइला बैशाख",
        shortDesc: "बंगाली नव वर्ष",
        details: "बंगाली कैलेंडर की शुरुआत। व्यापारी 'हाल खाता' नामक नए खाते खोलते हैं।",
        pb1: { name: "चैत्र संक्रांति", details: "बंगाली वर्ष का अंत, चड़क पूजा।" },
        pb2: { name: "पोइला बैशाख", details: "बंगाली नव वर्ष का पहला दिन।" }
      },
      jamai_sasthi: {
        name: "जमाई षष्ठी",
        shortDesc: "दामाद का दिन",
        details: "दामादों को समर्पित, जिन्हें उनके ससुराल में दावत और पारंपरिक आशीर्वाद के लिए आमंत्रित किया जाता है।",
        js1: { name: "जमाई षष्ठी", details: "पारंपरिक दावत और आशीर्वाद।" }
      },
      rath_yatra: {
        name: "रथ यात्रा",
        shortDesc: "रथ उत्सव",
        details: "भगवान जगन्नाथ का भव्य रथ उत्सव, जो विशाल जुलूसों द्वारा चिह्नित होता है।",
        ry1: { name: "रथ यात्रा", details: "रथ जुलूस शुरू होता है।" },
        ry2: { name: "उल्टा रथ", details: "रथों की वापसी यात्रा।" }
      },
      jhulan_purnima: {
        name: "झूलन पूर्णिमा",
        shortDesc: "झूला उत्सव",
        details: "मानसून के दौरान फूलों से सजे झूलों में राधा-कृष्ण के प्रेम का जश्न।",
        jp1: { name: "झूलन पूर्णिमा", details: "फूलों से सजे झूले।" }
      },
      janmashtami: {
        name: "जन्माष्टमी",
        shortDesc: "भगवान कृष्ण का जन्म",
        details: "उपवास और आधी रात की प्रार्थनाओं के साथ मनाया जाता है।",
        jm1: { name: "जन्माष्टमी", details: "आधी रात की प्रार्थना और उपवास।" }
      },
      vishwakarma: {
        name: "विश्वकर्मा पूजा",
        shortDesc: "दिव्य वास्तुकार की पूजा",
        details: "श्रमिक और ड्राइवर अपने उपकरणों और वाहनों का आशीर्वाद लेते हैं, और आसमान पतंगों से भर जाता है।",
        vp1: { name: "विश्वकर्मा पूजा", details: "पतंगबाजी और उपकरण पूजा।" }
      },
      durga_puja: {
        name: "दुर्गा पूजा",
        shortDesc: "महा उत्सव",
        details: "महिषासुर पर देवी दुर्गा की जीत का बहु-दिवसीय उत्सव।",
        dp1: { name: "महालया", details: "ब्रह्म मुहूर्त (सुबह 4:30)" },
        dp2: { name: "महा षष्ठी", details: "बोधन और अधिवास" },
        dp3: { name: "महा सप्तमी", details: "नवपत्रिका स्नान" },
        dp4: { name: "महा अष्टमी", details: "संधि पूजा (रात 11:48)" },
        dp5: { name: "महा नवमी", details: "महा यज्ञ और भोग" },
        dp6: { name: "विजया दशमी", details: "विसर्जन और सिंदूर खेला" }
      },
      kojagari: {
        name: "कोजागरी लक्ष्मी पूजा",
        shortDesc: "धन की देवी की पूजा",
        details: "परिवार जटिल अल्पना बनाते हैं और समृद्धि के लिए प्रार्थना करते हैं।",
        kl1: { name: "कोजागरी पूर्णिमा", details: "रात भर जागरण और प्रार्थना।" }
      },
      kali_puja: {
        name: "काली पूजा",
        shortDesc: "रोशनी का त्योहार",
        details: "दीपक जलाने के साथ देवी काली की पूजा।",
        kp1: { name: "भूत चतुर्दशी", details: "14 दीये जलाना।" },
        kp2: { name: "काली पूजा", details: "आधी रात की पूजा और दिवाली।" }
      },
      bhai_phonta: {
        name: "भाई फोटा",
        shortDesc: "भाइयों का दिन",
        details: "बहनें अपने भाइयों के माथे पर चंदन का टीका लगाती हैं और उनकी लंबी उम्र की प्रार्थना करती हैं।",
        bp1: { name: "भाई फोटा", details: "सुबह टीका समारोह।" }
      },
      jagaddhatri: {
        name: "जगद्धात्री पूजा",
        shortDesc: "देवी जगद्धात्री की पूजा",
        details: "चंदननगर में अपनी विशाल मूर्तियों और प्रकाश व्यवस्था के लिए प्रसिद्ध।",
        jdp1: { name: "जगद्धात्री पूजा", details: "मुख्य पूजा का दिन।" }
      },
      poush_parbon: {
        name: "पौष पारबोन",
        shortDesc: "शीतकालीन फसल उत्सव",
        details: "खजूर के गुड़ और पारंपरिक मिठाइयों (पीठे और पुली) के इर्द-गिर्द केंद्रित।",
        pp1: { name: "मकर संक्रांति", details: "गंगा में पवित्र स्नान और पीठे-पुली।" }
      },
      saraswati: {
        name: "सरस्वती पूजा",
        shortDesc: "ज्ञान का त्योहार",
        details: "विद्या की देवी की पूजा, जिसे अक्सर बंगाली वेलेंटाइन डे माना जाता है।",
        sp1: { name: "वसंत पंचमी", details: "पुष्पांजलि और सांस्कृतिक कार्यक्रम।" }
      }
    }
  }
};

locales.forEach(lang => {
  const filePath = path.join(basePath, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.festivals_section = translations[lang].festivals_section;
    data.festivals = translations[lang].festivals;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang} translations`);
  }
});
