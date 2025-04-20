import React from 'react';

const toggleDarkMode = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

export const initializeDarkMode = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
};

const DarkModeToggle: React.FC = () => (
  <button
    onClick={toggleDarkMode}
    className="rounded border border-sky bg-sand dark:bg-deepteal dark:text-sand text-deepteal hover:bg-sky hover:text-sand dark:hover:bg-sky dark:hover:text-deepteal transition-colors text-xs font-semibold"
    aria-label="Toggle dark mode"
  >
    Toggle Dark/Light Mode
  </button>
);

export default DarkModeToggle;
