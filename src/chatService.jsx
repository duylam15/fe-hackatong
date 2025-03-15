import axios from "axios";

const API_URL = "http://127.0.0.1:8000/chat-with-ai/";

export const sendMessage = async (idUser, idChuDe, message) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        idUser,
        idChuDe,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về phản hồi từ API
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    return null;
  }
};
