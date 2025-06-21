/*
 * Copyright (c) 2025 Danil Klimov.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import ThemeManager from './themeManager';
import LanguageManager from './languageManager';

document.addEventListener('DOMContentLoaded', async () => {
  const themeManager = new ThemeManager({
    localStorageKey: 'portfolio-theme',
    themeToggleButtonSelector: '#theme-toggle',
    themeToggleButtonTextSelector: 'span:nth-of-type(2)'
  });
  themeManager.initialize();

  const languageManager = new LanguageManager({
    localesPath: '/locales',
    defaultLanguage: 'en',
    languageToggleButtonSelector: '#lang-toggle',
    languageToggleButtonTextSelector: 'span:nth-of-type(2)',
    contentContainerSelector: 'body'
  });
  await languageManager.initialize();
});