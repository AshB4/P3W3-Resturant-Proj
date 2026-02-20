import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import Button from "../../components/Buttons/Button";
import BotIcon from "../../assets/BotIcon.png";
import "./Chatbot.css";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const WAITER_SYSTEM_PROMPT = `
You are an upscale restaurant waiter with subtle, intelligent humor — dry wit, never cheesy.
Only answer questions about food and drinks from the provided menu.
If asked about anything else, politely refuse and redirect to the menu.
Do not invent items.
Keep responses short, service-oriented, and tasteful.
If refusing, do NOT use humor.
`;

const INITIAL_ASSISTANT_MESSAGE =
  "Welcome to The 404 Lounge. Ask me about any food or drinks on our menu.";

export default function Chatbot() {
  const [menuItems, setMenuItems] = useState([]);
  const [messages, setMessages] = useState([
    { role: "assistant", content: INITIAL_ASSISTANT_MESSAGE }
  ]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("name, description, price, category")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading menu:", error);
        return;
      }

      setMenuItems(data || []);
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const menuContext = useMemo(() => {
    if (!menuItems.length) return "No menu items available.";

    return menuItems
      .map((item) => {
        return `${item.category}: ${item.name} ($${item.price}) - ${item.description}`;
      })
      .join("\n");
  }, [menuItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    setErrorMessage("");

    const userMessage = { role: "user", content: trimmedQuestion };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion("");

    if (!GEMINI_API_KEY) {
      setErrorMessage("Missing VITE_GEMINI_API_KEY in your environment.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I can answer menu questions, but my API key is not configured yet."
        }
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${WAITER_SYSTEM_PROMPT}

Menu:
${menuContext}

Conversation:
${updatedMessages
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n")}`
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorPayload = await safeJson(response);
        const apiMessage =
          errorPayload?.error?.message || `API error ${response.status}`;
        throw new Error(apiMessage);
      }

      const data = await response.json();
      const reply = extractAssistantReply(data);

      if (!reply) throw new Error("Empty AI response");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err) {
      console.error("Gemini error:", err);
      setErrorMessage("Could not get a response. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Apologies — I seem to have misplaced the answer. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-card">
        <div className="chatbot-header">
          <img src={BotIcon} alt="Restaurant assistant" className="chatbot-icon" />
          <div>
            <h2>Ask Our Waiter</h2>
            <p>Food and drinks from our menu only.</p>
          </div>
        </div>

        <div className="chat-window" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`chat-message ${message.role}`}
            >
              {message.role === "assistant" && (
                <img src={BotIcon} alt="" className="message-icon" />
              )}
              <p>{message.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message assistant">
              <img src={BotIcon} alt="" className="message-icon" />
              <p>Checking with the kitchen...</p>
            </div>
          )}

          <div ref={scrollAnchorRef} />
        </div>

        {errorMessage && (
          <p className="chat-feedback error">{errorMessage}</p>
        )}

        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about menu items, ingredients, or drinks..."
            className="chat-input"
          />
          <Button type="submit" disabled={isLoading || !question.trim()}>
            {isLoading ? "Asking..." : "Ask"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function extractAssistantReply(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((p) => p.text || "").join(" ").trim();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
