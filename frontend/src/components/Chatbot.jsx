import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faXmark } from "@fortawesome/free-solid-svg-icons";

// const BACKEND = "http://localhost:8000/chat";
const BACKEND = "https://cbot-rfcl.onrender.com/chat";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요! 영화에 대해 무엇이든 물어보세요" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "서버 연결에 실패했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button onClick={() => setOpen((v) => !v)} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-yellow-500 text-gray-700 border-none text-2xl cursor-pointer shadow-lg z-50 flex items-center justify-center" title="AI 챗봇">
        {open ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faComment} />}
      </button>

      {/* 채팅 모달 */}
      {open && (
        <div className="fixed bottom-24 right-8 w-85 max-h-1/2 bg-gray-950 border border-gray-600 rounded-xl flex flex-col shadow-2xl z-40">
          {/* 헤더 */}
          <div className="py-3 px-4 bg-yellow-500 rounded-t-xl font-bold text-sm text-gray-700">Goflix AI 챗봇</div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-50 max-h-85">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`py-2 px-3 max-w-4/5 text-sm leading-snug whitespace-pre-wrap break-words text-gray-700
                  ${m.role === "user" ? "self-end bg-yellow-500 rounded-tl-xl rounded-tr-xl rounded-bl-xl" : "self-start bg-gray-100 rounded-tl-xl rounded-tr-xl rounded-br-xl"}`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="self-start bg-gray-100 text-gray-400 rounded-tl-xl rounded-tr-xl rounded-br-xl py-2 px-3 text-sm">...</div>}
            <div ref={bottomRef} />
          </div>

          {/* 입력 */}
          <div className="flex border-t border-[#333] p-2 gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="메시지 입력..." disabled={loading} className="flex-1 bg-[#1e1e1e] border border-[#444] rounded-lg py-2 px-3 text-gray-700 text-sm outline-none placeholder:text-zinc-300" />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`bg-yellow-500 text-gray-700 border-none rounded-lg py-2 px-3 text-sm font-bold
                ${loading || !input.trim() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}
