# 🎓 Smart Student ID Generator

A modern React-based web app that allows schools to dynamically generate, download, and manage **student ID cards** with QR codes. Features photo uploads, allergy and route tracking, and multiple card templates.


---

##  Features

-  Dynamic form to input student data  
-  Upload student photo  
-  Smart allergy selector (multi-select with suggestions)  
-  Bus route and rack number tracking  
-  Toggle between **multiple ID card templates**  
-  Store and retrieve previous cards using `localStorage`  
-  Export ID cards as **PNG images**  
-  Embedded QR code with student info  
-  Built-in error boundary for resilience

---

##  Thought Process

The goal was to build a clean, interactive, and **visually appealing** web tool to automate student ID card generation.

### Design Decisions:

- **React + Hooks** for responsive interactivity and form state management.
- Used `react-select` for better UX with dropdowns and multi-select.
- Used `html-to-image` to capture DOM nodes (the card) as PNG.
- Maintained **component modularity**, using refs and utility state like `submitted`, `templateIndex`, and `showPrevious` to conditionally render views.
- Stored form data locally for persistence across sessions using `localStorage`.
- Included a **QR Code** to embed student data in a scannable format using `react-qr-code`.


---

##  Technologies Used

- React (Hooks, State, JSX)
- `react-select` for custom dropdowns
- `html-to-image` for DOM-to-PNG export
- `react-qr-code` for QR code rendering
- LocalStorage for offline persistence
- TailwindCSS + custom CSS for styling



##  Preview

> After generating an ID, you can preview the card and download or save it.

---

##  Author

Made with ❤️ by Sohom Mukherjee
