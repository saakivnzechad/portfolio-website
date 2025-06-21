/*
 * Copyright (c) 2025 Danil Klimov.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const languageConfig = {
  storageKey: 'appLanguage',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ru'] as const
};

let currentLanguage: string | null = null;
const subscribers = new Set<(newLanguage: string) => void>();

function getPreferredLanguage(): string {
  const storedLanguage = localStorage.getItem(languageConfig.storageKey);
  if (storedLanguage && languageConfig.supportedLanguages.includes(storedLanguage as any)) {
    return storedLanguage;
  }
  const browserLanguage = navigator.language.split('-')[0];
  return languageConfig.supportedLanguages.includes(browserLanguage as any)
    ? browserLanguage
    : languageConfig.defaultLanguage;
}

export function setLanguage(newLang: string): void {
  if (!languageConfig.supportedLanguages.includes(newLang as any)) {
    console.warn(`Unsupported language: ${newLang}. Must be one of ${languageConfig.supportedLanguages.join(', ')}.`);
    return;
  }
  if (currentLanguage === newLang) {
    return;
  }
  currentLanguage = newLang;
  localStorage.setItem(languageConfig.storageKey, newLang);
  document.documentElement.lang = newLang;
  subscribers.forEach(callback => callback(newLang));
}

export function getCurrentLanguage(): string {
  if (!currentLanguage) {
    setLanguage(getPreferredLanguage());
  }
  return currentLanguage!;
}

export function subscribeToLanguageChanges(callback: (newLanguage: string) => void): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function getSupportedLanguages(): ReadonlyArray<string> {
  return languageConfig.supportedLanguages;
}