/*
 * Copyright (c) 2025 Danil Klimov.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { getCurrentLanguage, setLanguage, getSupportedLanguages, subscribeToLanguageChanges } from './languageDetector';

interface Translations {
  [key: string]: string | Translations;
}

interface LanguageManagerConfig {
  localesPath: string;
  defaultLanguage: string;
  languageToggleButtonSelector: string | null;
  languageToggleButtonTextSelector: string | null;
  contentContainerSelector?: string;
  fadeDuration: number;
}

class LanguageManager {
  private readonly config: LanguageManagerConfig;
  private readonly rootElement: HTMLElement;
  private readonly languageToggleButton: HTMLButtonElement | null;
  private readonly languageToggleButtonTextSpan: HTMLSpanElement | null;
  private readonly contentContainer: HTMLElement | null;
  private translationsCache: Map<string, Translations> = new Map();
  private currentLanguage: string;

  constructor(config: Partial<LanguageManagerConfig> = {}) {
    this.config = {
      localesPath: config.localesPath ?? '/locales',
      defaultLanguage: config.defaultLanguage ?? 'en',
      languageToggleButtonSelector: config.languageToggleButtonSelector ?? null,
      languageToggleButtonTextSelector: config.languageToggleButtonTextSelector ?? null,
      contentContainerSelector: config.contentContainerSelector ?? 'body',
      fadeDuration: config.fadeDuration ?? 200
    };
    this.rootElement = document.documentElement;
    this.languageToggleButton = this.config.languageToggleButtonSelector
      ? document.querySelector<HTMLButtonElement>(this.config.languageToggleButtonSelector)
      : null;
    this.languageToggleButtonTextSpan = this.languageToggleButton && this.config.languageToggleButtonTextSelector
      ? this.languageToggleButton.querySelector<HTMLSpanElement>(this.config.languageToggleButtonTextSelector)
      : null;
    this.contentContainer = this.config.contentContainerSelector
      ? document.querySelector<HTMLElement>(this.config.contentContainerSelector)
      : null;
    this.currentLanguage = getCurrentLanguage();
  }

  private async loadTranslations(lang: string): Promise<Translations> {
    if (this.translationsCache.has(lang)) {
      return this.translationsCache.get(lang)!;
    }
    try {
      const response = await fetch(`${this.config.localesPath}/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang}`);
      }
      const translations = await response.json();
      this.translationsCache.set(lang, translations);
      return translations;
    } catch (error) {
      console.error('Error loading translations:', error);
      if (lang !== this.config.defaultLanguage) {
        return this.loadTranslations(this.config.defaultLanguage);
      }
      return {};
    }
  }

  private getNestedTranslation(key: string, translations: Translations): string {
    const parts = key.split('.');
    let value: string | Translations = translations;
    for (const part of parts) {
      if (typeof value === 'object' && part in value) {
        value = (value as Translations)[part];
      } else {
        return `[${key}]`;
      }
    }
    return typeof value === 'string' ? value : `[INVALID_TYPE: ${key}]`;
  }

  private async applyTranslations(): Promise<void> {
    if (this.contentContainer) {
      this.contentContainer.style.transition = `opacity ${this.config.fadeDuration}ms ease-in-out`;
      this.contentContainer.style.opacity = '0';
    }

    const translations = await this.loadTranslations(this.currentLanguage);
    this.rootElement.lang = this.currentLanguage;

    const elements = document.querySelectorAll('[data-i18n], [data-i18n-attr], title[data-i18n]');
    elements.forEach(element => {
      const i18nKey = element.getAttribute('data-i18n');
      if (i18nKey) {
        const text = this.getNestedTranslation(i18nKey, translations);

        if (text.includes('<br>') || element.tagName === 'TITLE') {
          element.innerHTML = text;
        }
        else if (element.children.length > 0) {
          for (const node of Array.from(element.childNodes)) {
            if (node.nodeType === 3 && node.textContent?.trim() !== '') {
              node.textContent = text;
              break;
            }
          }
        }
        else {
          element.textContent = text;
        }
      }

      const attrMapping = element.getAttribute('data-i18n-attr');
      if (attrMapping) {
        attrMapping.split(';').forEach(pair => {
          const [attr, key] = pair.split(':');
          if (attr && key) {
            element.setAttribute(attr, this.getNestedTranslation(key, translations));
          }
        });
      }
    });

    if (this.languageToggleButtonTextSpan) {
      this.languageToggleButtonTextSpan.textContent = this.currentLanguage;
    }

    if (this.contentContainer) {
      requestAnimationFrame(() => {
        this.contentContainer!.style.opacity = '1';
        setTimeout(() => {
          if (this.contentContainer) {
            this.contentContainer.style.transition = '';
          }
        }, this.config.fadeDuration);
      });
    }
  }


  async initialize(): Promise<void> {
    setLanguage(this.currentLanguage);
    await this.applyTranslations();
    subscribeToLanguageChanges(async (newLang) => {
      this.currentLanguage = newLang;
      await this.applyTranslations();
    });
    if (this.languageToggleButton) {
      this.languageToggleButton.addEventListener('click', () => this.toggleLanguage());
    }
  }

  toggleLanguage(): void {
    const supported = getSupportedLanguages();
    const currentIndex = supported.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % supported.length;
    setLanguage(supported[nextIndex]);
  }

  setLanguage(lang: string): void {
    setLanguage(lang);
  }

  getLanguage(): string {
    return this.currentLanguage;
  }
}

export default LanguageManager;