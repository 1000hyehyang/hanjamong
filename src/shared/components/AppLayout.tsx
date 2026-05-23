import { NavLink, Outlet, useLocation } from "react-router-dom";
import { HanjamongLogo } from "./HanjamongLogo";
import { SettingsButton } from "./SettingsButton";
import { Icon, type IconName } from "./icons/Icon";
import { pressableNav } from "../styles/interactive";

const navItems: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "학습", icon: "book" },
  { to: "/quiz", label: "문제", icon: "pencil" },
  { to: "/bookmarks", label: "별표", icon: "star" },
  { to: "/wrong", label: "오답", icon: "clipboard" },
];

function isSessionRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/learn/bookmarks") ||
    /^\/learn\/\d+/.test(pathname) ||
    /^\/quiz\/\d+\/[^/]+/.test(pathname) ||
    pathname === "/quiz/review"
  );
}

export function AppLayout() {
  const { pathname } = useLocation();
  const hideNav = isSessionRoute(pathname);

  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-surface">
        <div className="h-[env(safe-area-inset-top)] bg-surface" />
        {!hideNav ? (
          <header className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 pb-1 pt-2 min-h-[56px]">
            <div aria-hidden="true" />
            <div className="flex items-center justify-center">
              <HanjamongLogo className="block h-10 w-auto -translate-y-0.5" />
            </div>
            <div className="flex items-center justify-end">
              <SettingsButton />
            </div>
          </header>
        ) : null}
        <main className={`min-w-0 flex-1 ${hideNav ? "pt-5" : ""}`}>
          <Outlet />
        </main>

        {!hideNav ? (
          <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface pb-[env(safe-area-inset-bottom)]">
            <div className="grid grid-cols-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold uppercase tracking-wide",
                      pressableNav,
                      isActive ? "text-green" : "text-text-secondary",
                    ].join(" ")
                  }
                >
                  <Icon name={item.icon} size={22} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
