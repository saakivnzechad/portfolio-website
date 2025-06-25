/*
 * Copyright (c) 2025 Danil Klimov.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import LanguageManager from './languageManager';

class MobileMenuManager {
    private readonly menu: HTMLElement;
    private readonly button: HTMLElement;

    constructor(menuElement: HTMLElement, buttonElement: HTMLElement) {
        this.menu = menuElement;
        this.button = buttonElement;
    }

    public init(): void {
        this.button.addEventListener('click', () => this.toggle());
    }

    public toggle(): void {
        if (this.menu.classList.contains('hidden')) {
            this.open();
        } else {
            this.close();
        }
    }

    public open(): void {
        this.menu.classList.remove('hidden');
        void this.menu.offsetWidth;
        this.menu.classList.remove('translate-y-full');
        this.menu.classList.add('translate-y-0');
    }

    public close(): void {
        if (this.menu.classList.contains('hidden')) return;

        this.menu.classList.add('-translate-y-full');
        this.menu.classList.remove('translate-y-0');
        this.menu.addEventListener('transitionend', () => {
            this.menu.classList.add('hidden');
        }, { once: true });
    }
}

class ScrollManager {
    public initSmoothScroll(): void {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (event) => this.handleAnchorClick(event));
        });
    }

    private handleAnchorClick(event: Event): void {
        event.preventDefault();
        const targetId = (event.currentTarget as HTMLAnchorElement).getAttribute('href');

        if (!targetId) {
            console.warn('Anchor element has no href attribute.', event.currentTarget);
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn(`Target element with ID "${targetId}" not found.`, event.currentTarget);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenuElement = document.getElementById('mobile-menu');

    if (!hamburgerButton || !mobileMenuElement) {
        console.error('Core UI elements not found. App cannot initialize.');
        return;
    }

    const languageManager = new LanguageManager({
        localesPath: '/portfolio-website/locales',
        defaultLanguage: 'en',
        languageToggleButtonSelector: '#lang-toggle',
        mobileLanguageToggleButtonSelector: '#lang-toggle-mobile',
    });

    const mobileMenuManager = new MobileMenuManager(mobileMenuElement, hamburgerButton);
    const scrollManager = new ScrollManager();

    mobileMenuManager.init();
    scrollManager.initSmoothScroll();
    await languageManager.initialize();

    mobileMenuElement.addEventListener('click', () => {
        mobileMenuManager.close();
    });
});