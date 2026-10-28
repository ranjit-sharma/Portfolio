const Profile = require('../models/Profile');

let currentTheme = {
  themeMode: 'dark',
  accentColor: 'emerald',
};

const getTheme = () => ({ ...currentTheme });

const setTheme = (mode, color) => {
  if (mode === 'dark' || mode === 'light') currentTheme.themeMode = mode;
  if (color && typeof color === 'string') currentTheme.accentColor = color;
};

const initThemeCache = async () => {
  try {
    const profile = await Profile.findOne().select('themeMode accentColor');
    if (profile) {
      if (profile.themeMode) currentTheme.themeMode = profile.themeMode;
      if (profile.accentColor) currentTheme.accentColor = profile.accentColor;
      console.log(`🎨 Global theme cache initialized: [${currentTheme.themeMode}] [${currentTheme.accentColor}]`);
    }
  } catch (err) {
    console.warn('⚠️ Could not initialize theme cache:', err.message);
  }
};

module.exports = { getTheme, setTheme, initThemeCache };
