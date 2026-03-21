import { useEffect, useState } from "react";
import { Link } from "react-router";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/95 shadow-lg" : "bg-black/30"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/">
          <span className="text-2xl font-bold text-yellow-400">GOFLEX</span>
        </Link>
      </div>
    </header>
  );
}
