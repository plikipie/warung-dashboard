"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ChatLogs() {
  const supabase = createClient();
  const [chatIds, setChatIds] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load semua unique chat_id
  async function loadChatIds() {
    setLoading(true);
    const { data } = await supabase
      .from("conversations")
      .select("chat_id")
      .neq("role", "system")
      .order("created_at", { ascending: false });

    // Deduplicate chat_id
    const unique = [...new Set(data?.map((d) => d.chat_id) || [])];
    setChatIds(unique);
    setLoading(false);
  }

  // Load messages dari chat_id tertentu
  async function loadMessages(chatId) {
    setSelectedChat(chatId);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("chat_id", chatId)
      .neq("role", "system")
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  useEffect(() => {
    loadChatIds();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💬 Chat Logs</h1>
        <p className="text-gray-500">Riwayat percakapan customer</p>
      </div>

      <div className="flex gap-6 h-[700px]">
        {/* Sidebar Chat List */}
        <div className="w-64 bg-white rounded-xl shadow overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">Daftar Customer</h2>
            <p className="text-xs text-gray-500">{chatIds.length} percakapan</p>
          </div>
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : chatIds.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Belum ada percakapan
            </div>
          ) : (
            chatIds.map((chatId) => (
              <button
                key={chatId}
                onClick={() => loadMessages(chatId)}
                className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                  selectedChat === chatId
                    ? "bg-green-50 border-l-4 border-l-green-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold">
                    {chatId.slice(-2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Customer
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: ...{chatId.slice(-6)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-xl shadow flex flex-col">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-2">💬</p>
                <p>Pilih customer untuk lihat percakapan</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {selectedChat.slice(-2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Customer</p>
                  <p className="text-xs text-gray-500">ID: {selectedChat}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-green-500 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${msg.role === "user" ? "text-green-100" : "text-gray-400"}`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
