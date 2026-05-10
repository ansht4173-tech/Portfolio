import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX } from "lucide-react";
import { botKnowledge } from "../data/botKnowledge";

/* ---------- Reply Matching ---------- */
const getBotReply = (input) => {
  const normalizedInput = input.toLowerCase();
  let bestScore = 0;
  let bestResponse =
    "I'm not sure I understand. You can ask me about Ansh's skills, projects, experience, education, or contact details.";

  for (let entry of botKnowledge) {
    let score = 0;
    for (let keyword of entry.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestResponse = entry.response;
    }
  }

  return bestResponse;
};

/* ---------- TTS Hook with Cancel + Mute Ref ---------- */
const useSpeech = () => {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  const getFemaleVoice = () => {
    const preferredNames = [
      "Google UK English Female",
      "Microsoft Zira",
      "Samantha",
      "English (India)",
      "en-IN",
    ];
    const preferred = voices.find((v) =>
      preferredNames.some((name) =>
        v.name.toLowerCase().includes(name.toLowerCase())
      )
    );
    if (preferred) return preferred;

    const female = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman")
    );
    if (female) return female;

    const english = voices.find((v) => v.lang.startsWith("en"));
    return english || voices[0];
  };

  // speak now takes a ref to check mute status
  const speak = (text, isMutedRef) => {
    if (!synth || !text) return;
    if (isMutedRef && isMutedRef.current) return; // respect mute

    synth.cancel(); // stop any existing speech
    const utterance = new SpeechSynthesisUtterance(text);
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    synth.speak(utterance);
  };

  return { speak };
};

/* ---------- ChatBot Component ---------- */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm Vidya, Ansh Thakur's assistant. How can I help you learn more about him?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted); // ref stays current
  const chatEndRef = useRef(null);
  const { speak } = useSpeech();

  // keep ref in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Speak welcome message (only once when chat opens and not muted)
  useEffect(() => {
    if (isOpen && !isMutedRef.current && messages.length === 1) {
      speak(messages[0].text, isMutedRef);
    }
  }, [isOpen]); // intentionally only on open, not on mute changes

  // When mute is toggled, cancel any ongoing speech
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // mute just activated → cancel speech immediately
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(userMsg.text);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setTyping(false);

      // Speak only if not muted (using ref for latest value)
      speak(reply, isMutedRef);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Orb */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
        {isOpen ? <X size={28} color="white" /> : <MessageCircle size={28} color="white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col"
            style={{ maxHeight: "500px" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-semibold text-lg">
                Vidya – Portfolio Assistant
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-gray-200 rounded-bl-none border border-blue-500/30"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 rounded-xl px-4 py-2 text-gray-400 text-sm border border-blue-500/20">
                    Vidya is typing...
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ansh..."
                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;