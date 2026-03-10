import { useOutletContext } from "react-router";
import Section from "./Section";

export default function Home() {
  const { nowPlaying, popular, upComing } = useOutletContext();

  return (
    <>
      <VideoHero />
      <Section title="현재 상영작" items={nowPlaying} />
      <Section title="인기 상영작" items={popular} />
      <Section title="상영 예정작" items={upComing} />
    </>
  );
}

function VideoHero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="video.mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex-col flex items-center justify-center h-full">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-300">GOFLEX</h2>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">최신 영화와 인기 작품을 만나보세요.</p>
      </div>
    </section>
  );
}
