import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'fr' | 'en';

// ── Translation dictionaries ─────────────────────────────────

const fr = {
  // Header
  'header.tempo': 'EDF Tempo',
  'header.blue': 'EDF Bleu',
  'header.blueHCHP': 'Bleu HC/HP',

  // Current Day
  'now.title': 'En ce moment',
  'now.today': "Aujourd'hui",
  'now.tomorrow': 'Demain',
  'now.blueDay': 'Jour bleu',
  'now.whiteDay': 'Jour blanc',
  'now.redDay': 'Jour rouge',
  'now.unknown': 'Indéterminé',
  'now.info': 'La couleur du lendemain est actualisée tous les jours dès 6h30.',
  'now.hours': 'Heures Pleines : 6h - 22h  |  Heures Creuses : 22h - 6h',

  // Remaining
  'rem.title': 'Jours restants',
  'rem.period': 'Période du 1er septembre 2025 au 31 août 2026',
  'rem.blue': 'Jours bleus',
  'rem.white': 'Jours blancs',
  'rem.red': 'Jours rouges',
  'rem.remaining_one': 'restant',
  'rem.remaining_other': 'restants',
  'rem.loading': 'Chargement...',

  // Simulator
  'sim.title': 'Simulateur',
  'sim.subtitle': 'Combien coûte la charge de votre véhicule ?',
  'sim.subtitleSmall': 'Comparez le coût selon votre tarif Tempo',
  'sim.tariffLabel': 'Tarif Tempo sélectionné',
  'sim.bleuHC': 'Bleu HC',
  'sim.bleuHP': 'Bleu HP',
  'sim.blancHC': 'Blanc HC',
  'sim.blancHP': 'Blanc HP',
  'sim.rougeHC': 'Rouge HC',
  'sim.rougeHP': 'Rouge HP',
  'sim.edfBase': 'EDF Bleu Base',
  'sim.edfHC': 'EDF Bleu HC',
  'sim.savingsTitle': '💰 Économie',
  'sim.overcostTitle': '⚠️ Surcoût',
  'sim.less': 'de moins',
  'sim.more': 'de plus',
  'sim.vsBase': 'vs EDF Bleu Base pour',
  'sim.nightCharge': 'de charge',
  'sim.evExamples': 'Exemples de charge EV',

  // Calendar
  'cal.title': 'Historique',
  'cal.blue': 'Bleu',
  'cal.white': 'Blanc',
  'cal.red': 'Rouge',
  'cal.unknown': 'Inconnu',
  'cal.loading': 'Chargement...',
  'cal.months': 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
  'cal.days': 'L,M,M,J,V,S,D',

  // Price Comparison
  'price.title': 'Comparaison des tarifs',
  'price.subtitle': 'Tempo vs EDF Bleu Base',
  'price.blueDay': 'Jour Bleu',
  'price.whiteDay': 'Jour Blanc',
  'price.redDay': 'Jour Rouge',
  'price.peak': 'Heures Pleines (6h-22h)',
  'price.offPeak': 'Heures Creuses (22h-6h)',
  'price.ref': 'EDF Bleu Base (réf.)',
  'price.avgSaving': '💰 Économie moyenne',
  'price.avgOvercost': '⚠️ Surcoût moyen',
  'price.weighted': 'Moyenne pondérée (16h HP + 8h HC par jour)',
  'price.detailedGrid': 'Grille tarifaire détaillée',
  'price.color': 'Couleur',
  'price.footnote': 'en € TTC / kWh',

  // Blue Subscription
  'blue.currentRate': 'Votre tarif actuel',
  'blue.option': 'Option Base - 6 kVA',
  'blue.unit': '€/kWh TTC',
  'blue.rateNote': 'Tarif unique 24h/24, 7j/7 — pas de distinction HP/HC',
  'blue.advTitle': '✅ Avantages EDF Bleu',
  'blue.adv1': '• Prix fixe et prévisible toute l\'année',
  'blue.adv2': '• Pas de jours rouges à tarif élevé',
  'blue.adv3': '• Aucune adaptation de consommation nécessaire',
  'blue.switchTitle': 'Et si vous passiez à Tempo ?',
  'blue.compTitle': 'Comparaison avec votre tarif Bleu Base',
  'blue.youSave': 'Vous économisez',
  'blue.overcost': 'Surcoût Tempo',
  'blue.tempoAvg': 'Tempo moy.',
  'blue.vs': 'vs Bleu',
  'blue.blueDays': 'Jours Bleus (300j/an)',
  'blue.whiteDays': 'Jours Blancs (43j/an)',
  'blue.redDays': 'Jours Rouges (22j/an)',
  'blue.tipTitle': '💡 Conseil',
  'blue.tipText': 'Avec Tempo, vous économisez les 300 jours bleus mais payez beaucoup plus les 22 jours rouges. L\'offre est intéressante si vous pouvez réduire votre consommation les jours rouges (chauffage alternatif, report des usages...).',

  // Blue HC/HP Subscription
  'hchp.currentRate': 'Votre tarif HC/HP',
  'hchp.option': 'Option Heures Creuses - 6 kVA',
  'hchp.unit': '€/kWh TTC',
  'hchp.peakLabel': 'Heures Pleines (6h-22h)',
  'hchp.offPeakLabel': 'Heures Creuses (22h-6h)',
  'hchp.rateNote': 'Tarif différencié selon les heures — idéal pour consommation nocturne',
  'hchp.advTitle': '✅ Avantages HC/HP',
  'hchp.adv1': '• Heures creuses moins chères que l\'option Base',
  'hchp.adv2': '• Idéal pour recharge véhicule électrique la nuit',
  'hchp.adv3': '• Pas de jours rouges ni de couleurs à surveiller',
  'hchp.vsBase': 'Comparaison avec EDF Bleu Base',
  'hchp.baseRate': 'Tarif Base (réf.)',
  'hchp.hpRate': 'HC/HP Heures Pleines',
  'hchp.hcRate': 'HC/HP Heures Creuses',
  'hchp.weightedAvg': 'Moyenne pondérée HC/HP',
  'hchp.weightedNote': 'Basé sur 16h HP + 8h HC par jour',
  'hchp.vsTempo': 'Comparaison avec Tempo',
  'hchp.tempoBlueHC': 'Tempo Bleu HC',
  'hchp.tempoBlueHP': 'Tempo Bleu HP',
  'hchp.tempoWhiteHC': 'Tempo Blanc HC',
  'hchp.tempoWhiteHP': 'Tempo Blanc HP',
  'hchp.tempoRedHC': 'Tempo Rouge HC',
  'hchp.tempoRedHP': 'Tempo Rouge HP',
  'hchp.cheaper': 'moins cher',
  'hchp.moreExpensive': 'plus cher',
  'hchp.tipTitle': '💡 Conseil',
  'hchp.tipText': 'L\'option HC/HP est un bon compromis entre la simplicité du tarif Base et les économies de Tempo. Vous bénéficiez de tarifs réduits la nuit sans avoir à surveiller les couleurs des jours.',

  // Month short names (for date formatting)
  'month.short': 'janv.,févr.,mars,avr.,mai,juin,juil.,août,sept.,oct.,nov.,déc.',
};

