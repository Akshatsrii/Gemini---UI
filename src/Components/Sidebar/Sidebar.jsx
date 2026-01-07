import React, { useState, useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import {
  SignOutButton,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);

  const { prevPrompts, handleHistoryClick, newChat } =
    useContext(Context);

  // 📥 DOWNLOAD HISTORY
  const downloadHistory = () => {
    if (prevPrompts.length === 0) return;

    const content = prevPrompts
      .map((prompt, index) => `${index + 1}. ${prompt}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={`sidebar ${extended ? "open" : "closed"}`}>
      {/* ================= TOP ================= */}
      <div className="sidebar-top">
        <div className="brand-row">
          <img
            src={assets.menu_icon}
            className="menu-icon"
            alt="menu"
            onClick={() => setExtended(!extended)}
          />
          {extended && <h2 className="brand-name">AK GPT</h2>}
        </div>

        {/* ===== CLERK USER ACCOUNT ===== */}
        {extended && (
          <div className="clerk-user">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="signin-btn">Sign In</button>
              </SignInButton>
            </SignedOut>
          </div>
        )}

        <div className="new-chat" onClick={newChat}>
          <img src={assets.plus_icon} alt="new chat" />
          {extended && <span>New Chat</span>}
        </div>
      </div>

      {/* ================= RECENT ================= */}
      {extended && (
        <div className="sidebar-recent">
          <p className="title">Recent</p>

          {prevPrompts.length === 0 ? (
            <p className="empty">No recent chats</p>
          ) : (
            prevPrompts.map((prompt, index) => (
              <div
                key={index}
                className="recent-item"
                onClick={() => handleHistoryClick(prompt)}
              >
                <img src={assets.message_icon} alt="chat" />
                <span>
                  {prompt.length > 30
                    ? prompt.slice(0, 30) + "..."
                    : prompt}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= BOTTOM ================= */}
      <div className="sidebar-bottom">
        <div className="bottom-item">
          <img src={assets.question_icon} alt="help" />
          {extended && <span>Help</span>}
        </div>

        <div className="bottom-item">
          <img src={assets.history_icon} alt="activity" />
          {extended && <span>Activity</span>}
        </div>

        <div
          className={`bottom-item ${
            prevPrompts.length === 0 ? "disabled" : ""
          }`}
          onClick={downloadHistory}
        >
          <img
            src={assets.download_icon || assets.history_icon}
            alt="download"
          />
          {extended && <span>Download History</span>}
        </div>

        <div className="bottom-item">
          <img src={assets.setting_icon} alt="settings" />
          {extended && <span>Settings</span>}
        </div>

        {/* ===== TEXT-ONLY CLERK SIGN OUT ===== */}
        <SignedIn>
          <SignOutButton afterSignOutUrl="/">
            <div className="bottom-item logout">
              {extended && <span>Sign out</span>}
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default Sidebar;
