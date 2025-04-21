import React, { useEffect } from "react";
import DarkModeToggle, { initializeDarkMode } from "../DarkModeToggle.tsx";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    initializeDarkMode();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--color-bg-main)",
        color: "var(--color-text-main)",
      }}
    >
      <header
        style={{ background: "var(--color-accent-dark)", color: "#fff" }}
        className="p-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold">Customer Tracker</div>
          <nav className="flex gap-2">
            <a
              href="/"
              className="px-3 py-1 rounded hover:bg-accent-dark/30 transition-colors"
            >
              Home
            </a>
            <a
              href="/customers"
              className="px-3 py-1 rounded hover:bg-accent-dark/30 transition-colors"
            >
              Customers
            </a>
            <a
              href="/data-management"
              className="px-3 py-1 rounded hover:bg-accent-dark/30 transition-colors"
            >
              Data Management
            </a>
            <a
              href="/procedure-types"
              className="px-3 py-1 rounded hover:bg-accent-dark/30 transition-colors"
            >
              Procedure Types
            </a>
          </nav>
        </div>
        <DarkModeToggle />
      </header>
      <main
        style={{
          background: "var(--color-bg-form)",
          color: "var(--color-accent-dark)",
        }}
        className="flex-1 p-4"
      >
        {children}
      </main>
      <footer
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-dark)",
        }}
        className="text-center p-2 text-xs"
      >
        &copy; 2025 Endospera & Eco Lifting
      </footer>
    </div>
  );
};

export default Layout;
