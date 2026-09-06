import Link from 'next/link';
import { ArrowLeft, ExternalLink, AlertTriangle, Phone, MapPin } from 'lucide-react';
import festivalOptions from '@/data/festival-options.json';
import pandalDecorators from '@/data/pandal-decorators.json';
import lightingDecorators from '@/data/lighting-decorators.json';
import durga108Names from '@/data/durga-108-names.json';
import shaktiPeethas from '@/data/shakti-peethas.json';

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Find the exact option based on slug
  let option = null;
  for (const category of festivalOptions) {
    const found = category.links.find(l => l.slug === slug);
    if (found) {
      option = found;
      break;
    }
  }

  const recipeSlugs = [
    'aloo-posto', 'bandhakopir-dalna', 'cholar-dal', 'daab-chingri', 
    'dal-prawn-chop', 'deemer-devil', 'dhokar-dalna', 'doi-maach', 
    'ilish-bhapa', 'labra', 'luchi', 'machh-potoler-dorma'
  ];

  if (!option && !recipeSlugs.includes(slug)) {
    return (
      <div className="min-h-screen bg-[#080414] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Content Not Found</h1>
        <p className="text-gray-400 mb-8">The requested festival information could not be located.</p>
        <Link href="/" className="px-6 py-2 bg-amber-500 text-black rounded-lg font-bold">Return Home</Link>
      </div>
    );
  }

  let content = null;
  
  if (slug === 'pandal-decorator' || slug === 'lighting-decorator') {
    const decorators = slug === 'pandal-decorator' ? pandalDecorators : lightingDecorators;
    
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-2xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          {decorators.length} {option?.label}s Found
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decorators.map((deco: any, idx: number) => (
            <div key={idx} className="bg-black/50 border border-white/5 rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-white text-lg mb-1">{deco.name}</h4>
              {deco.decoratedFor && (
                <p className="text-amber-500 text-sm mb-3">
                  Decorated for: <span className="text-white">{deco.decoratedFor}</span> ({deco.year})
                </p>
              )}
              <div className="space-y-2 mt-auto">
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
                  <span>{deco.address || 'Address not available'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={16} className="shrink-0 text-gray-500" />
                  <span>{deco.contact || 'No contact provided'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (slug === 'about-goddess-durga') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          About Goddess Durga
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Durga puja is celebrated in the worship of Durga, the Hindu goddess who is the form of Shakti. This festival is celebrated every year in the Ashwin month of a bright lunar fortnight as per the Bikram Sambat Calendar. This festival is considered very auspicious since it also celebrates the victory of good over evil. It was on this day that Durga is said to have killed the demon Mahishasura.
          </p>

          <p>
            According to mythology, it is said that Mahishasura, who was a demon, after years of worship and penance finally got the opportunity to request Brahma of a boon. The boon was that no human or a deity will be able to kill him. After this boon, Mahishasura swelled with pride and being invincible, he took disadvantage of his powers and started spreading terror and damage. He transformed into a strong and unbeatable buffalo demon and had killed thousands of innocent people. He soon started attacking Gods as well. To put an end to this, the three most important deities Vishnu, Shankar and even Brahma with other Gods combined all their power and energies to give birth to Durga. Durga has ten hands an each of her hands is a representation of the power she has and it is with these powers that Durga killed Mahishasura. The day she vanquished this demon is today known as Mahalaya.
          </p>

          <p>
            The Skanda Purana indicates that the name of Durga is given to the goddess Parvati, consort of Siva, when she kills the Asura Durgama. Her qualities as a Goddess are denoted by her names as well. She is Universal Mother. As Uma, Lord Shiva&apos;s wife, she is seen as a protector and a mother figure. Goddess Durga is the symbol of 3 states : Creative, Preservative and Destructive. Various forms of Goddess Durga are Chandi, Mahakali, Mahalakshmi and Maha Saraswati are Her divine forms. Each form of the Devi has a distinctive role meant for a definite purpose.
          </p>

          <p>
            Prakriti is a complete concept of the three gunas. Sattva is characterized by brilliance, knowledge, equanimity and lightness. Rajas is characterized by movement, dynamism, ambition, attachment and reactivity or raga. Tamas is characterized by ignorance, delusion and inertia, the power of resistance. The entire manifest world is subject to the influence of the three gunas.
          </p>

          <p>
            Then began the battle between that Devi and the asuras, Goddess Durga, the Shakti and energy and anger turned against evil, set herself to destroy the armies of Mahishasura. Mahisasura&apos;s general, named Chiksura and Chamara fought. A asura named Udagra, Mahahanu, Asiloman, and Baskala with huge army fought in that battle. Privarita with many thousands of elephants and horses, fought in that battle. Showering Her own weapons and arms, Goddess Chandika too, quite playfully, cut into pieces all those weapons and arms. With gods and sages extolling Her, showing no signs of fatigue on Her face, the Goddess Iswari hurled Her weapons and arms at the bodies of the asuras. The mount of the Goddess, the lion, shaking its mane in rage, stalked amidst the armies of the asuras like a fire. The Goddess Ambika, fighting in the battle created and devastated the army. Ciksura, the great asura general, proceeded in anger to fight with Ambika. He showered arrows on the Goddess in battle just as a cloud showers rain on the peak of Mount Meru. Camara also came agreesively towards devi Ambika Devi&apos;s Lion injured Camara in the battle. Udagra was killed in the battle by the Devi. Karala was brought down. Devi pulverised Uddhata with the blows of Her mace. She killed Baskala with a javelin and destroyed Tamra and Andhaka with arrows. The Supreme Iswari killed Ugrasya, Ugravirya and Mahahanu too with her trident. With Her sword She struck down Bidala&apos;s head from his body, and dispatched both Durdhara and Durmudha to the abode of Death with Her arrows.
          </p>

          <div className="bg-amber-500/5 p-8 rounded-2xl border border-amber-500/10 mt-12">
            <h4 className="text-3xl font-bold text-amber-500 mb-8 font-serif border-b border-amber-500/20 pb-4">Unique Portrayal of Goddess Durga</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h5 className="text-xl font-bold text-white mb-3">Ten arms of Maa Durga</h5>
                <p className="text-sm">Goddess Durga is depicted as having eight or ten hands. These represent eight quadrants or ten directions in Hinduism. This suggests that she protects the devotees from all directions.</p>
              </div>

              <div>
                <h5 className="text-xl font-bold text-white mb-3">Three Eyes of Maa Durga</h5>
                <p className="text-sm">Like Shiva, Goddess Durga is also referred to as &quot;Triyambake&quot; meaning the three eyed Goddess. The left eye represents desire (the moon), the right eye represents action (the sun), and the central eye knowledge (fire).</p>
              </div>

              <div>
                <h5 className="text-xl font-bold text-white mb-3">The Vehicle of Maa Durga</h5>
                <p className="text-sm">The lion represents power, will and determination. Goddess Durga riding the lion symbolises the Goddess&apos; mastery over all these qualities. Devi Durga is portrayed standing on a lion in a fearless pose of &quot;Abhay Mudra&quot; signifying assurance of freedom from fear. The universal Mother seems to be saying to all her devotees: &quot;Surrender all actions and duties onto me and I shall release thee from all fears&quot;.</p>
              </div>
            </div>

            <div className="mt-12">
              <h5 className="text-2xl font-bold text-white mb-6 border-l-4 border-amber-500 pl-4">The Weapons</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Conch Shell</span>
                  <span className="text-sm">Symbolizes the &apos;Pranava&apos; or the mystic word &apos;Om&apos;, which indicates Her holding on to God in the form of sound.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Bow and Arrow</span>
                  <span className="text-sm">Represent energy. By holding both the bow and arrow in one hand, &quot;Mother Durga&quot; indicates Her control over both aspects of energy – potential and kinetic.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Thunderbolt</span>
                  <span className="text-sm">Signifies firmness. One must be firm like thunderbolt in one&apos;s convictions. Similar to thunderbolt that can break anything against which it strikes without being affected itself, the devotee should to undertake a challenge without losing his confidence.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Lotus</span>
                  <span className="text-sm">In Her hand is not in full bloom which symbolizes the certainty of success but not finality.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Sudarshan-Chakra</span>
                  <span className="text-sm">Spins around the index finger of the Goddess signifies that the entire world is subservient to the will of Her and is at Her command. She uses this unfailing weapon to destroy evil and produce an environment conducive to the growth of righteousness.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-500 block mb-1">Sword</span>
                  <span className="text-sm">Symbolizes knowledge, which has the sharpness of a sword.</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 md:col-span-2">
                  <span className="font-bold text-amber-500 block mb-1">Trident or Trishul</span>
                  <span className="text-sm">A symbol of three qualities – Satwa (inactivity), Rajas (activity) and Tamas (non-activity) – and that She is the remover of all the three types of miseries – physical, mental and spiritual.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'origin-of-goddess-durga') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Origin of Maa Durga
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            According to the Hindus, Devi Durga is great among all the goddesses. She is the consort of Lord Shiva and worshiped in various forms corresponding to her two aspects: &apos;Benevolence&apos; and &apos;Fierceness&apos;. She is known as Uma, &quot;light&quot;; Gauri, &quot;yellow or brilliant&quot;; Parvati, &quot;the mountaineer&quot;; and Jagatmata, &quot;the-mother-of-the-world&quot; in her milder guise. The terrible which originates are Durga &quot;the inaccessible&quot;; Kali, &quot;the black&quot;; Chandi, &quot;the fierce&quot;; and Bhairavi, &quot;the terrible.&quot;
          </p>

          <p>
            Devi Durga, a beautiful warrior seated upon a lion wearing a beautiful red cloth saree is her first appearance of the great goddess. The circumstance of her miraculous arrival was the tyranny of the buffalo demon Mahishasur, who through terrific austerities and had acquired invincible strength after blessed with a boon from Lord Brahma.
          </p>

          <p>
            The gods were afraid of this buffalo demon because neither Lord Vishnu nor Lord Shiva could prevail against him. It seemed that the joint energy of Shakti from the Gods was only capable of defeating Mahishasur, and so it was the eighteen-armed Devi Durga who went out to do battle against Mahishasur and she killed him.
          </p>

          <p>
            Devi Durga went to battle on her ferocious lion &apos;Sinhavahini&apos;, armed with celestial weapons given to her by the other Gods with anger and aggressive aspects of the goddess Shakti, whose role in Hindu mythology was to fight and conquer the evils and also personify the female Shakti. In the battlefield, she fought and killed the evil Mahishasur and restored back heaven to the Gods. Since then the goddess is invoked for protection from the powers of evil. Durga Puja is observed in her honor, to celebrate her victory over evil everywhere in India.
          </p>
        </div>
      </div>
    );
  } else if (slug === 'different-forms-of-durga') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Different Forms of Maa Durga
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            According to the Hindu mythology Navadurga is the nine forms of Goddess Durga or the manifestation of Goddess Durga, the Mother Goddess, in nine different forms. During the Navratri celebrations these nine forms of Durga Mata are worshipped together that occur four times throughout the year.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Sailaputri</div><div className="text-sm text-gray-400">शैलपुत्री</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Brahmacharini</div><div className="text-sm text-gray-400">व्रह्मचारणी</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Candraghanta</div><div className="text-sm text-gray-400">चन्द्रघन्टा</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Kusamanda</div><div className="text-sm text-gray-400">कुशमन्दा</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Skandamata</div><div className="text-sm text-gray-400">स्कन्दमाता</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Katyayani</div><div className="text-sm text-gray-400">कात्यायनी</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Kalaratri</div><div className="text-sm text-gray-400">कालरात्री</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Mahagauri</div><div className="text-sm text-gray-400">महागौरी</div></div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><div className="font-bold text-amber-500">Devi Siddhidatri</div><div className="text-sm text-gray-400">सिद्धिदात्री</div></div>
          </div>

          <div className="space-y-8 mt-12">
            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">1. Devi Sailaputri</h4>
              <p>Devi Sailaputri is known as the daughter of Himalaya and she is the first among nine Durgas. According to legends, she was the daughter of Daksha, Sati-Bhavani wife of Lord Shiva. According to story, Daksha had organized a big Yagna and he did not invite Lord Shiva. But Sati being obstinate, reached there and Daksha insulted Shiva thereupon. Devi Sati could not tolerate the insult of her husband and burnt herself in the fire of Yagna. In her next birth in the name of Parvati - Hemvati she became the daughter of Himalaya and got married with Lord Shiva. As per Upanishad she had torn the egotism of Lord Indra, and some other Gods. Being ashamed they bowed and prayed that, &quot;In fact, thou are Shakti, we all - Brahma, Vishnu and Shiva are capable by getting Shakti from you.&quot;</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">2. Devi Brahmacharini</h4>
              <p>The second form of Durga Mata is Devi Brahamcharini. The idol of Goddess Brahamcharini is very gorgeous and charming carrying a rosary in her right hand and Kamandal in her left hand.</p>
              <p className="mt-2">According to story in her previous birth she was known as Parvati- Hemavati the daughter of Himalaya. She was busy playing games with her friends when Naradji came to her, saw her Palm-lines and predicted that she will get married with a naked trible ‘Bhole Baba’ who was with her in her previous birth in the form of Devi Sati, daughter of King Daksha which she needs to perform penance for him.</p>
              <p className="mt-2">There upon Parvati told her mother Menaka that she would marry none other except Shambhu, otherwise she would remain unmarried in her whole life and she went to observe penance from then. That is why her name is famous as Tapacharini – Brahmacharini and from that time her name Uma became familiar.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">3. Devi Chandraghanta</h4>
              <p>The name of the third Durga Shakti is Devi Chandraghanta. She is Golden in color, charm and bright with half-circular moon in her forehead. She has three eyes and ten hands holding with ten types of celestial weapons seated on a Lion and ready to fight in a war with unprecedented image of bravery. The frightful sound of her bell terrifies all the villains, demons and danavas.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">4. Devi Kusamanda</h4>
              <p>Devi Kushmanda is the fourth form of Durga Mata. The Shakti creates egg (Universe by mere laughing). Kushmanda resides in solar systems and shines brightly in all the ten directions like Sun. She has eight hands in which seven types of weapons are shining in her seven hands and Rosary is in her right hand riding a lion. She likes the offerings of &quot;Kumhde&quot; and thereafter her name &quot;Kushmanda&quot; has become famous.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">5. Devi Skandamata</h4>
              <p>Devi Skandamata or &quot;Skanda Mata&quot; is the fifth different forms of Durga Mata. After observing penance, the daughter of Himalaya, got married with Shiva and they had a son named &quot;Skanda&quot; who is a leader of the army of Gods. Skanda Mata is also a deity of fire. Skanda is white seated in her lap on a lotus who has three eyes and four hands.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">6. Devi Katyayani</h4>
              <p>Sixth form of Durga Mata is Devi Katyayani daughter of Rishi Katyayan. Rishi Katyayan had observed penance with a desire to get paramba as his daughter. As a result she took birth as a daughter of Katyayan. Therefore her name is &quot;Katyayani&quot;. She has three eyes and eight hands. These are eight types of weapons missiles in her seven hands riding on a Lion. To destroy demon Mahishasura, the Mother Goddess manifested as Goddess Katyayani. This is one of the more violent forms of the Mother Goddess in which she manifests as a Warrior Goddess.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">7. Devi Kalaratri</h4>
              <p>The Seventh form of Durga Mata is Devi Kalaratri. She is black like night with hairs unlocked wearing necklaces shining like lightning. She has three bright eyes which are round like universe. While respiring from nose thousands of flames of fire comes out. She rides on Shava (dead body) with a sharp sword in her right hand. Her lower hand is in blessing mood. The burning torch (mashal) is in her left hand and her lower left hand is in fearless style, by which she makes her devotees fearless. Being auspicious she is also called &quot;Shubhamkari.&quot; Devi Kalaratri is the fiercest and the most ferocious form of the Mother Goddess, in which she manifests to destroy the demons, Sumbha and Nisumbha.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">8. Devi Mahagauri</h4>
              <p>The Eighth form of Durga Mata is Devi Mahagauri. According to Hindu mythology she is of sixteen years old and she is white as a conch, moon and Jasmine. Her clothes and ornaments are white and clean. She has three eyes. She has four hands riding a bull. The above left hand is in &quot;Fearless - Mudra&quot; and lower left hand holds &quot;Trishul.&quot; The above right hand has tambourine and lower right hand is in blessing style. She is calm and peaceful and exists in peaceful style. It is said that when the body of Gauri became dirty due to dust and earth while observing penance, Shiva makes it clean with the waters of Ganges. Then her body became bright like lightening. Therefore, she is known as &quot;Maha Gauri&quot;.</p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2 font-serif">9. Devi Siddhidatri</h4>
              <p>Devi Siddhidatri is the ninth form of Durga Mata. The meaning of Siddhidatri - ‘Siddhi’ means supernatural power and ‘Dhatri’ means awarder. Every year Devi Siddhidatri is worshipped on the ninth day of Navaratri and fulfills all the divine aspirations which complete the mundane.</p>
              <p className="mt-2">According to legends, there are eight Siddhis commonly known as Anima, Mahima, Garima, Laghima, Prapti, Prakamya, Iishitva &amp; Vashitva. According to ‘Devipuran’, it is said that the supreme God Lord Shiva got all these siddhies by worshipping Maha Shakti. The half body of Lord Shiva has become Goddess and thus his name ‘Ardhanarishvar’ becomes famous.</p>
              <p className="mt-2">Devi Siddhidatri has four hands riding on a lion. This form of Devi Durga is worshipped by all the Gods and Goddess, Rishis and Munis, Siddhas, Yogis, Sadhakas and devotees for attaining the best religious asset.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === '108-names-of-durga') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          108 Names of Maa Durga
        </h3>
        
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-amber-500/10 text-amber-500 font-medium">
              <tr>
                <th className="px-6 py-4">Srl.</th>
                <th className="px-6 py-4">In Hindi</th>
                <th className="px-6 py-4">In English</th>
                <th className="px-6 py-4">Meaning in English</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {durga108Names.map((name, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{name.srl}</td>
                  <td className="px-6 py-4 font-hindi text-base">{name.hindi}</td>
                  <td className="px-6 py-4 font-medium text-white">{name.english}</td>
                  <td className="px-6 py-4">{name.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (slug === 'significance') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Significance of Durga Puja
        </h3>
        
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            During Durga Puja, God in the form of the Divine Mother is worshiped in Her various forms as Durga, Lakshmi and Saraswati. Though the Goddess is one, She is represented and worshiped in three different aspects. On the first three nights of the festival, Durga is worshiped following Lakshmi and then Saraswati Devi on the last three nights. The following tenth day is called Vijayadasami. Vijaya means &quot;victory&quot;, the victory over one&apos;s own minds that can come only when these three: Durga, Lakshmi, and Saraswati are worshiped.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20">
              <h4 className="text-xl font-bold text-amber-500 mb-3 font-serif">Meaning of Durga</h4>
              <p className="text-sm">Durga is perhaps the most widely worshiped deity of Shakti. Maa Durga&apos;s divine characterization include entire Devibhagavatham is dedicated to her. Durga means one who is difficult to approach. However since she is the mother of universe, she is also the personification of tender love, wealth, power, beauty and all virtues.</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20">
              <h4 className="text-xl font-bold text-amber-500 mb-3 font-serif">Implications of the Idol</h4>
              <p className="text-sm">The complete image of Goddess Durga represent destruction of evil and protection of good and reflects the point that in order to become divine one should keep one&apos;s animal instincts under control. Thus, by worshiping Durga the idea of ruthless destruction is invoked to annihilate all the desires and unfold divinity.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20">
              <h4 className="text-xl font-bold text-amber-500 mb-3 font-serif">Cultural Celebrations</h4>
              <p className="text-sm">ln Bengal, Goddess Durga is worshiped for nine days. In South India, an altar decorated with a stepped platform and filled with small images of gods, animals, birds, and other beings, animate and inanimate, is worshiped for nine days. This altar is known as the Kolu. People re-dedicate themselves to their profession. On this day, a child also begins to learn the alphabet in a ceremony known as aksarabhyasa. This day marks the beginning of any type of learning. One offers gifts to one&apos;s teachers, seeks their blessings, and prays for success in one&apos;s new endeavors.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'regional-names') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Regional Names of Durga Puja
        </h3>
        
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Durga Puja is identified by different regional names throughout India. This diversity across various states bind the people in a unique way. Durga Puja is one of the most important religious festival of Hindus, celebrating the return of the goddess to her natal home. But, this great Hindu festival is recounted and celebrated slightly differently in various regions taking on different forms and names.
          </p>
          <p>
            The festival of Durga Puja is characterized by a variety of prayers and rituals. The name of the Durga puja vary from locale to locale as common for most of the Hindu festivals. The various distinct regional names of this festival are:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <a href="https://www.indianfestivaldiary.com/durgapuja/regional_names_of_durga_puja/ayudha_puja.php" target="_blank" rel="noopener noreferrer" className="block group">
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20 group-hover:border-amber-500/50 transition-colors h-full">
                <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif group-hover:text-amber-400">Ayudha Puja</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Tamil Nadu, Kerala, Karnataka & Andhra Pradesh</p>
              </div>
            </a>
            
            <a href="https://www.indianfestivaldiary.com/durgapuja/regional_names_of_durga_puja/bommai_kolu.php" target="_blank" rel="noopener noreferrer" className="block group">
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20 group-hover:border-amber-500/50 transition-colors h-full">
                <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif group-hover:text-amber-400">Bommai Kolu</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Tamil Nadu, Karnataka & Andhra Pradesh</p>
              </div>
            </a>

            <a href="https://www.indianfestivaldiary.com/durgapuja/regional_names_of_durga_puja/durga_puja.php" target="_blank" rel="noopener noreferrer" className="block group">
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20 group-hover:border-amber-500/50 transition-colors h-full">
                <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif group-hover:text-amber-400">Durga Puja / Pujo</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> West Bengal, Bihar, UP, Delhi & MP</p>
              </div>
            </a>

            <a href="https://www.indianfestivaldiary.com/durgapuja/regional_names_of_durga_puja/kullu_dussehra.php" target="_blank" rel="noopener noreferrer" className="block group">
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20 group-hover:border-amber-500/50 transition-colors h-full">
                <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif group-hover:text-amber-400">Kullu Dussehra</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Kullu Valley, Himachal Pradesh</p>
              </div>
            </a>

            <a href="https://www.indianfestivaldiary.com/durgapuja/regional_names_of_durga_puja/mysore_dussehra.php" target="_blank" rel="noopener noreferrer" className="block group">
              <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-xl border border-amber-500/20 group-hover:border-amber-500/50 transition-colors h-full">
                <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif group-hover:text-amber-400">Mysore Dussehra</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Mysore, Karnataka</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'puja-awards') {
    const awardsData = require('@/data/puja-awards.json');
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Durga Puja Awards 2025
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Discover the most prestigious awards celebrating the creativity, devotion, and community spirit of Durga Puja. These awards recognize the finest pandals, idols, lighting, and social initiatives across the festival.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {awardsData.map((award: any, idx: number) => (
              <a 
                key={idx} 
                href={award.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-all flex items-center justify-between group"
              >
                <span className="font-bold text-amber-500 group-hover:text-amber-400 font-serif pr-2">{award.name}</span>
                <ExternalLink size={16} className="text-amber-500/50 group-hover:text-amber-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (slug === 'tradition') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Tradition of Durga Puja
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Today&apos;s most authentic form of the Durga is that of a ten handed goddess modeled out of clay astride a lion. Each of those hands carry a separate weapon in them except two, which holds the spear which has been struck into the chest of the demon, Mahishasura. The four children of the Goddess had also been added to the iconography - Laxmi, the goddess of wealth, Saraswati, the Goddess of knowledge, Kartik, the God of beauty as well as warfare and Ganesha, the &apos;Siddhidata&apos; or the starter of everything in good sense.
          </p>
          
          <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-xl my-8">
            <h4 className="text-xl font-bold text-amber-500 mb-2 font-serif">The Dhak (Drums)</h4>
            <p>
              The drum-beats are an integral part of the Durga Puja. This special variety of the drum, known as &apos;Dhak,&apos; enthralls the hearts of the Calcutta with its majestic rhythm right from the day of &apos;Sasthi&apos;. This drum is held on the shoulder with the beating side in the bottom and is beaten with two sticks, one thick and another thin.
            </p>
          </div>

          <p>
            The Durga Puja spans over a period of ten days in case of traditional and household Pujas, though the main part of it is restricted to four days only. The main Puja, however, starts on the evening of &apos;Sasthi&apos;, the sixth day after the new moon, generally from beneath a &apos;Bel&apos; tree for the traditional ones. In the wee hours of &apos;Saptami,&apos; the next day, the &apos;Pran&apos; or life of the Devi is brought from a nearby pond or river in a banana tree and established inside the image. The main puja starts thereafter and the prime time is reached in the &apos;Sandhikshan,&apos; the crossover time between Ashtami and Navami. Finally, on &apos;Dashami,&apos; the tenth day from the new moon, the image is immersed in a pond or river.
          </p>
        </div>
      </div>
    );
  } else if (slug === 'legends') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Legends of Durga Puja
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Goddess Durga represents a united front of all Divine forces against the negative forces of evil and wickedness. The gods in heaven decided to create an all-powerful being to kill the demon king Mahishasur who was ready to attack them.
          </p>

          <p>
            At that very moment a stream of lightning dazzled forth from the mouths of Brahma, Vishnu and Mahesh and it turned into a beautiful, magnificent woman with ten hands. Then all the gods furnished her with their special weapons. The image of Durga, the Eternal Mother destroying the demon, Mahishasur is symbolic of the final confrontation of the spiritual urge of man with his baser passions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Pandavas</h4>
              <p className="text-sm">As per our great epic Mahabharat, Pandavas after wandering in the forest for 12 years, hung their weapons on a Shami tree before entering the court of king Virat to spend the last one year in disguise. After the completion of that year on Vijayadashmi the day of Dassera they brought down the weapons from the Shami tree and declared their true identity. Since that day the exchange of Shami leaves on Dassera day became symbols of good, will and victory.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Lord Rama</h4>
              <p className="text-sm">This festival has immense mythological significance. As per Ramayan, Ram performed &quot;chandi-puja&quot; and invoked the blessings of Durga to kill Ravana, the ten-headed king of Lanka who had abducted Seeta and had charmed life. In order to worship Goddess Durga, Lord Rama needed 108 blue lotus flowers. However, he could manage only with 107. To attain the magical number, he decided to offer one of his eyes, which was lotus-shaped and blue in color, at the Goddess&apos;s feet. Satisfied with his devotion Goddess Durga appeared and blessed him. Durga divulged the secret to Ram how he could kill Ravana. Then after vanquishing him, Ram with Seeta and Laxman returned victorious to his kingdom of Ayodhya on Diwali day.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Kautsa</h4>
              <p className="text-sm">Kautsa, the young son of Devdatt, insisted on his guru Varatantu to accept &quot;gurudakshina&quot;, after finishing his education. After lots of persistence his Guru, finally asked for 14 crore gold coins, one crore for each of the 14 sciences he taught Kautsa. Kautsa went to king Raghuraj, who was known for his genorisity and was an ancestor of Rama. But just at that time he had emptied all his coffers on the Brahmins, after performing the Vishvajit sacrifice. So, the king went to Lord Indra and asked for the gold coins. Indra summoned Kuber, the god of wealth. Indra told Kuber, &quot;Make a rain of gold coins fall on the &quot;shanu&quot; and &quot;apati&quot; trees round Raghuraja&apos;s city of Ayodhya.&quot; The rain of coins began to fall. The king Raghu gave all the coins to Kautsa, who gave 14 crores gold coins to his guru. The remaining coins were lavishly distributed to the people of Ayodhya city. This happened on the day of Dussehra. In remembrance of this event the custom is kept of looting the leaves of the &quot;apati&quot; trees and people present each other these leaves as &quot;sone&quot; (gold).</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'akalbodhan') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Akalbodhan
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Akalbodhan is the worship of Devi Durga in the month of Ashwin which is an uncustomary time for commencement of the worship. It is called so since the period of the worship of Goddess Durga differs from the conventional period or during the spring season (Basanta).
          </p>

          <p>
            According to Ramayana, Rama was engaged in a fierce battle with Ravana and before going into the battle he wanted to seek blessings of victory from Goddess Durga as she was the Shakti. Rama therefore held the puja to wake up the goddess Durga during autumn worshiping Durga in &apos;Akal&apos; (wrong time). From that period this puja is called &apos;Akalbodhan&apos;.
          </p>

          <p>
            According to rituals, Devi Durga is worship with the customary 108 Neel Kamals (blue lotuses). During the puja, Rama could only manage to gather 107 of them. Rama offered one of his eyes as a substitute of 108th lotus to make up the numbers and pleased with his devotion Devi Durga blessed him. Rama started his battle with Ravana on the day of Maha Saptami and Ravana was killed in between Ashtami and Navami or the &apos;Shandhikshan&apos; and was cremated on the day of Dashami. Therefore the four days of puja that we celebrate marks the end in the triumph of the good over evil.
          </p>

          <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors mt-8">
            <h4 className="text-2xl font-bold text-amber-500 mb-4 font-serif">Story behind Akalbodhan</h4>
            <p>
              Akalbodhan is also described in the &apos;Kritivaas&apos; writing. During the war between Rama and Ravana, both were equally handled by each other. After sometime, Ravana is in prayer of Rama to get the victory of this battle which made Rama surprised. Rama&apos;s first and foremost duty was to protect or to save his disciple. After that moment, Rama suffered from indecision. By seeing these, all the gods and goddesses became sorrowful and started planning to inspire Rama to kill Ravana and finally it was decided that Devi Saraswati would be on the tongue of Ravana and she will make him to say some evil words so that Rama could continue with the battle. Rama started the battle but got frustrated again and he suffered a lot for his Sita. After that all the gods felt the pain of him and decided to celebrate a Durga Puja for the intention to kill Ravana.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'durga-sahasranamam') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Durga Sahasranamam
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Chanting of Sahashra-naama of Maa Durga during the Durga puja is essential.
          </p>

          <p>
            On the auspicious occasion of Durga Puja chanting of Shri Durga Sahasranamam with full faith and sincerity is considered holy and auspicious and is said that it invokes the blessings and good wishes of Durga Ma
          </p>

          <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-2xl mt-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2 font-serif">Download the Complete Sahasranamam</h4>
            <p className="text-gray-400 mb-8">
              Access the complete 1,000 names of Goddess Durga in a beautifully formatted 24-page PDF document, presented in original Sanskrit script.
            </p>
            <a 
              href="/pdfs/durga_sahasranamam.pdf" 
              target="_blank"
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all transform hover:scale-105"
            >
              Download PDF (24 Pages)
            </a>
          </div>
        </div>
      </div>
    );
  } else if (slug === '51-shakti-peethas') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          The 51 Shakti Peethas
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light mb-8">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            These Shakti Peethas are spread across the Indian subcontinent, each being associated with a specific part of Sati&apos;s body and a manifestation of the Goddess Shakti. The exact number and locations of the Shakti Peethas can vary in different texts, but the following are commonly accepted as the 51 primary Shakti Peethas:
          </p>
          <p>
            These Shakti Peethas are revered as powerful spiritual sites where devotees can worship the divine feminine energy of Ma Sati.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 mt-6">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-amber-500/10 text-amber-500 font-medium">
              <tr>
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">ShaktiPeeth Name</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Body Part</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {shaktiPeethas.map((peetha, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-amber-500/70">{peetha.no.toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4 font-bold text-white text-base">{peetha.name}</td>
                  <td className="px-6 py-4 flex items-center gap-2"><MapPin size={14} className="text-gray-500" /> {peetha.state}</td>
                  <td className="px-6 py-4 text-amber-100">{peetha.bodyPart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (slug === 'durga-anjali') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-8 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Durga Anjali (Pushpanjali)
        </h3>
        
        <div className="space-y-6">
          {[
            "OM (AUM) Goddess Slayer of Demon Mahisa, Chanda and Moonda. The Great Illusionist, bestow unto Me Longevity, Restoration to health and Victory. Salutation to thee.",
            "OM (AUM) Spouse of Lord Shiva, the cause and source of all welfare, fulfiller of all ends. Oh: Goddess Uma, Spouse of lord Brahama, celibacy in person, the body in which the entire universe is Exhibited. Be pleased to me.",
            "OM (AUM) Goddess Katyaani endowed with six divine graces, Destroyer of fear, Desire giver, Killer of Death. Thou art Katyaani Salutation to thee.",
            "OM (AUM) Female leader of Gods, formidable, giver of progeny, Amiable Eternity, ameliorator of Lineage, and Fierce, Bestow me victory. Salutation to thee.",
            "OM (AUM) Goddess Chandi, Thou art Formidable, the destroyer of all formidables. Save me in all Respects. Oh! Goddess of the Universe Salutation to thee.",
            "OM (AUM) Goddess Durga, Dispeller of distress, destroyer of all evils. Be my eternal benedictor, Being desirous of piety, wealth, Bestow me fulfillment of desires. Salutation to thee.",
            "OM (AUM) Oh! Goddess, the enemy of the Demons Chanda-Moonda, Enemy of Demon Neshumbha, Hostile to the Demon Shumbha. Salutation to thee.",
            "OM (AUM) Oh! Goddess Durga, Oh! Sankara's beloved, Oh! Magnanimous, Save me. Raving, Slayer Of Demon Mahisa, Be pleased to me. Salutation to thee.",
            "OM (AUM) The power of Creation, Preservation and Dissolution, Oh Eternal ! Repository of good Qualities, Possessor of good qualities, Spouse of Lord Narayana, Salutation to thee!",
            "OM (AUM) Spouse of Lord Shiva, the cause and source of all welfare, fulfiller of all desires. Oh! Goddess Durga, Spouse of lord Narayana, Protector from all evils. With reverence I Salute thee."
          ].map((mantra, idx) => (
            <div key={idx} className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors">
              <p className="text-lg text-white font-serif leading-relaxed italic">
                &quot;{mantra}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (slug === 'rituals') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Rituals of Durga Puja
        </h3>
        
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            The festival of Durga Puja starts with Mahalaya, the first phase of the waxing moon in Aswin. Thousands offer prayers to their ancestors at the city&apos;s river banks, a ritual called Tarpan. The inauguration of the Goddess idol starts on Maha Shashti.
          </p>

          <p>
            The main puja is for three days - Maha Saptami, Maha Ashtami, Maha Navami. The puja rituals are long and very detailed and complicated. Three days of Mantras and Shlokas and Arati and offerings - needs an expert priest to do this kind of Puja. Because of these facts, the number of Pujas held in the family has reduced and Durga Puja has mostly emerged as a community festival.
          </p>

          <div className="space-y-8 mt-10">
            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Maha Shashti</h4>
              <p>On this day Goddess Durga arrives to the mortal world from her heavenly abode, accompanied by her children. She is welcomed with much fanfare amidst the beats of dhak. Unveiling the face of the idol is the main ritual on this day. Kalaparambho, the ritual performed before the commencement of the puja precedes Bodhon, Amontron and Adibas.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Maha Saptami</h4>
              <p>Saptami is the first day of Durga puja. Kola Bow or Nabapatrika is given a pre-dawn bath. This is an ancient ritual of worshiping nine types of plants. They are together worshiped as a symbol of the goddess. The main Saptami Puja follows Kalparambho and Mahasnan.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Maha Ashtami</h4>
              <p>The day began with a recital of Sanskrit hymns in community puja pandals as thousands of devotees offered anjali to the goddess. Kumari Puja or the worship of little girls as the mother goddess was a special part of the rituals observed in a number of traditional and household pujas. As the day wore on, it was time for the important Sandhi Puja, which marks the inter-linking of the Maha Ashtami and Maha Navami.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Maha Navami</h4>
              <p>This is the concluding day of Durga Puja. The main Navami puja begins after the end of Sandhi Puja. The Navami Bhog is offered to the goddess. This is later partaken as prasad by the devotees.</p>
            </div>

            <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <h4 className="text-2xl font-bold text-amber-500 mb-3 font-serif">Dashami</h4>
              <p>After the three days of Puja, in Dashami , in the last day, a tearful farewell is offered to the Goddess. Most of the community pujas postpone the farewell as long as possible and arrange a grand send-off. The images are carried in processions around the locality and finally is immersed in a nearby river or lake. Vijaya Dashami is an event celebrated all over the country.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'puja-accessories') {
    const accessoriesData = [
      {
        title: "Accessories for Kalparambho",
        categories: [
          { name: "Food", items: "Panchashasha (grains of five types - rice, mung or whole green gram, til or sesame, mashkalai or any variety of whole black leguminous seed, job or millet), Panchagobbo (five items obtained from the cow - milk, ghee or clarified butter, curd, cow dung and gomutra), curd, honey, sugar, three big noibiddos, one small noibiddo, three bowls of madhupakka (a mixture of honey, curd, ghee and sugar for oblation), bhoger drobbadi (items for the feast), aaratir drobbadi mahasnan oil, dantokashtho, sugar cane juice, an earthen bowl of atop (a type of rice), til toilo (sesame oil)." },
          { name: "Water", items: "Ushnodok (Lukewarm Water), Coconut Water, Sarbooushodhi, Mahaoushodhi, Water from Oceans, Rain Water, Spring Water, Water containing Lotus pollen." },
          { name: "Puja Items", items: "Sindur (vermillion), panchabarner guri (powders of five different colours - turmeric, rice, kusum flowers or red aabir, rice chaff or coconut fibre burnt for the dark colour, bel patra or powdered wood apple leaves), panchapallab (leaves of five trees - mango, pakur or a species of fig, banyan, betal and Joggodumur or fig), pancha ratna (five types of gems - gold, diamond, sapphire, ruby and pearl), panchakoshay (bark of five trees - jaam, shimul, berela, kool, bokul powdered in equal portions and mixed with water), green coconut with stalk, three aashonanguriuk (finger ring made of kusha)." },
          { name: "Cloth", items: "Gamcha or a piece of cloth to cover the pot, a dhoti for Vishnu, a sari each for bodhon and Chandi." },
          { name: "Decorative Items", items: "Ghat or a pot, kundohari, a mirror, four arrows, tekatha or a triangular frame of wood, horitoki flowers (myrobalan), chandmala (garland with circular decorations), aashon (a mattress of jute or hay)." },
          { name: "Other Items", items: "Water camphor and perfumed sandal wood paste. soil - extracted from elephant tusks, from the teeth of the pig, from the horns of the ox, from the bank of rivers Ganga and Saraswati, from both the banks of a river, from a place where four roads intersect, from palaces, from the ant hill, from the mountains, Vishnu toilo." }
        ]
      },
      {
        title: "Accessories for Shashti Puja",
        categories: [
          { name: "Food", items: "A stem of wood apple with fruits, green coconut with stalk, an earthen bowl full of atop, three bowls of madhupakka, sesame seeds, curd, honey, clarified butter, sugar, three big noibiddos, one small noibiddo, bhoger drobbadi, aaratir drobbadi, grain, fruits, one dozen bananas with a single stem, white mustard seeds." },
          { name: "Puja Items", items: "A pot, four arrows two ashonanguriuk, panchapallab, pancha ratna, panchashasha, panchagobbo, tekatha, dubba grass, sindur, swastik pituli, conch shell, kajol (corrilium), gorachana, yellow thread, chamor, a fly-whisk made of yak's tail used for fanning, earthen lamps, panch pradip for arati." },
          { name: "Cloth", items: "Clothes for the Pundit, a piece of cloth, gamcha for arati, 40 or 22 finger rings made of kusha, sari for nabapatrika, one sari for the main puja, saris for Durga, Lakshmi, Saraswati, Chandi, dhoti for Kartik, Ganesh, Shiva, Vishnu, clothes for nine planets, clothes for peacock, mouse, lion, demon, buffalo, ox, snake, chandmala, a nosering, iron, conch shell." },
          { name: "Plants & Flowers", items: "Flower garland, belpatra garland, Banana plant, turmeric plant, colacassia plant, wood apple stem, pomegranate stem, a stem of Jayanti plant, arum plant, rice plant, ashoka stem, twigs of white aparajita plant, two banana stems." }
        ]
      },
      {
        title: "Accessories for Saptami Puja",
        categories: [
          { name: "Food", items: "Sesame seeds, myrobalan, flowers, two earthen bowls full of atop, green coconut with stalk, wood apple leaves, white mustard, madhupakka (40 or 22 bowls), honey, sugar, noibiddos (40 or 22), one main noibiddo, fruits, items for bhog." },
          { name: "Puja Items", items: "Jute ropes, red thread, alta, four finger rings, four yadnyopaveet, a pot, a mirror, a tekatha, sandalwood, mashkolai, hibiscus flower, small noibiddo, one big earthen lamp, panchapallab, pancha ratna, panchashasha, panchaguri, vermillion, items for arati, items for the yadnya - sand, wood, dry khorke grass, cowdung, kusha grass, ghee, 108 bel leaves and a bowl." },
          { name: "Cloth", items: "Clothes for the Pundit, a piece of cloth, gamcha for arati, 40 or 22 finger rings made of kusha, sari for nabapatrika, one sari for the main puja, saris for Durga, Lakshmi, Saraswati, Chandi, dhoti for Kartik, Ganesh, Shiva, Vishnu, clothes for nine planets, clothes for peacock, mouse, lion, demon, buffalo, ox, snake, chandmala, a nosering, iron, conch shell." },
          { name: "Plants & Flowers", items: "Flower garland, belpatra garland, Banana plant, turmeric plant, colacassia plant, wood apple stem, pomegranate stem, a stem of Jayanti plant, arum plant, rice plant, ashoka stem, twigs of white aparajita plant, two banana stems." }
        ]
      },
      {
        title: "Accessories for Ashtami Puja",
        categories: [
          { name: "Food", items: "Fruits, items for bhog, items for arati, 40 or 22 bowls of madhupakka, honey, sugar, curd, ghee, 40 or 22 noibiddos, four small noibiddos." },
          { name: "Puja Items", items: "One dantakashto, 40 or 22 finger rings made of kusha, one nosering, iron, two conch shells, a box of vermillion, flowers, a garland, belpatra garland, one chandmala, one ghoti." },
          { name: "Cloth", items: "One sari for Durga, new clothes for Lakshmi, Saraswati, Chandi, Kartik, Ganesh, Shiva, Vishnu, nine planets, the peacock, mouse, lion, demon, buffalo, ox, snake, Jaya, Bijoya and Ram." },
          { name: "Plants & Flowers", items: "Flowers, gold ring, a bronze bowl for madhupakka, a small sari, main noibiddo, one small noibiddo, one plate, one pitcher, iron, one nosering, one pillow, a mat, a chandmala, 108 earthen lamps, items for bhog, and items for the arati." }
        ]
      },
      {
        title: "Accessories for Navami & Dashami Puja",
        categories: [
          { name: "Food", items: "Betel leaves, pan masala, 40 or 22 bowls of madhupakka, honey, sugar, curd, ghee, 40 or 22 noibiddos, four small noibiddos." },
          { name: "Puja Items", items: "Flowers, 40 or 22 finger rings made of kusha, one ghoti , one nosering, iron, two conch shells, a box of vermillion, flower garland, belpatra garland, a chandmala, one plate, items needed for the yadnya (fire sacrifice), bel leaves, gift for the Purohit." },
          { name: "Cloth", items: "Clothes for Lakshmi, Saraswati, Chandi, Kartik, Ganesh, Shiva, Vishnu, the nine planets, the peacock, mouse, lion, demon, buffalo, ox, snake, Jaya, Bijoya and Ram, one dantakashto , one sari for the main puja." },
          { name: "For the Dashami Puja", items: "Perfume, flowers, durba grass, basil leaves, bel leaves, incense sticks, an earthen lamp, noibiddo, curd, murki, sweets and items needed for arati." }
        ]
      }
    ];

    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Puja Accessories (Samagri)
        </h3>
        
        <div className="space-y-12">
          {accessoriesData.map((day, dayIdx) => (
            <div key={dayIdx} className="space-y-6">
              <h4 className="text-2xl font-bold text-white font-serif border-l-4 border-amber-500 pl-4">{day.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.categories.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                    <h5 className="font-bold text-amber-500 mb-2">{cat.name}</h5>
                    <p className="text-sm text-gray-300 leading-relaxed">{cat.items}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (slug === 'mahalaya') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Mahalaya - The Beginning
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Mahalaya marks the beginning of Durga Puja which is held every year. As we all know, the countdown for Durga Puja festival starts from the day of Shri Krishna ‘Janmashtami’ but the preparations of Durga Puja reaches its final stage from the day of Mahalaya. Mahalaya also marks the end of ‘Pitri-Paksha’ and start of the ‘Devi-Paksha’. Devi Durga is worshipped for four days, but the beginning of the puja starts from the day of Mahalaya.
          </p>

          <p>
            In the predawn hours of the day, the enchanting voice of Sri Birendra Krishna Bhadra for ‘Mahishashur Mordini’ on all India radio fills up the beginning of ‘Devi-Paksha’ and auspicious occasion to the countdown of Durga Puja.
          </p>

          <div className="bg-amber-500/5 p-8 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors my-8">
            <h4 className="text-2xl font-bold text-amber-500 mb-6 font-serif">The famous slokas of Mahalaya</h4>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="font-serif italic text-amber-300">Ya Devi sarva bhuteshu Matri rupena samsthita</p>
                <p className="font-serif italic text-amber-300">Ya Devi sarva bhuteshu Shakti rupena samsthita</p>
                <p className="font-serif italic text-amber-300">Ya Devi sarva bhutesu Shanti rupena samsthita</p>
                <p className="font-serif italic text-amber-300">Namestasyai Namestasyai Namestasyai Namoh Namah</p>
              </div>
              
              <div className="space-y-2 border-l-2 border-amber-500/30 pl-6">
                <p className="text-sm">The goddess who is omnipresent as the personification of universal mother</p>
                <p className="text-sm">The goddess who is omnipresent as the embodiment of power</p>
                <p className="text-sm">The goddess who is omnipresent as the symbol of peace</p>
                <p className="text-sm">I bow to her, I bow to her, I bow to her</p>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-400 italic">
              Mahalaya is also a kind of invocation or invitation to the mother goddess to descend on earth through the chanting of mantras and singing devotional songs - &quot;Jago Tumi Jago&quot;.
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-bold text-white mb-4 font-serif">Mahalaya Torpon</h4>
            <p>
              On this day, people go to the holy Ganges which becomes a sea of humanity to perform ‘Tarpon’ or ‘Torpon’ and pay respect to their departed fathers and ancestors for the departed souls in various types such as ‘Pitri Tarpon’, ‘Matri Tarpon’, and ‘Deb Tarpon’ in empty stomach. Devotees and worshipers buy new clothes and sweets to offer to their ancestors.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'recipes') {
    const recipesData = [
      { name: "Aloo Posto", url: "/info/aloo-posto", isInternal: true },
      { name: "Bandhakopir Dalna", url: "/info/bandhakopir-dalna", isInternal: true },
      { name: "Cholar Dal", url: "/info/cholar-dal", isInternal: true },
      { name: "Daab Chingri", url: "/info/daab-chingri", isInternal: true },
      { name: "Dal Prawn Chop", url: "/info/dal-prawn-chop", isInternal: true },
      { name: "Deemer Devil (Egg Devil Chop)", url: "/info/deemer-devil", isInternal: true },
      { name: "Dhokar Dalna", url: "/info/dhokar-dalna", isInternal: true },
      { name: "Doi Maach (Fish)", url: "/info/doi-maach", isInternal: true },
      { name: "Ilish Bhapa", url: "/info/ilish-bhapa", isInternal: true },
      { name: "Labra", url: "/info/labra", isInternal: true },
      { name: "Luchi", url: "/info/luchi", isInternal: true },
      { name: "Machh Potoler Dorma", url: "/info/machh-potoler-dorma", isInternal: true }
    ];

    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Durga Puja Traditional Recipes
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Durga Puja is a festival which celebrates the victory of good over evil. Surely, it is the main festival of Bengali&apos;s but it is celebrated all over the world. The 5 days of Durga Puja, starts from ‘Shashti’ and ends on ‘Dashami’, has a great significance in every Bengali&apos;s life. Durga Puja is all about food, new clothes, dance, music and get-together.
          </p>

          <p>
            There are a variety of dishes which are prepared and relished during the Puja season. From sweet to savoury, vegetarian to non-vegetarian, you can find all the tastes in Durga Puja recipes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {recipesData.map((recipe, idx) => {
              const isInternal = (recipe as any).isInternal;
              if (isInternal) {
                return (
                  <Link 
                    key={idx} 
                    href={recipe.url} 
                    className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-amber-500 group-hover:text-amber-400 font-serif">{recipe.name}</span>
                  </Link>
                );
              }
              return (
                <a 
                  key={idx} 
                  href={recipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-amber-500 group-hover:text-amber-400 font-serif">{recipe.name}</span>
                  <ExternalLink size={16} className="text-amber-500/50 group-hover:text-amber-400" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (slug === 'durga-aarti') {
    const aartiStanzas = [
      {
        id: 1,
        verses: [
          "Jai ambe gaurii maiyaa",
          "Jai shyaamaa gaurii Nishadina tumako dhyaavata,",
          "Hari brahma shivajii"
        ],
        meaning: "\"Glory to you, O divine Mother Gauri, glory to you, O Parvati, who are so rich in maiden grace (virgin beauty), the object of daily meditation by Vishnu, Brahma and Shiva!\""
      },
      {
        id: 2,
        verses: [
          "Maanga sinduura viraajata",
          "Tiko mriga madako Ujjvalase dauu nainaa",
          "Chandravana niiko"
        ],
        meaning: "\"O Ambe! On your forehead is a resplendent mark of vermilion along with a mark of musk (signifying good luck). Your twin eyes are bright and your face beautiful as the moon.\""
      },
      {
        id: 3,
        verses: [
          "Kanaka samaana kalevara",
          "Raktaambara raaje Raktapushpa galamaalaa",
          "Kanthahaara saaje"
        ],
        meaning: "\"Your body with a tinge of gold is splendidly dressed in red attire; on your throat lies a wreath of red blossoms like a beautiful necklace.\""
      },
      {
        id: 4,
        verses: [
          "Kehari vaahana raajata",
          "Khadaga khappara dhaari Sura nara munijana sevata",
          "Tinake dukha haari"
        ],
        meaning: "\"Your vehicle, the lion, is, O Mother in keeping with your splendid form; you bear a sword and a skull in your hands, and on you attend the gods, men, hermits and your votaries whose grief you drive away.\""
      },
      {
        id: 5,
        verses: [
          "Kaanana kunadala shobhita",
          "Naasaagre motii Kotika chandra divaakara",
          "Sam raajata jyotii"
        ],
        meaning: "\"You are adorned with rings on your ears and with pearl on the tip of your nose, your radiance looks as splendid as that of myriad of suns and moons.\""
      },
      {
        id: 6,
        verses: [
          "Shumbha nishumbha bidaare",
          "Mahishaasura ghaatii Dhuumra vilochana nainaa",
          "Nishadina madamaatii"
        ],
        meaning: "\"O slayer of the demon Mahisha, you tore apart the bodies of Shumbha, Nishumbha and Dhuumravilochana. (In the battle waged against them) your eyes reflected a frenzy of fury everyday and night.\""
      },
      {
        id: 7,
        verses: [
          "Brahmaanii rudraanii",
          "Tuma kamalaa raanii Aagama-nigama bakhaanii",
          "Tuma shiva pataraanii"
        ],
        meaning: "\"You are the beloved consort of Brahma, Rudra and Vishnu. The Vedas and the Shastras describe you as the queen consort of Shiva\""
      },
      {
        id: 8,
        verses: [
          "Chausatha yoginii gaavata",
          "Nritya karata bhairon Baajata taala mridanga",
          "Aura baajata damaruu"
        ],
        meaning: "\"Sixty-four Yoginis chorus your praise and glorify you, while Bhairava (Shiva) dances in tune to the accompaniment of the sound of tambour (mridanga) and drum (damaru).\""
      },
      {
        id: 9,
        verses: [
          "Tuma ho jaga kii maataa",
          "Tuma hii ho bhartaa Bhaktana kii dukha hartaa",
          "Sukha sampati kartaa"
        ],
        meaning: "\"You are mother of the universe, its sustainer, reliever of your devotees' affliction and bestower of happiness and prosperity.\""
      },
      {
        id: 10,
        verses: [
          "Bhujaa chaara ati shobhita",
          "Vara mudraa dhaarii Manavaanchita phala paavata",
          "Sevata nara naarii"
        ],
        meaning: "\"The four arms you have adorned your person, while the hand raised in benediction reveals your benign aspect. Those among men and women who wait on you and worship you have all their cherished wishes ever fulfilled.\""
      },
      {
        id: 11,
        verses: [
          "Kanchana thaala viraajata",
          "Agaru kapuura baatii Bhaalaketu mein raajata",
          "Kotiratana jyoti"
        ],
        meaning: "\"In a golden platter are beautifully laid aloe and camphor, both of which have lighted (to be waved before you); in he radiance of your forehead is reflected the splendour of a myriad gems.\""
      }
    ];

    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Meaning of Durga Aarti
        </h3>
        
        <div className="space-y-12 mt-8">
          {aartiStanzas.map((stanza) => (
            <div key={stanza.id} className="relative bg-amber-500/5 p-8 rounded-2xl border border-amber-500/10">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-500 text-black rounded-full flex items-center justify-center font-bold text-lg font-serif">
                {stanza.id}
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  {stanza.verses.map((verse, vIdx) => (
                    <p key={vIdx} className="font-hindi text-amber-300/90 text-lg leading-relaxed">{verse}</p>
                  ))}
                </div>
                
                <div className="border-l-2 border-amber-500/20 pl-6 flex items-center">
                  <div>
                    <h5 className="text-xs uppercase tracking-wider text-amber-500/50 font-bold mb-2">Meaning</h5>
                    <p className="text-gray-300 font-light italic leading-relaxed">{stanza.meaning}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (slug === 'aloo-posto') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Aloo Posto Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Aloo Posto is an authentic Bengali dish where aloo (Potatoes) are cooked with poppy seeds. This is one of the popular dish of West Bengal and is enjoyed with steamed rice, roti etc. along with a dal on the side.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>4 Potatoes</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 cup Oil</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>6 Green Chillies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Bay leafs</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Turmeric Powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Tbsp Poppy Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt to taste</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Boil, peel and cut the potatoes into thick cubes. Set aside for later use.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Grind poppy seeds, three green chilies, turmeric powder and salt in a mixer grinder, to form a thick paste.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Mix the ground paste with 1 tablespoon of water. Now, smear the paste onto the potato cubes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Heat the oil. First, fry the bayleafs and chillies.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Next, add the potatoes and fry on low heat, stirring all the while.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Fry the potatoes on medium flame first, then on simmer, as the oil gets heated up. After frying the potatoes until golden brown, drain the oil and then remove them off the flame.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Serve aloo posto hot, with rice and dal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'daab-chingri') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Daab Chingri Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Daab Chingri (ডাব চিংড়ি), also known as Chingri Daab (চিংড়ি ডাব) is a popular Bengali dish. It is a Bengali prawn curry, cooked and served in green coconut. Apart from Durga Puja, it is often cooked during Pohela Boishakh, Raksha Bandhan etc.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Prawns - 750 gm, small, peeled (with tails on)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onions - 2, sliced</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt - 1 tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Haldi (turmeric) - ½ tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Green chillies - 3-4, slit</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Coconut milk - 1 cup</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Mustard seeds - 1 tbsp, soaked and ground</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Mustard oil - 2 tbsp, sharp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Green coconut - 1 tender, drained</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Dough - to support coconut</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Except for oil and green coconut, mix all ingredients and stuff into the coconut. Drizzle in oil. If top has been chopped off in one piece, you can put it back as a &quot;lid&quot;.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Set coconut on turntable of microwave oven, supported by dough ring. Cook on Medium (70-80 percent power) for 20 minutes. Let it stand for 5 minutes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Carefully remove the coconut from the dough base and place it on a large serving platter - let it tilt and fall open.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Serve with rice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'dhokar-dalna') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Dhokar Dalna Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Dhokar Dalna is one of the oldest Bengali recipe. It is a yummy treat for those who miss their Bengali roots. In Bengalis, Dhoka literally means the fried chana dal cake / paatice which is then dipped in a thick delicious tomato-onion paste, and so the name Dhokar Dalna.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Chana Dal: 200 gm</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onion: 1 large</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Chilli Powder: 1/2 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt: 1/2 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Oil: 2 cups</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onion: 2 small (paste)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Turmeric: 1 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Chilli (Green paste): 1/4 tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Sugar: 1/2 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Tomato: 2 chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Ghee: 1 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span className="leading-tight">Garam masala: 1 tbsp</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Soak the dal in water overnight. Sieve out the water. Grind dal to a fine paste, preferably in a mixie.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Add the spices and chilly paste with the dal.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Heat oil in a deep-bottomed pan. Add dal paste and deep fry.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Pour the mixture over a saucer smeared with oil or ghee. Iron the surface evenly. Let it cool off. Cut the cake in diamond shapes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Heat the oil in a deep bottomed pan and fry the diamonds well. Free them from excess oil.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Add the paste of spices comprising ginger, onion, turmeric and chilli. Add salt, sugar and tomato. Stir the whole mixture thoroughly. Add some water to make it a thick curry.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Add fried diamonds to it and cook for a few minutes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">8</div>
                  <p>Sprinkle drops of ghee and pasted garam masala over the top.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">9</div>
                  <p>Serve it hot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'labra') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Labra Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Labra is a Bengali mixed vegetable dish where different varieties of vegetables are cooked together with minimum spices. It is a very basic and simple Bengali vegetarian dish, where the ingredients &apos;Panchforon&apos; (the five spices) play the magic role behind its deliciousness. On many Bengali Puja occasions, Labra is served during lunch time along with Khichuri.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>100 gm Brinjals</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>100 gm Pumpkin</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>100 gm Sweet potatoes</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 Raw banana</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Potatoes</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>3 tbsp Mustard oil</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp Corainder Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Cumin Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Fennel Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>5 Red Chilies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 inch Ginger</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Turmeric powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tsp Sugar</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp Ghee</span></li>
              </ul>
              <h5 className="font-bold text-amber-500/80 mt-6 mb-3 uppercase text-sm tracking-wider">To Be Mixed Together</h5>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Mustard Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Cumin Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Fenugreek Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Black Cumin Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 tsp Fennel Seeds</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Cut the vegetables into medium size pieces.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Powder the corainder, cumin and fennel seeds, and red chillis finely.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Heat oil, add the crushed ginger and fry lightly.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Add the mixed spices called &apos;panch phoran&apos; and stir fry for a minute.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Add vegetables, fry well, cover and cook for 10-15 minutes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Add turmeric powder, salt, and one cup of water. Simmer the flame and cook until vegetables are done.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Add the powdered spices, sugar and stir well. Cook for another few minutes adding ghee.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">8</div>
                  <p>Serve hot with rice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'bandhakopir-dalna') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Bandhakopir Dalna Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Bandhakopir Dalna is a dry curry made of cabbage (thinly sliced), cutted potatoes in cubes and green peas cooked with dry spices. This Bengali style Bandhakopir Dalna or Cabbage curry is a vegetarian dish which is included in weekly meal plans in most Bengali families.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 lb Cabbage, sliced finely</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Potatoes, cut in small cubes</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 tbsp Oil</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp Turmeric</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 1/4 to 2 tsp Green Chili Paste</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp ground Cumin</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tsp ground Coriander</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 inch Ginger, grated</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp Butter</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Bay Leaves</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Garam Masala</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt to taste</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Sugar to taste</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Fry cubed potatoes in hot oil in a wok, until lightly browned. Remove the potatoes from oil and keep aside.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>To the hot oil, add cabbage. Sprinkle with salt.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Stir the cabbage well and then and cover with a lid. Cook the cabbage over simmer for about 3-4 minutes, with the cover removed.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Add turmeric powder, chili paste, cumin, coriander and ginger to the cabbage. Stir and fry until the spices are well blended with the cabbage.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>The cabbage should be nearly cooked at this stage.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Add 1/2 cup water, the potatoes, fold in salt and sugar to taste.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Simmer over medium heat until potatoes are cooked and there is practically no gravy in the pan.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">8</div>
                  <p>In a frying pan, heat butter. Add the bay leaves and garam masala. Stir fry a couple of minutes and pour over bandhakopir dalna.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">9</div>
                  <p>Stir the cabbage and remove from heat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'dal-prawn-chop') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Dal Prawn Chop Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            One of the most popular Durga Puja Traditional Recipe is Dal Prawn Chop. Check out the Ingredients and Method of cooking Dal Prawn Chop.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Shrimp: 200g</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>ArharDal: 200g</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onion: 3 large (finely chopped)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Ginger: 2 teaspoon (chopped)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Green chilli: 2 teaspoon (chopped)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt: according to Your choice</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Turmeric: 1 pinch of twizers</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Coriander leaf: 3 tablespoons (finely chopped)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Oil: for frying</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Soak dal in water for 2-3 hours.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Grind it in mixie to a fine paste.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Shell the shrimps and wash them thoroughly with hot water.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Take the paste of dal, shrimps, onions, ginger, chilli, salt, turmeric and coriander leaf. Make a good mixture of them.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Heat oil in a deep bottomed frying pan.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Make globes of the mixture-paste and drop them in heated oil. Fry them until they turn red-brown.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Serve them hot with sauce.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'doi-maach') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Doi Machh Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Doi Maach is a Bengali recipe, prepared on all traditional occasion including Durga Puja and marriage. Doi Maach is a well known Bengal dish and is hugely prepared in state of West Bengal.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>500 gms fish, de-scaled and cleaned</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>100 gms of mustard oil or cooking oil</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>4 cloves</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>4 small cardamoms</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 inch pieces cinnamon</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 bay leaves</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 inch ginger</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 small bulb garlic</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 tsp turmeric powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tsp red chili powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>100 grams of sour curds / yogurt</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt and sugar to taste</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>A few green chillies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 tsp clarified butter (ghee)</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Clean and wash the fish pieces thoroughly, and cut it into squares or rectangles of around 4 inches dimension. Wipe dry.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Smear 1 tsp turmeric and a little salt to the pieces. Keep aside.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Grind the onion, garlic, and ginger till turns into a smooth paste. Keep aside.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Beat the sour curds/yogurt with half cup of water till smooth and set aside.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Heat oil to smoking.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Lightly fry the fish pieces and keep aside. In the heated oil, now, add the cloves, cardamom, and cinnamon. Then add the ground paste of onion, garlic, and ginger. Fry lightly till the spices are browned.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Now mix the remaining one teaspoon of turmeric powder and the red chili powder with three teaspoons of water and add to the frying paste. Fry again. Stir to prevent the spices from sticking to the pan.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">8</div>
                  <p>Now add to this the beaten sour curds. Stir the mixture and add one more cup of water.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">9</div>
                  <p>Now add salt to taste and a teaspoon of sugar or less if you want. Add the green chilies and cook a while till the excess water begins to dry up and till the gravy comes to a boil.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">10</div>
                  <p>Next gently add the fried fish pieces let it cook on high heat till the oil separates and floats on top. Before taking off from the fire add the clarified butter.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">11</div>
                  <p>Serve Dahi Mach hot with rice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'luchi') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Luchi Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Luchi (Bengali: লুচি) is a deep-fried flatbread, made of plain flour (not wheat flour) and looks completely white. To make luchis, a dough is prepared by mixing fine maida flour with water and a spoonful of ghee, which is then divided into small balls. These balls are flattened using a rolling pin and individually deep-fried in cooking oil or ghee.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Wheat Flour - 500gms</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Refined oil or Ghee - 2 table spoon</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt according to taste</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Warm water to knead the flour</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Oil to fry</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Knead 500gms of flour, 2 tbsp of oil & salt according to taste with warm water.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Make small doughs.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Flatten them into round circular form.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Fry them one by one. Serve hot with other side dish.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'cholar-dal') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Cholar Dal Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Cholar Dal is a traditional Bengali dish prepared from bengal gram or Chana Dal and is best paired with luchi or steamed rice. The dal is slightly sweet and fragrant due to the addition of whole spices.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 cup Split Bengal Gram</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 cup Turmeric Powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Dry Red Chilies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>3 Cloves</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Cinnamon Sticks</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Cardamom Powder</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/2 tsp Cumin Seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 inch Ginger</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2 Green Chilies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>3 tsp Oil</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tbsp Fresh Coconut, grated</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tsp Sugar</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt to taste</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Soak the split Bengal gram in water for one hour.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Cook the dal in a pressure cooker, with cloves, cinnamon sticks, turmeric powder, sugar, cardamom powder and salt.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Heat oil in a pan, add cumin seeds and let them splutter.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Add the red chilies, chopped green chilies and ginger.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Fry for 2-3 minutes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Add the seasonings to the boiled dal and mix well.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">7</div>
                  <p>Cook for another 10 minutes.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">8</div>
                  <p>Garnish with fresh coconut and serve hot with rice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'deemer-devil') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Deemer Devil (Egg Devil Chop) Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Deemer Devil (Egg Devil) are made with half hard boiled eggs, wrapped with potato mixture, dipped in batter, coated with bread crumbs and then deep fried.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Oil - 3 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onions - 2 small (about 150gm), finely chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Ginger paste - ½ tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Garlic - 2 cloves, finely chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Keema - 250gm, fine-minced</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Green chillies - 2, finely chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 tsp haldi (turmeric)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Tomatoes - 2 small, chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Garam masala powder - ½ tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Potatoes - 10 large floury, boiled, peeled and mashed</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Eggs - 4, hardboiled and halved, plus 1 egg, lightly beaten</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Flour - 1 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Breadcrumbs - 1 cup, toasted</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Heat 1 tbsp oil and deep-fry the onions for about 2-3 minutes till they turn translucent. Put in garlic and ginger paste. Blend in keema, chillies and haldi; continue to deep-fry for about 5 minutes, stirring to break up lumps, until keema starts to turn brown-coloured. Add tomatoes and continue to cook for another 5 minutes, or till moist but quite sticky.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Rub potatoes with salt.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Cut the eggs in half. Taking each half of egg, mould keema mixture against it to fill in the &quot;missing half&quot;. Enclose in a layer of mashed potato to add about ½ inch thickness throughout. Keep to one side.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>When ready to serve, mix flour into the beaten egg. Heat the remaining oil; pour out breadcrumbs onto a large flat plate. Quickly roll each devil in the mixture and then in crumbs to coat, and fry 2-3 at a time till it turns golden brown. Turn over as needed. Remove with slotted spoon and drain on kitchen paper.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Serve hot with ketchup or with Kasundi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'ilish-bhapa') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Ilish Bhapa Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            Ilish Bhapa is a famous Bengali dish made from hilsa or Tenualosa ilisha, cooked in mustard gravy. The dish is popular among the people in West Bengal.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>6-8 pieces from a large Hilsa fish</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1 1/2 tbsp mustard seeds</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>2-3 green chilies</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>1/4 grated coconut</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>A pinch of turmeric</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Mustard oil for frying</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Coriander leaves for garnishing</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt to taste</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Mix mustard seeds, green chilies, salt and make into a paste.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Mix this paste with mustard oil, and turmeric.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Take fish slices and cover them with the above paste.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Put them in a greased dish, cover and cook over steam. This procedure can also be done in a pressure cooker.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">5</div>
                  <p>Steam this until mustard gives off a sharp aroma.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">6</div>
                  <p>Remove and sprinkle a little chopped coriander leaves and serve with hot rice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (slug === 'machh-potoler-dorma') {
    content = (
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <Link href="/info/recipes" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 font-medium text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to Recipes
        </Link>
        <h3 className="text-3xl font-bold mb-6 text-amber-500 font-serif border-b border-amber-500/20 pb-4">
          Machh Potoler Dorma Recipe
        </h3>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
          <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            One of the most popular Durga Puja Traditional Recipe is Machh Potoler Dorma. Check out the Ingredients and Method of cooking Machh Potoler Dorma.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-1 bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-bold text-amber-500 mb-4 font-serif">Ingredients</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Rohu fish - 150gm</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Salt to taste</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Haldi (turmeric) - ¼ tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Oil - 2 tbsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Tejpatta (bay leaf) - 1, small</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Onion - 1 small, chopped</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Ginger paste - 2 tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Green chilli - 1, chopped (optional)</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Bengali garam masala powder - ½ tsp</span></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span>Parwal (wax gourds) - 8-10 large &amp; mature</span></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-white mb-4 font-serif">Method of Cooking</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Rub fish with salt and haldi. Steam for about 5-7 minutes until cooked. Set aside to cool while you prepare parwals.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">2</div>
                  <p>De-bone the fish and discard the skin. Mash the flesh.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">3</div>
                  <p>Heat 2 tsp oil, add tejpatta and deep-fry onions, ginger paste and green chillies till onions turn translucent, about 2-3 minutes. Add to fish and mash all together with garam masala to make stuffing.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">4</div>
                  <p>Fill the parwals with the fish stuffing, popping back the stem ends to seal if liked. Saute in hot oil till it turns golden. Serve hot as a snack or to accompany rice and dal for a &quot;simple&quot; but elegant lunch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md min-h-[40vh] flex flex-col items-center justify-center text-center mt-8">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Content Processing</h3>
        <p className="text-gray-400 max-w-lg mb-8">
          Our AI agents are currently indexing and organizing the comprehensive information for <strong>{option?.label}</strong> from Indian Festival Diary. 
          This section will be available natively very soon.
        </p>
        
        <a 
          href={option?.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
        >
          Read Original Source on Indian Festival Diary <ExternalLink size={18} />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#450a0a]/30 to-black pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-8 font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back to Festival Explorer
        </Link>
        
        {option?.label && <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4 drop-shadow-md">{option.label}</h1>}
        
        {content}
      </div>
    </div>
  );
}