const en: Record<string, string> = {
  // Header
  'header.tempo': 'EDF Tempo',
  'header.blue': 'EDF Blue',
  'header.blueHCHP': 'Blue HC/HP',

  // Current Day
  'now.title': 'Right now',
  'now.today': 'Today',
  'now.tomorrow': 'Tomorrow',
  'now.blueDay': 'Blue day',
  'now.whiteDay': 'White day',
  'now.redDay': 'Red day',
  'now.unknown': 'Unknown',
  'now.info': "Tomorrow's color is updated every day from 6:30 AM.",
  'now.hours': 'Peak hours: 6am - 10pm  |  Off-peak: 10pm - 6am',

  // Remaining
  'rem.title': 'Remaining days',
  'rem.period': 'Period from September 1, 2025 to August 31, 2026',
  'rem.blue': 'Blue days',
  'rem.white': 'White days',
  'rem.red': 'Red days',
  'rem.remaining_one': 'remaining',
  'rem.remaining_other': 'remaining',
  'rem.loading': 'Loading...',

  // Simulator
  'sim.title': 'Simulator',
  'sim.subtitle': 'How much does it cost to charge your EV?',
  'sim.subtitleSmall': 'Compare costs across your Tempo tariff',
  'sim.tariffLabel': 'Selected Tempo tariff',
  'sim.bleuHC': 'Blue Off-Peak',
  'sim.bleuHP': 'Blue Peak',
  'sim.blancHC': 'White Off-Peak',
  'sim.blancHP': 'White Peak',
  'sim.rougeHC': 'Red Off-Peak',
  'sim.rougeHP': 'Red Peak',
  'sim.edfBase': 'EDF Blue Base',
  'sim.edfHC': 'EDF Blue Off-Peak',
  'sim.savingsTitle': '💰 Savings',
  'sim.overcostTitle': '⚠️ Overcost',
  'sim.less': 'less',
  'sim.more': 'more',
  'sim.vsBase': 'vs EDF Blue Base for',
  'sim.nightCharge': 'charge',
  'sim.evExamples': 'EV charging examples',

  // Calendar
  'cal.title': 'History',
  'cal.blue': 'Blue',
  'cal.white': 'White',
  'cal.red': 'Red',
  'cal.unknown': 'Unknown',
  'cal.loading': 'Loading...',
  'cal.months': 'January,February,March,April,May,June,July,August,September,October,November,December',
  'cal.days': 'M,T,W,T,F,S,S',

  // Price Comparison
  'price.title': 'Price comparison',
  'price.subtitle': 'Tempo vs EDF Blue Base',
  'price.blueDay': 'Blue Day',
  'price.whiteDay': 'White Day',
  'price.redDay': 'Red Day',
  'price.peak': 'Peak hours (6am-10pm)',
  'price.offPeak': 'Off-peak hours (10pm-6am)',
  'price.ref': 'EDF Blue Base (ref.)',
  'price.avgSaving': '💰 Average saving',
  'price.avgOvercost': '⚠️ Average overcost',
  'price.weighted': 'Weighted average (16h peak + 8h off-peak per day)',
  'price.detailedGrid': 'Detailed price grid',
  'price.color': 'Color',
  'price.footnote': 'in € incl. tax / kWh',

  // Blue Subscription
  'blue.currentRate': 'Your current rate',
  'blue.option': 'Base option - 6 kVA',
  'blue.unit': '€/kWh incl. tax',
  'blue.rateNote': 'Flat rate 24/7 — no peak/off-peak distinction',
  'blue.advTitle': '✅ EDF Blue advantages',
  'blue.adv1': '• Fixed and predictable price all year',
  'blue.adv2': '• No expensive red days',
  'blue.adv3': '• No consumption adaptation needed',
  'blue.switchTitle': 'What if you switched to Tempo?',
  'blue.compTitle': 'Comparison with your Blue Base rate',
  'blue.youSave': 'You save',
  'blue.overcost': 'Tempo overcost',
  'blue.tempoAvg': 'Tempo avg.',
  'blue.vs': 'vs Blue',
  'blue.blueDays': 'Blue Days (300/yr)',
  'blue.whiteDays': 'White Days (43/yr)',
  'blue.redDays': 'Red Days (22/yr)',
  'blue.tipTitle': '💡 Tip',
  'blue.tipText': 'With Tempo, you save on 300 blue days but pay much more on 22 red days. The offer is worthwhile if you can reduce consumption on red days (alternative heating, delayed usage...).',

  // Blue HC/HP Subscription
  'hchp.currentRate': 'Your HC/HP rate',
  'hchp.option': 'Off-Peak Option - 6 kVA',
  'hchp.unit': '€/kWh incl. tax',
  'hchp.peakLabel': 'Peak hours (6am-10pm)',
  'hchp.offPeakLabel': 'Off-peak hours (10pm-6am)',
  'hchp.rateNote': 'Dual rate based on time of day — ideal for overnight consumption',
  'hchp.advTitle': '✅ HC/HP advantages',
  'hchp.adv1': '• Off-peak hours cheaper than Base option',
  'hchp.adv2': '• Great for overnight EV charging',
  'hchp.adv3': '• No red days or day colors to monitor',
  'hchp.vsBase': 'Comparison with EDF Blue Base',
  'hchp.baseRate': 'Base rate (ref.)',
  'hchp.hpRate': 'HC/HP Peak hours',
  'hchp.hcRate': 'HC/HP Off-peak hours',
  'hchp.weightedAvg': 'Weighted average HC/HP',
  'hchp.weightedNote': 'Based on 16h peak + 8h off-peak per day',
  'hchp.vsTempo': 'Comparison with Tempo',
  'hchp.tempoBlueHC': 'Tempo Blue Off-Peak',
  'hchp.tempoBlueHP': 'Tempo Blue Peak',
  'hchp.tempoWhiteHC': 'Tempo White Off-Peak',
  'hchp.tempoWhiteHP': 'Tempo White Peak',
  'hchp.tempoRedHC': 'Tempo Red Off-Peak',
  'hchp.tempoRedHP': 'Tempo Red Peak',
  'hchp.cheaper': 'cheaper',
  'hchp.moreExpensive': 'more expensive',
  'hchp.tipTitle': '💡 Tip',
  'hchp.tipText': 'The HC/HP option is a good compromise between the simplicity of the Base rate and the savings of Tempo. You get reduced rates at night without having to monitor day colors.',

  // Month short names
  'month.short': 'Jan.,Feb.,Mar.,Apr.,May,Jun.,Jul.,Aug.,Sep.,Oct.,Nov.,Dec.',
};

const translations = { fr, en };

// ── Context ─────────────────────────────────────────────────

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
