import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoSend, IoMic, IoMicOff, IoVolumeHigh, IoChatbubbleEllipsesOutline, IoClose } from "react-icons/io5";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  console.log("messages hiện tại:", messages);
  console.log("newMessage hiện tại:", newMessage);
  console.log("isListening hiện tại:", isListening);
  console.log("isChatOpen hiện tại:", isChatOpen);

  // Lấy danh sách giọng nói khả dụng
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log("Danh sách giọng nói khả dụng:", availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Khởi tạo Speech Recognition (Speech-to-Text)
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "vi-VN";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
        console.log("Nhận diện giọng nói (realtime):", transcript, "isFinal:", isFinal);

        setNewMessage(transcript);

        if (isFinal) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            if (transcript.trim()) {
              sendMessage(transcript);
            }
          }, 1500); // Thay đổi thời gian delay thành 1.5 giây (1500ms)
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log("Ngừng nhận diện giọng nói");
        setIsListening(false);
      };
    } else {
      console.warn("Trình duyệt không hỗ trợ Speech Recognition!");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Gửi tin nhắn và nhận phản hồi từ API
  const sendMessage = async (messageToSend) => {
    const message = messageToSend || newMessage;
    if (message.trim() === "") return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log("Gửi tin nhắn tới API:", message);
      const idChuDe = localStorage.getItem("idChuDe"); // Lấy ID chủ đề
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("useruseruseruser", user.id)
      console.log("useruseruseruser", idChuDe)
      const response = await axios.post("http://127.0.0.1:8000/chat-with-ai/", {
        idUser: user.id,
        idChuDe: idChuDe,
        message: message,
      });

      console.log("API ResponseChatResponseChatResponse:", response.data.response);
      const aiMessage = { sender: "ai", text: response.data.response || "Tôi không hiểu, bạn có thể nói rõ hơn không?" };
      setMessages((prev) => [...prev, aiMessage]);
      console.log("messages sau khi thêm phản hồi:", messages);

      speakText(aiMessage.text);
    } catch (error) {
      console.error("Lỗi khi gọi API chat:", error);
      const errorMessage = { sender: "ai", text: "Có lỗi xảy ra, vui lòng thử lại!" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setNewMessage("");
  };

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    console.log("Cuộn xuống dưới cùng khi messages thay đổi:", messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("Nhấn Enter để gửi tin nhắn:", newMessage);
      sendMessage();
    }
  };

  // Bật/tắt nhận diện giọng nói
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Đọc to văn bản bằng Text-to-Speech
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const vietnameseVoice = voices.find(
        (voice) => voice.lang.includes("vi-VN") || voice.lang.includes("vi")
      );

      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
        console.log("Đã chọn giọng tiếng Việt:", vietnameseVoice.name);
      } else {
        console.warn("Không tìm thấy giọng tiếng Việt, sử dụng giọng mặc định!");
      }

      utterance.lang = "vi-VN";
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      console.log("Đang đọc to:", text);
    } else {
      console.warn("Trình duyệt không hỗ trợ Text-to-Speech!");
    }
  };

  // Đọc lại tin nhắn khi nhấn vào nút loa
  const handleSpeakMessage = (text) => {
    speakText(text);
  };

  // Bật/tắt cửa sổ chat
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="chat-bubble-container">
      {/* Nút bong bóng nổi */}
      <button className="chat-bubble-button" onClick={toggleChat}>
        {isChatOpen ? <IoClose size={30} /> : <IoChatbubbleEllipsesOutline size={30} />}
      </button>

      {/* Cửa sổ chat */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h2>Chat về gia đình</h2>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender === "user" ? "user-message" : "ai-message"
                  }`}
              >
                <p>{message.text}</p>
                <button
                  className="speak-button"
                  onClick={() => handleSpeakMessage(message.text)}
                  title="Nghe lại tin nhắn"
                >
                  <IoVolumeHigh />
                </button>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-footer">
            <button
              className={`mic-button ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title={isListening ? "Tắt micro" : "Bật micro"}
            >
              {isListening ? <IoMicOff /> : <IoMic />}
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                console.log("Đang nhập tin nhắn:", e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Nhập hoặc nói tin nhắn..."
            />
            <button onClick={() => sendMessage()} title="Gửi tin nhắn">
              <IoSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;