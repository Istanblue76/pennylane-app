export const getVal = (field, lang = 'tr') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field['tr'] || '';
};

export const updateVal = (field, lang, newValue) => {
  if (!field || typeof field === 'string') {
    // Migrate string to object
    return {
      tr: typeof field === 'string' ? field : '',
      en: '',
      [lang]: newValue
    };
  }
  return {
    ...field,
    [lang]: newValue
  };
};
