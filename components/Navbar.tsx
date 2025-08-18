import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaRegStickyNote, FaVideo, FaCog, FaSignOutAlt, FaBook } from 'react-icons/fa';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setUser(null);
      setShowUserMenu(false);
      setMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavClick = (sectionId: string) => {
    // If we're on the materials page, navigate to home first
    if (router.pathname !== '/') {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    setMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#0a0a23] to-[#23234b] text-white px-8 py-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <span className="text-2xl font-bold select-none">
            Brain <span className="text-blue-400">Stack</span>
          </span>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <div className={`hidden md:flex space-x-8 items-center font-medium`}> 
            <button 
              onClick={() => handleNavClick('home')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('skills')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Skills
            </button>
            <button 
              onClick={() => handleNavClick('projects')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Projects
            </button>
            <Link href="/materials?type=video" className="flex items-center gap-1 hover:text-blue-400 transition"><FaVideo className="inline-block" /> Video Notes</Link>
            <Link href="/materials?type=ebook" className="flex items-center gap-1 hover:text-blue-400 transition"><FaBook className="inline-block" /> E-Books</Link>
            <Link href="/materials?type=notes" className="flex items-center gap-1 hover:text-blue-400 transition"><FaRegStickyNote className="inline-block" /> Notes</Link>
            
            {isAuthenticated && user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                    <FaCog className="inline-block" /> Admin Panel
                  </Link>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:text-blue-400 transition cursor-pointer"
                  >
                    {user.picture ? (
                      <Image 
                        src={user.picture}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getUserInitials(user.name)}
                      </div>
                    )}
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#181828] rounded-lg shadow-xl border border-white/10 py-2">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          {user.picture ? (
                            <Image 
                              src={user.picture}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                              {getUserInitials(user.name)}
                            </div>
                          )}
                          <div>
                            <div className="text-white font-semibold">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-white hover:bg-red-600/20 flex items-center gap-2 transition-colors"
                        >
                          <FaSignOutAlt size={14} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (<></>)}
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-6 px-4">
            {/* User Profile Section */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-4 bg-[#181828] rounded-lg border border-white/10">
                {user.picture ? (
                  <Image 
                    src={user.picture}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                    {getUserInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleNavClick('home')}
                className="text-center py-2 hover:text-blue-400 transition cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="text-center py-2 hover:text-blue-400 transition cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('skills')}
                className="text-center py-2 hover:text-blue-400 transition cursor-pointer"
              >
                Skills
              </button>
              <button 
                onClick={() => handleNavClick('projects')}
                className="text-center py-2 hover:text-blue-400 transition cursor-pointer"
              >
                Projects
              </button>
              <Link href="/materials?type=video" className="text-center py-2 hover:text-blue-400 transition">Video Notes</Link>
              <Link href="/materials?type=ebook" className="flex items-center justify-center gap-2 py-2 hover:text-blue-400 transition">
                <FaBook className="inline-block" /> E-Books
              </Link>
              <Link href="/materials?type=notes" className="flex items-center justify-center gap-2 py-2 hover:text-blue-400 transition">
                <FaRegStickyNote className="inline-block" /> Notes
              </Link>
            </div>
            
            {/* Action Buttons */}
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                {user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog className="inline-block" /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  <FaSignOutAlt className="inline-block" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10">
                <Link 
                  href="/login"
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}