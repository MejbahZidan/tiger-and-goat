export const I18n = {
  lang: localStorage.getItem('tiger_goat_lang') || 'bn',
  setLang(l) { this.lang = l; localStorage.setItem('tiger_goat_lang', l); },
  t(k) {
    const dict = {
      bn: { title: 'বাঘ ও ছাগল', goat: 'ছাগল', tiger: 'বাঘ', restart: 'নতুন খেলা', captured: 'শিকার', reserve: 'বাকি' },
      en: { title: 'Tiger & Goat', goat: 'Goat', tiger: 'Tiger', restart: 'Restart', captured: 'Captured', reserve: 'Reserve' }
    };
    return dict[this.lang][k] || k;
  }
};
