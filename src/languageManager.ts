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
    mobileLanguageToggleButtonSelector: string | null;
    contentContainerSelector: string;
    fadeDuration: number;
}

class LanguageManager {
    private readonly config: LanguageManagerConfig;
    private readonly rootElement: HTMLElement;
    private readonly contentContainer: HTMLElement | null;
    private readonly languageToggleButton: HTMLButtonElement | null;
    private readonly mobileLanguageToggleButton: HTMLButtonElement | null;

    private translationsCache: Map<string, Translations> = new Map();
    private currentLanguage: string;

    constructor(config: Partial<LanguageManagerConfig> = {}) {
        this.config = {
            localesPath: config.localesPath ?? '/locales',
            defaultLanguage: config.defaultLanguage ?? 'en',
            languageToggleButtonSelector: config.languageToggleButtonSelector ?? null,
            mobileLanguageToggleButtonSelector: config.mobileLanguageToggleButtonSelector ?? null,
            contentContainerSelector: config.contentContainerSelector ?? 'body',
            fadeDuration: config.fadeDuration ?? 200
        };

        this.rootElement = document.documentElement;
        this.contentContainer = this.config.contentContainerSelector ? document.querySelector<HTMLElement>(this.config.contentContainerSelector) : null;
        this.languageToggleButton = this.config.languageToggleButtonSelector ? document.querySelector<HTMLButtonElement>(this.config.languageToggleButtonSelector) : null;
        this.mobileLanguageToggleButton = this.config.mobileLanguageToggleButtonSelector ? document.querySelector<HTMLButtonElement>(this.config.mobileLanguageToggleButtonSelector) : null;
        
        this.currentLanguage = getCurrentLanguage();
    }

    public async initialize(): Promise<void> {
        await this.applyTranslations();

        subscribeToLanguageChanges(async (newLang) => {
            this.currentLanguage = newLang;
            await this.applyTranslations();
        });

        this.languageToggleButton?.addEventListener('click', () => this.toggleLanguage());
        this.mobileLanguageToggleButton?.addEventListener('click', () => this.toggleLanguage());
    }

    public toggleLanguage(): void {
        const supported = getSupportedLanguages();
        const currentIndex = supported.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % supported.length;
        setLanguage(supported[nextIndex]);
    }
    
    private async applyTranslations(): Promise<void> {
        if (this.contentContainer) {
            this.contentContainer.style.transition = `opacity ${this.config.fadeDuration}ms ease-in-out`;
            this.contentContainer.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, this.config.fadeDuration));
        }

        const translations = await this._loadTranslations(this.currentLanguage);
        this.rootElement.lang = this.currentLanguage;

        const elements = document.querySelectorAll('[data-i18n], [data-i18n-attr]');
        elements.forEach(element => {
            this._updateElementText(element as HTMLElement, translations);
            this._updateElementAttributes(element as HTMLElement, translations);
        });
        
        this._updateButtonLabels();

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

    private _updateElementText(element: HTMLElement, translations: Translations): void {
        const i18nKey = element.getAttribute('data-i18n');
        if (!i18nKey) return;

        const text = this._getNestedTranslation(i18nKey, translations);
        element.textContent = text;
    }

    private _updateElementAttributes(element: HTMLElement, translations: Translations): void {
        const attrMapping = element.getAttribute('data-i18n-attr');
        if (!attrMapping) return;

        attrMapping.split(';').forEach(pair => {
            const [attr, key] = pair.split(':');
            if (attr && key) {
                element.setAttribute(attr, this._getNestedTranslation(key, translations));
            }
        });
    }

    private _updateButtonLabels(): void {
        const newLabel = this.currentLanguage.toUpperCase();
        [this.languageToggleButton, this.mobileLanguageToggleButton].forEach(button => {
            const textSpan = button?.querySelector<HTMLSpanElement>('span:first-of-type');
            if (textSpan) {
                textSpan.textContent = newLabel;
            }
        });
    }
    
    private async _loadTranslations(lang: string): Promise<Translations> {
        if (this.translationsCache.has(lang)) {
            return this.translationsCache.get(lang)!;
        }
        try {
            const response = await fetch(`${this.config.localesPath}/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}: ${response.statusText}`);
            }
            const translations = await response.json();
            this.translationsCache.set(lang, translations);
            return translations;
        } catch (error) {
            console.error('Error loading translations:', error);
            if (lang !== this.config.defaultLanguage) {
                return this._loadTranslations(this.config.defaultLanguage);
            }
            return {};
        }
    }

    private _getNestedTranslation(key: string, translations: Translations): string {
        return key.split('.').reduce((acc: any, part: string) => {
            if (acc && typeof acc === 'object' && part in acc) {
                return acc[part];
            }
            return null;
        }, translations) ?? `[${key}]`;
    }
}

export default LanguageManager;