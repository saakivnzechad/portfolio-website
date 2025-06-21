/*
 * Copyright (c) 2025 Danil Klimov.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

type Theme = 'light' | 'dark';

interface ThemeManagerConfig {
  localStorageKey: string;
  themeToggleButtonSelector: string;
  themeToggleButtonTextSelector: string;
  rootElement?: HTMLElement;
}

class ThemeManager {
  private readonly config: ThemeManagerConfig;
  private readonly rootElement: HTMLElement;
  private readonly themeToggleButton: HTMLButtonElement | null;
  private readonly themeToggleButtonTextSpan: HTMLSpanElement | null;
  private currentTheme: Theme;

  constructor(config: Partial<ThemeManagerConfig> = {}) {
    this.config = {
      localStorageKey: config.localStorageKey ?? 'theme',
      themeToggleButtonSelector: config.themeToggleButtonSelector ?? '',
      themeToggleButtonTextSelector: config.themeToggleButtonTextSelector ?? '',
      rootElement: config.rootElement
    };
    this.rootElement = this.config.rootElement ?? document.documentElement;
    this.themeToggleButton = this.config.themeToggleButtonSelector 
      ? document.querySelector<HTMLButtonElement>(this.config.themeToggleButtonSelector)
      : null;
    this.themeToggleButtonTextSpan = this.themeToggleButton && this.config.themeToggleButtonTextSelector
      ? this.themeToggleButton.querySelector<HTMLSpanElement>(this.config.themeToggleButtonTextSelector)
      : null;
    this.currentTheme = 'light';
  }

  private getSavedTheme(): Theme | null {
    return localStorage.getItem(this.config.localStorageKey) as Theme | null;
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.config.localStorageKey, theme);
  }

  private getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (this.currentTheme === theme) return;
    
    this.currentTheme = theme;
    this.rootElement.dataset.theme = theme === 'dark' ? 'dark' : '';
    if (this.themeToggleButtonTextSpan) {
      this.themeToggleButtonTextSpan.textContent = theme;
    }
  }

  initialize(): void {
    this.applyTheme(this.getSavedTheme() ?? this.getSystemTheme());
    if (this.themeToggleButton) {
      this.themeToggleButton.addEventListener('click', () => this.toggle());
    }
  }

  toggle(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  getTheme(): Theme {
    return this.currentTheme;
  }
}

export default ThemeManager;