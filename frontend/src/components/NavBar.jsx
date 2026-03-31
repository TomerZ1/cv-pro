/**
 * Top navigation bar with links to each tool page.
 * Highlights the active route.
 *
 * @param {Object} props - No props needed, uses react-router-dom hooks.
 */

import { NavLink } from "react-router-dom";

/** @type {{path: string, label: string}[]} Navigation items */
const NAV_ITEMS = [
  { path: "/", label: "Input" },
  { path: "/projects", label: "Projects" },
  { path: "/skills", label: "Skills" },
  { path: "/profile", label: "Profile" },
  { path: "/achievements", label: "Achievements" },
];

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          {/* Logo / App name */}
          <span className="font-bold text-lg text-indigo-600 shrink-0">CV Pro</span>

          {/* Nav links */}
          <div className="flex gap-1">
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
