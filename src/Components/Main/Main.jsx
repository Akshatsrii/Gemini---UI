import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import ReactMarkdown from "react-markdown";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Main = () => {
  const {
    input,
    setInput,
    chat,
    typingText,
    isTyping,
    onSent,
    handleKeyPress,
  } = useContext(Context);

  const { user } = useUser();

  return (
    <div className="main">
      {/* ================= NAVBAR ================= */}
      <div className="nav">
        <p className="nav-username">
          {  "AK GTP"}
        </p>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="signin-btn">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>

      {/* ================= MAIN BODY ================= */}
      <div className="main-container">
        {/* ===== HOME / CHAT AREA ===== */}
        {chat.length === 0 && !isTyping ? (
          <div className="home-content">
            <div className="greet">
              <h1 className="hello">
                Hello, {user?.firstName || "User"}.
              </h1>
              <p className="sub">How can I help you today?</p>
            </div>

            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  onSent(
                    "Suggest beautiful places to see on an upcoming road trip"
                  )
                }
              >
                <p>
                  Suggest beautiful places to see on an upcoming road trip
                </p>
                <img src={assets.compass_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  onSent(
                    "Briefly summarize this concept: urban planning"
                  )
                }
              >
                <p>
                  Briefly summarize this concept: urban planning
                </p>
                <img src={assets.bulb_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  onSent(
                    "Brainstorm team bonding activities for our work retreat"
                  )
                }
              >
                <p>
                  Brainstorm team bonding activities for our work retreat
                </p>
                <img src={assets.message_icon} alt="" />
              </div>

              <div
                className="card"
                onClick={() =>
                  onSent(
                    "Improve the readability of the following code"
                  )
                }
              >
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-area">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.role === "user" ? "user-bubble" : "bot-bubble"
                }`}
              >
                {msg.role === "bot" && (
                  <img
                    src={assets.gemini_icon}
                    className="bot-icon"
                    alt="bot"
                  />
                )}
                <div className="bubble-text">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble bot-bubble">
                <img
                  src={assets.gemini_icon}
                  className="bot-icon"
                  alt="bot"
                />
                <div className="bubble-text typing">
                  <ReactMarkdown>{typingText}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PROMPT BAR (FIXED BOTTOM) ===== */}
        <div className="prompt-wrapper">
          <div className="prompt-bar">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <div className="prompt-icons">
              <img src={assets.gallery_icon} alt="gallery" />
              <img src={assets.mic_icon} alt="mic" />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={() => input.trim() && onSent(input)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
