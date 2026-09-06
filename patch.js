const fs = require('fs');
['en', 'bn', 'hi'].forEach(lang => {
  const path = 'public/locales/' + lang + '/translation.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  if (lang === 'en') {
    data.festivals = { 'durga-puja': 'Durga Puja', 'kali-puja': 'Kali Puja' };
    data.calendar_days = {
      'mahalaya': 'Mahalaya',
      'maha_shashthi': 'Maha Shashthi',
      'maha_saptami': 'Maha Saptami',
      'maha_ashtami': 'Maha Ashtami',
      'sandhi_puja': 'Sandhi Puja',
      'maha_navami': 'Maha Navami',
      'vijaya_dashami': 'Vijaya Dashami',
      'kali_puja_amavasya': 'Kali Puja Amavasya',
      'diwali_(lakshmi_puja)': 'Diwali (Lakshmi Puja)',
      'bhratri_dwitiya': 'Bhratri Dwitiya'
    };
  } else if (lang === 'bn') {
    data.festivals = { 'durga-puja': 'দুর্গা পূজা', 'kali-puja': 'কালী পূজা' };
    data.calendar_days = {
      'mahalaya': 'মহালয়া',
      'maha_shashthi': 'মহা ষষ্ঠী',
      'maha_saptami': 'মহা সপ্তমী',
      'maha_ashtami': 'মহা অষ্টমী',
      'sandhi_puja': 'সন্ধি পূজা',
      'maha_navami': 'মহা নবমী',
      'vijaya_dashami': 'বিজয়া দশমী',
      'kali_puja_amavasya': 'কালী পূজা অমাবস্যা',
      'diwali_(lakshmi_puja)': 'দীপাবলি (লক্ষ্মী পূজা)',
      'bhratri_dwitiya': 'ভাতৃ দ্বিতীয়া'
    };
  } else if (lang === 'hi') {
    data.festivals = { 'durga-puja': 'दुर्गा पूजा', 'kali-puja': 'काली पूजा' };
    data.calendar_days = {
      'mahalaya': 'महालया',
      'maha_shashthi': 'महा षष्ठी',
      'maha_saptami': 'महा सप्तमी',
      'maha_ashtami': 'महा अष्टमी',
      'sandhi_puja': 'संधि पूजा',
      'maha_navami': 'महा नवमी',
      'vijaya_dashami': 'विजया दशमी',
      'kali_puja_amavasya': 'काली पूजा अमावस्या',
      'diwali_(lakshmi_puja)': 'दिवाली (लक्ष्मी पूजा)',
      'bhratri_dwitiya': 'भ्रातृ द्वितीया'
    };
  }
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
