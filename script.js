diff --git a/script.js b/script.js
index 76161dcf82dfcb768ed226cc87909a81cff2dc97..f14608487dc383cef58f4d26d1bedb374abe479d 100644
--- a/script.js
+++ b/script.js
@@ -1,53 +1,61 @@
 const THEME_KEY = 'myweb-theme-preference';
 const themeButtons = document.querySelectorAll('.theme-button');
-const revealEls = document.querySelectorAll('.reveal');
+const revealEls = document.querySelectorAll('.reveal-blur');
 
 const getSystemTheme = () =>
   window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
 
 const applyTheme = (theme) => {
   const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
   document.body.dataset.theme = resolvedTheme;
 
   themeButtons.forEach((button) => {
     button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
   });
 };
 
 const storedTheme = localStorage.getItem(THEME_KEY) || 'system';
 applyTheme(storedTheme);
 
 if (window.matchMedia) {
   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
   mediaQuery.addEventListener('change', () => {
     const activeSetting = localStorage.getItem(THEME_KEY) || 'system';
     if (activeSetting === 'system') applyTheme('system');
   });
 }
 
 themeButtons.forEach((button) => {
   button.addEventListener('click', () => {
     const selectedTheme = button.dataset.theme;
     localStorage.setItem(THEME_KEY, selectedTheme);
     applyTheme(selectedTheme);
   });
 });
 
-revealEls.forEach((el, index) => {
-  setTimeout(() => {
-    el.classList.add('visible');
-  }, 110 * index + 80);
+window.addEventListener('load', () => {
+  window.setTimeout(() => {
+    document.body.classList.remove('page-enter');
+  }, 80);
 });
 
 const observer = new IntersectionObserver(
   (entries) => {
     entries.forEach((entry) => {
-      if (entry.isIntersecting) {
+      if (!entry.isIntersecting) return;
+
+      const delay = Number(entry.target.dataset.delay || 0);
+      setTimeout(() => {
         entry.target.classList.add('visible');
-      }
+      }, delay);
+
+      observer.unobserve(entry.target);
     });
   },
-  { threshold: 0.18 }
+  { threshold: 0.15 }
 );
 
-revealEls.forEach((el) => observer.observe(el));
+revealEls.forEach((el, index) => {
+  el.dataset.delay = String(index * 120 + 180);
+  observer.observe(el);
+});
