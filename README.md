![Project Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Technologies](https://img.shields.io/badge/Tech-HTML%2C%20TS%2C%20Tailwind%2C%20Vite-blue.svg)
![License](https://img.shields.io/badge/License-MPL%202.0-green.svg)

# Personal Landing Page / Portfolio

A Responsive and Localized Static Website

---

## Project Overview

This repository contains the source code for a personal landing page, designed to serve as an online presence. The project focuses on **functional design, user experience, and performance**. It demonstrates frontend development skills within a pure web environment, without reliance on extensive JavaScript frameworks.

The site incorporates a **responsive layout** implemented with Tailwind CSS, ensuring adaptability across various devices, from mobile phones to desktop displays. It includes a **custom localization system** supporting multiple languages (currently English and Russian), providing content in the user's preferred language. All content is managed through `.json` files, contributing to a structured approach to content delivery and maintainability.

This project illustrates the development of a static website using contemporary tools such as Vite and Tailwind CSS, complemented by custom TypeScript logic for interactive elements.

---

## Features

This landing page integrates key features related to user interaction and site navigation:

* **Responsive Layout:** Implemented with **Tailwind CSS**, providing a responsive design that adjusts to various screen sizes and orientations.
* **Navigation System:** Includes a **hamburger menu for mobile views** and a **desktop navigation bar**. This system facilitates smooth, scroll-to-section navigation across the site's content.
* **Custom Localization System:** Utilizes a **TypeScript-based solution** for dynamic content localization (supporting English and Russian). Textual content, including attributes such as `title` and `aria-label`, is loaded from external `.json` files, aiding content updates.
* **Modular TypeScript Structure:** Core functionalities, including language management (`LanguageManager.ts`), mobile menu control (`MobileMenuManager.ts`), and smooth scrolling (`ScrollManager.ts`), are organized into dedicated TypeScript classes to support maintainability and separation of concerns.
* **Optimized Client-Side Logic:** Achieves interactive elements and contributes to load times with a **minimal JavaScript footprint**, prioritizing performance.
* **Vite Integration:** Employs **Vite** as the build tool, which supports a development server and optimized production builds.

---

## Technologies Used

This project is developed using a set of modern and efficient technologies:

### Frontend:

* **HTML5:** Used for structuring the website content.
* **CSS3 / Tailwind CSS:** A utility-first CSS framework for styling and layout.
* **TypeScript:** Applied for client-side logic implementation.
* **Vite:** Serves as the build tool for development and production.

---

## Code Highlights

The codebase demonstrates implementation patterns and architectural choices:

* **`index.html`:** The main entry point, detailing the HTML structure and the integration of `data-i18n` and `data-i18n-attr` attributes for dynamic content translation.
* **`src/main.ts`:** The primary script for application initialization, responsible for setting up `LanguageManager`, `MobileMenuManager`, and `ScrollManager`.
* **`src/languageManager.ts`:** Manages the dynamic loading, application, and persistence of user language preferences from JSON files (`/locales/*.json`).
* **`src/languageDetector.ts`:** Provides utility functions for detecting the preferred language and managing language change events.
* **`src/style.css`:** Integrates Tailwind CSS and defines custom CSS variables, contributing to the site's styling and thematic consistency.
* **`/locales/` directory:** Contains JSON files (e.g., `en.json`, `ru.json`) that define translatable strings, separating content from code.

---

## Screenshots

The following screenshots illustrate the project's layout and responsiveness:

### Desktop View

<img src="images/desktop-homepage.png" alt="Screenshot of Desktop Page" style="max-width: 100%; height: auto;">

### Mobile View

<img src="images/mobile-homepage.png" alt="Screenshot of Mobile Page" style="width: auto; max-height: 600px;">

### Localization Example

<img src="images/lang-switch.png" alt="Screenshot of Language Switch" style="max-width: 100%; height: auto;">

---

## Project Status

This project is **actively maintained** and serves as a personal portfolio. It is intended as a showcase of development skills, with ongoing content updates and potential feature enhancements. This repository can be used to understand the approach to building static web applications.

---

## Setup

To set up and run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saakivnzechad/portfolio-website.git
    cd portfolio-website
    ```
2.  **Install Node.js and a package manager** (npm, yarn, or pnpm).
3.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    ```
    This will typically start a local server at `http://localhost:5173` (or similar).
5.  **Build the production version (optional):**
    ```bash
    npm run build
    # or yarn build
    # or pnpm build
    ```
    This will generate the `dist` directory with optimized static assets.

---

## Deployment

This project can be deployed as a static site to platforms such as GitHub Pages. Refer to the project's documentation on deploying Vite projects to GitHub Pages for instructions.

---

## Author

**Danil Klimov**
* GitHub: [@saakivnzechad](https://github.com/saakivnzechad)
* Telegram: [@sarthriles](https://t.me/sarthriles)

---

## License

This project is licensed under the **Mozilla Public License Version 2.0 (MPL 2.0)**.
A copy of the license is available in the `LICENSE` file in this repository.