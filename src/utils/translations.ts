import type { Language } from '../types/game';

export const translations = {
  ar: {
    appTitle: 'دليلك ملاك',
    appSubtitle: 'اللعبة التونسية الشهيرة - وضع المضيف والجمهور',
    hostMode: 'لوحة تحكم المضيف',
    playMode: 'شاشة اللعب المباشر',
    soundOn: 'الصوت مشغّل',
    soundOff: 'الصوت مكتوم',
    langToggle: 'Français',
    
    // Host Setup
    setupHeading: '⚙️ إعداد الصناديق والجوائز (خاص بالمضيف)',
    setupNotice: 'أنت المضيف: اختر عدد الصناديق وحدد بدقة ما تخفيه في كل صندوق. يمكنك كتابة مبالغ أو هدايا عينية أو مفاجآت مضحكة!',
    quickPlayNow: 'ابدأ اللعبة فوراً',
    readyToPlaySub: 'التشكيلة الرسمية التونسية جاهزة بنقرة واحدة!',
    customizePrizesBtn: '⚙️ تخصيص وتعديل الجوائز يدوياً (اختياري للمضيف)',
    customizePrizesSub: 'انقر هنا لتعديل المبالغ، كتابة هدايا خاصة، أو اختيار عدد مخصص',
    hideCustomizationBtn: '▲ إخفاء لوحة التخصيص',
    totalPrizesValue: 'مجموع الجوائز:',
    resetDefaults: '🔄 استعادة الجوائز الأصلية',
    shuffleShort: '🎲 خلط الصناديق عشوائياً',
    presetPicks: 'خيارات سريعة:',
    customCount: 'أو عدد مخصص (4 - 30):',
    loadTunisianPresets: '💡 تعبئة جوائز دليلك ملاك الأصلية:',
    chestsCountLabel: 'صندوقاً',
    shuffleBtn: '🎲 خلط أماكن الجوائز عشوائياً',
    shuffledAlert: 'تم خلط أماكن الجوائز في الصناديق بنجاح!',
    savePresetBtn: '💾 حفظ هذه التشكيلة',
    loadPresetBtn: '📂 استرجاع التشكيلة المحفوظة',
    presetSaved: 'تم حفظ التشكيلة بنجاح في المتصفح!',
    presetLoaded: 'تم استرجاع التشكيلة المحفوظة بنجاح!',
    noPresetFound: 'لم يتم العثور على تشكيلة محفوظة سابقة.',
    startGameBtn: '▶ ابدأ اللعبة الآن',
    chestNumber: 'صندوق رقم',
    prizePlaceholder: 'اكتب الجائزة (مثلاً: 5000 دينار، iPhone، كردونة...)',
    detectedNumeric: 'القيمة المحسوبة:',
    noNumeric: 'هدية عينية (0 د.ت في عرض البنكار)',
    endGameBtn: '⏹ إنهاء اللعبة / عودة للإعدادات',
    confirmEndGame: 'هل أنت متأكد من إنهاء اللعبة الحالية والعودة لصفحة الإعدادات؟ ستفقد التقدم الحالي.',
    
    // Play Mode
    pickYourBoxTitle: '🌟 مرحلة البداية: اختر صندوق حظك',
    pickYourBoxSubtitle: 'انقر على صندوق واحد من الشاشة ليكون صندوقك الخاص طوال السهرة!',
    yourBox: 'صندوقك الخاص',
    boxNumber: 'صندوق',
    roundTitle: 'الجولة',
    eliminationInstruction: 'افتح {count} صناديق من الشبكة لتصفية الجوائز',
    remainingInRound: 'متبقي {count} صناديق للافتحها في هذه الجولة',
    boxOpeningSuspense: 'جاري فتح الصندوق... ترقبوا!',
    openedBadge: 'مفتوح',
    
    // Banker Offer Modal
    bankerTitle: '📞 اتصال البنكار!',
    bankerCalling: 'البنكار يطلب على الخط الأحمر...',
    bankerQuote: '«بعد مشاهدة الصناديق المتبقية، ها هو اقتراحي النهائي لهذه الجولة...»',
    bankerOfferLabel: 'عرض البنكار المالي:',
    dinars: 'دينار تونسي',
    dealBtn: '✅ قبول العرض (ديل / Deal)',
    noDealBtn: '❌ نلعب (نو ديل / No Deal)',
    offerHistory: 'سجل عروض البنكار السابقة:',
    
    // Final 2 Chests Standoff
    finalStandoffTitle: '⚡ المواجهة الحاسمة: الصندوقان الأخيران!',
    finalStandoffDesc: 'بقي في اللعبة صندوقان فقط: صندوقك الذي اخترته في البداية، وصندوق آخر على الطاولة.',
    swapQuestion: 'القرار بين يديك الآن: هل تبدل صندوقك أم تبقى فيه؟',
    swapBtn: '🔄 بدّل الصندوق (خذ الصندوق الآخر)',
    keepBtn: '🔒 نبقى في صندوقي (تمسك باختيارك)',
    
    // Result Screen
    congratsTitle: '🎉 نتيجة اللعبة ونهاية المشوار!',
    dealWonNotice: 'أحسنت الاختيار! قبلت عرض البنكار وفزت بمبلغ:',
    boxWonNotice: 'مبروك! فتحت صندوقك النهائي وفزت بـ:',
    yourOriginalBoxWas: 'صندوقك الأصلي كان يحمل:',
    theOtherBoxWas: 'الصندوق الآخر كان يحمل:',
    allBoxesRevealTitle: 'كشف جميع الصناديق (للمصداقية والفضول):',
    playAgainBtn: '🔁 لعبة جديدة (العودة للإعدادات)',
    
    // Prize Board
    prizeBoardTitle: 'جدول الجوائز',
    eliminatedPrizes: 'الجوائز التي خرجت',
    remainingPrizes: 'الجوائز التي ما زالت في اللعبة',
  },
  fr: {
    appTitle: 'Dlilek Mlak',
    appSubtitle: 'Le célèbre jeu télévisé tunisien - Mode Hôte & Public',
    hostMode: 'Panneau Hôte',
    playMode: 'Plateau de Jeu',
    soundOn: 'Son activé',
    soundOff: 'Son muet',
    langToggle: 'العربية',
    
    // Host Setup
    setupHeading: '⚙️ Configuration des Boîtes & Prix (Réservé à l\'Hôte)',
    setupNotice: 'En tant qu\'hôte, choisissez le nombre de boîtes et définissez librement le contenu secret de chacune (sommes en dinars, cadeaux, ou objets surprises !).',
    quickPlayNow: 'Lancer la Partie Directement',
    readyToPlaySub: 'Version officielle tunisienne prête à jouer en un seul clic !',
    customizePrizesBtn: '⚙️ Personnaliser les boîtes et les prix (Optionnel)',
    customizePrizesSub: 'Cliquez ici pour modifier les montants, ajouter des cadeaux ou sauvegarder un set',
    hideCustomizationBtn: '▲ Masquer la personnalisation',
    totalPrizesValue: 'Total des prix :',
    resetDefaults: '🔄 Rétablir les prix originaux',
    shuffleShort: '🎲 Mélanger aléatoirement',
    presetPicks: 'Formats rapides :',
    customCount: 'Ou nombre personnalisé (4 - 30) :',
    loadTunisianPresets: '💡 Charger les prix cultes de Dlilek Mlak :',
    chestsCountLabel: 'boîtes',
    shuffleBtn: '🎲 Mélanger les positions aléatoirement',
    shuffledAlert: 'Les contenus des boîtes ont été mélangés avec succès !',
    savePresetBtn: '💾 Sauvegarder ce set',
    loadPresetBtn: '📂 Charger le set sauvegardé',
    presetSaved: 'Configuration enregistrée avec succès dans le navigateur !',
    presetLoaded: 'Configuration chargée avec succès !',
    noPresetFound: 'Aucune configuration sauvegardée trouvée.',
    startGameBtn: '▶ Lancer le Jeu Maintenant',
    chestNumber: 'Boîte N°',
    prizePlaceholder: 'Contenu du prix (ex: 5000 Dinars, iPhone, Boîte vide...)',
    detectedNumeric: 'Valeur calculée :',
    noNumeric: 'Cadeau matériel (0 DT pour la banque)',
    endGameBtn: '⏹ Quitter la partie / Retour au Setup',
    confirmEndGame: 'Êtes-vous sûr de vouloir abandonner la partie en cours et revenir aux réglages ?',
    
    // Play Mode
    pickYourBoxTitle: '🌟 Première Étape : Choisissez Votre Boîte Porte-Bonheur',
    pickYourBoxSubtitle: 'Cliquez sur l\'une des boîtes ci-dessous pour la mettre de côté comme votre boîte personnelle !',
    yourBox: 'Votre Boîte',
    boxNumber: 'Boîte',
    roundTitle: 'Tour',
    eliminationInstruction: 'Ouvrez {count} boîtes de la grille pour éliminer les prix',
    remainingInRound: 'Il reste {count} boîte(s) à ouvrir dans ce tour',
    boxOpeningSuspense: 'Ouverture de la boîte en cours... Suspense !',
    openedBadge: 'Ouverte',
    
    // Banker Offer Modal
    bankerTitle: '📞 Appel du Banquier !',
    bankerCalling: 'Le banquier est au bout du fil...',
    bankerQuote: '« Au vu des boîtes restantes sur le plateau, voici ma proposition ferme pour ce tour... »',
    bankerOfferLabel: 'Offre de la Banque :',
    dinars: 'Dinars Tunisiens',
    dealBtn: '✅ DEAL (Accepter l\'offre)',
    noDealBtn: '❌ NO DEAL (Continuer le jeu)',
    offerHistory: 'Historique des offres du banquier :',
    
    // Final 2 Chests Standoff
    finalStandoffTitle: '⚡ Face-à-Face Final : Les 2 Dernières Boîtes !',
    finalStandoffDesc: 'Il ne reste plus que deux boîtes en jeu : votre boîte initiale et la dernière boîte sur le plateau.',
    swapQuestion: 'C\'est votre ultime décision : souhaitez-vous échanger ou garder votre boîte ?',
    swapBtn: '🔄 Échanger (Prendre l\'autre boîte)',
    keepBtn: '🔒 Garder (Conserver ma boîte)',
    
    // Result Screen
    congratsTitle: '🎉 Dénouement du Jeu !',
    dealWonNotice: 'Bien joué ! Vous avez accepté l\'offre du banquier et repartez avec :',
    boxWonNotice: 'Félicitations ! Vous repartez avec le contenu de votre boîte finale :',
    yourOriginalBoxWas: 'Votre boîte initiale contenait :',
    theOtherBoxWas: 'L\'autre boîte contenait :',
    allBoxesRevealTitle: 'Révélation de toutes les boîtes (pour les curieux) :',
    playAgainBtn: '🔁 Nouvelle Partie (Retour au Setup)',
    
    // Prize Board
    prizeBoardTitle: 'Tableau des Prix',
    eliminatedPrizes: 'Prix Éliminés',
    remainingPrizes: 'Prix encore en jeu',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang];
}
