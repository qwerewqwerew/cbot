import api from "./api/axios";
import { Outlet, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCommentDots, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import Chatbot from "./components/Chatbot";

export default function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upComing, setUpComing] = useState([]);

  useEffect(() => {
    async function loadNowPlaying() {
      try {
        const np = await api.get(`now_playing?language=ko-KR`);
        const po = await api.get(`popular?language=ko-KR`);
        const up = await api.get(`upcoming?language=ko-KR`);
        setNowPlaying(np.data.results.filter((movie) => movie.poster_path));
        setPopular(po.data.results.filter((movie) => movie.poster_path));
        setUpComing(up.data.results.filter((movie) => movie.poster_path));
      } catch (err) {
        console.error("로딩실패", err);
      }
    }
    loadNowPlaying();
  }, []);

  const isLoading =
    nowPlaying.length === 0 && popular.length === 0 && upComing.length === 0;

  if (isLoading) {
    return (
      <main className="pt-16 min-h-screen bg-black text-white grid place-items-center">
        <p>로딩중...</p>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <Outlet context={{ nowPlaying, popular, upComing }} />
      </main>
      <FloatingChatbot />
    </>
  );
}

function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-yellow-400 text-black text-2xl shadow-lg hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center"
      >
        <FontAwesomeIcon icon={open ? faXmark : faCommentDots} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full py-4 px-2 bg-black/90 z-50">
      <div className="container mx-auto">
        <Link to="/">
          <h1 className="text-3xl text-yellow-300 font-bold">
            <FontAwesomeIcon icon={faHouse} />
            GOFLIX
          </h1>
        </Link>
      </div>
    </header>
  );
}
