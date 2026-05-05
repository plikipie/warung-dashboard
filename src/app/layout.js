import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Warung Bangkip Dashboard",
  description: "Admin Dashboard Warung Bangkip",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={geist.className}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">
                🍜 Warung Bangkip
              </h1>
              <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
              >
                <span>📋</span>
                <span>Menu</span>
              </Link>
              <Link
                href="/chatlogs"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
              >
                <span>💬</span>
                <span>Chat Logs</span>
              </Link>
            </nav>

            {/* Bottom */}
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
