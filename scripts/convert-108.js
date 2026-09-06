const fs = require('fs');

const raw = `1	अद्या	Aadya	The Initial reality
2	आर्य	Aarya	Goddess
3	अभव्या	Abhavya	Improper or fear-causing
4	ऐन्द्री	Aeindri	Power of God Indra
5	अग्निज्वाला	Agnijwaala	One who is poignant like fire
6	अहंकारा	Ahankaara	One with Pride
7	अमेया	Ameyaa	One who is beyond measure
8	अनंता	Ananta	One who is Infinite or beyond measure
9	अनंता	Ananta	The Infinite
10	अनेकशस्त्रहस्ता	Anekashastrahasta	Possessor of many hand weapons
11	अनेकास्त्रधारनी	Anekastra Dhaarini	Possessor of many missile weapons
12	अनेकवर्णा	Anekavarna	One who has many complexions
13	अपर्णा	Aparna	One who doesnt eat even leaves while fasting
14	अप्रौढा	Apraudha	One who never gets old
15	बहुला	Bahula	One who is in various forms
16	बहुलप्रेमा	Bahulaprema	One who is loved by all
17	बलप्रदा	Balaprada	The bestower of strength
18	भवानी	Bhaavini	The Beautiful Woman
19	भाव्या	Bhaavya	Represents Future
20	भद्रकाली	Bhadrakaali	Fierce form of Kali
21	भवानी	Bhavaani	The abode of the universe
22	भवमोचिनी	Bhavamochani	The absolver of the universe
23	भवप्रीता	Bhavaprita	One who is loved by the universe
24	भव्या	Bhavya	With Magnificence
25	ब्राह्मी	Braahmi	Power of God Brahma
26	ब्रह्मवादिनी	Brahmavaadini	One who is present everywhere
27	बुद्धि	Buddhi	Intelligence
28	बुद्धिदा	Buddhida	The bestower of wisdom
29	चामुंडा	Chaamunda	Slayer of Chanda and Munda(demons)
30	चंडमुंडविनाशिनी	Chanda MundaVinashini	Destroyer of the ferocious asuras Chanda and Munda
31	चंद्रघंटा	Chandraghanta	One who has mighty bells
32	चिंता	Chinta	Tension
33	चिता:	Chita	Death-bed
34	चिति	Chiti	The thinking mind
35	चित्रा	Chitra	The Picturesque
36	चित्तरूपा	Chittarupa	One who is in thought-state
37	दक्षकन्या	Dakshakanya	Daughter of Daksha
38	दक्षयज्ञविनाशिनी	Daksha Yagna Vinashini	Interrupter of the sacrifice of Daksha
39	देवमाता	Devamata	Mother Goddess
40	दुर्गा	Durga	The Invincible
41	एककन्या	Ekakanya	The girl child
42	घोररूपा	Ghorarupa	Having a fierce outlook
43	ज्ञाना	Gyaana	Full of Knowledge
44	जलोदरी	Jalodari	Abode of the ethereal universe
45	जया	Jaya	The Victorious
46	कालरात्रि	Kaalaratri	Goddess who is black like night
47	किशोरी	Kaishori	The adolescent
48	कलामंजीरारंजिनी	Kalamanjiiraranjini	Wearing a musical anklet
49	कराली	Karaali	The Violent
50	कात्यानी	Katyayani	One who is worshipped by sage Katyanan
51	कौमारी	Kaumaari	The adolescent
52	कुमारी	Komaari	The beautiful adolescent
53	क्रिया	Kriya	One who is in action
54	क्रूरा	Krrooraa	Brutal (on demons)
55	लक्ष्मी	Lakshmi	Goddess of Wealth
56	महेश्वरी	Maaheshvari	Power of Lord Mahesha (Shiva)
57	मातंगी	Maatangi	Goddess of Matanga
58	मधुकैटभहन्त्री	Madhu Kaitabha Hantri	Slayer of the demon-duo Madhu and Kaitabha
59	महाबला	Mahaabala	Having immense strength
60	महातपा	Mahatapa	With severe penance
61	महिषासुरमर्दिनी	Mahishasura Mardini	Slayer of the bull-demon Mahishaasura
62	महोदरी	Mahodari	One who has huge belly which stores the universe
63	मन:	Manah	Mind
64	मातंगमुनिपूजिता	Matangamunipujita	Worshipped by Sage Matanga
65	मुक्तकेशी	Muktakesha	One who has open tresses
66	नारायणी	Narayani	The destructive aspect of Lord Narayana (Brahma)
67	निशुम्भशुम्भहननी	Nishumbha Shumbha Hanani	Slayer of the demon-brothers Shumbha Nishumbha
68	नित्या	Nitya	The eternal one
69	पाटला	Paatala	Red in color
70	पाटलवती	Paatalavati	Wearing red-color attire
71	परमेश्वरी	Parameshvari	The Ultimate Goddess
72	पट्टाम्बरापरिधाना	Pattaambaraparidhaana	Wearing a dress made of leather
73	पिनाकधारिणी	Pinaakadharini	One who holds the trident of Shiva
74	प्रत्यक्षा	Pratyaksha	One who is real
75	प्रौढा	Praudha	One who is old
76	परुषाकृति	Purushaakriti	One who takes the form of a man
77	रत्नप्रिया	Ratnapriya	Adorned or loved by jewels
78	रौद्रमुखी	Raudramukhi	One who has a fierce face like destroyer Rudra
79	साध्वी	Saadhvi	The Sanguine
80	सद्गति	Sadagati	Always in motion, bestowing Moksha (salvation)
81	सर्वास्त्रधारिणी	Sarvaastradhaarini	Possessor of all the missile weapons
82	सर्वादानवघातिनी	Sarvadaanavaghaatini	Possessing the power to kill all the demons
83	सर्वमन्त्रमयी	Sarvamantramayi	One who possess all the instruments of thought
84	सर्वाशास्त्रमयी	Sarvashaastramayi	One who is deft in all theories
85	सर्वासुरविनाशा	Sarvasuravinasha	Destroyer of all demons
86	सर्ववाहनवाहना	Sarvavahanavahana	One who rides all vehicles
87	सर्वविद्या	Sarvavidya	Knowledgeable
88	सति	Sati	One who got burned alive
89	सत्ता	Satta	One who is above all
90	सत्या	Satya	The truth
91	स्त्यानन्दस्वरूपिनी	Satyanandasvarupini	Form of Eternal bliss
92	सावित्री	Savitri	Daughter of the Sun God Savitr
93	शाम्भवी	Shaambhavi	Consort of Shambhu
94	शिवदूती	Shivadooti	Ambassador of Lord Shiva
95	शूलधारिणी	Shooldharini	One who holds a monodent
96	सुंदरी	Sundari	The Gorgeous
97	सुरसुन्दरी	Sursundari	Extremely Beautiful
98	तपस्विनी	Tapasvini	one who is engaged in penance
99	त्रिनेत्रा	Trinetra	One who has three-eyes
100	वाराही	Vaarahi	One who rides on Varaah
101	वैष्णवी	Vaishnavi	The invincible
102	वनदुर्गा	Vandurga	Goddess of forests
103	विक्रमा	Vikrama	Violent
104	विमिलौत्त्कार्शिनी	Vimalauttkarshini	One who provides joy
105	विष्णुमाया	Vishnumaya	Spell of Lord Vishnu
106	वृद्धमाता	Vriddhamaata	The old mother (loosely)
107	यति	Yati	Ascetic, one who renounces the world
108	युवती	Yuvati	The Woman`;

const lines = raw.split('\n');
const names = lines.map(line => {
  const parts = line.split('\t');
  return {
    srl: parseInt(parts[0]),
    hindi: parts[1],
    english: parts[2],
    meaning: parts[3]
  };
});

fs.writeFileSync('src/data/durga-108-names.json', JSON.stringify(names, null, 2));
console.log('Saved to src/data/durga-108-names.json');
