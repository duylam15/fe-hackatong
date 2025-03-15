import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import axios from "axios";
import "./MindMapGenerator.css"; // Import file CSS
import MindMap from "./MindMap";
import Questions from "./questions";
import SummaryBtn from "./SummaryBtn";
import Chat from "./Chat";


export default function MindMapGenerator() {
	const [fileList, setFileList] = useState([]);
	const [apiData, setApiData] = useState([]);

	// Xử lý khi chọn file
	const handleChange = ({ fileList }) => {
		setFileList(fileList);
	};

	// Gửi file lên backend
	const handleUpload = async () => {
		if (fileList.length === 0) {
			message.warning("Vui lòng chọn file trước khi tải lên!");
			return;
		}

		const formData = new FormData();
		formData.append("file", fileList[0].originFileObj);

		try {
			// Gửi file lên backend
			const uploadResponse = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			message.success("Tải lên thành công!");
			console.log("Phản hồi từ server:", uploadResponse.data.content);

			// Gọi API tóm tắt sau khi nhận được nội dung file
			const summarizeResponse = await axios.post("http://127.0.0.1:8000/summarize-text/", {
				text: uploadResponse.data.content,
			});


			// Cập nhật apiData
			setApiData(summarizeResponse.data.summary);
			message.success("Tóm tắt thành công!");
			console.log("Phản hồi từ summarize:", summarizeResponse.data.summary);

			// Chỉ lấy 10 từ đầu tiên
			const shortSummary = summarizeResponse.data.summary.split(" ").slice(0, 20).join(" ");

			// Lưu chủ đề vào backend
			const chuDe = {
				name_chu_de: "Chủ đề mới", // Bạn có thể thay đổi tên chủ đề theo ý muốn
				noi_dung: shortSummary
			};

			console.log("Chủ đề sẽ lưu:", chuDe);


			const response = await axios.post("http://localhost:8000/api/chude/", chuDe);
			if (response.status === 201) {
				message.success("Lưu chủ đề thành công! ID: " + response.data.id);
				localStorage.setItem("idChuDe", response.data.id); // Lưu vào localStorage
				console.log("Chủ đề đã lưu:", response.data);
			}

		} catch (error) {
			message.error("Tải lên, tóm tắt hoặc lưu chủ đề thất bại!");
			console.error("Lỗi:", error);
		}
	};



	return (
		<div className="container">
			{/* Tiêu đề */}
			<h1 className="title">Trình tạo sơ đồ tư duy AI</h1>
			<h2 className="subtitle">Hình dung mọi thứ</h2>
			<p className="description">
				Biến ý tưởng thành bản đồ tư duy rõ ràng, hấp dẫn trong vài giây, từ đầu vào văn bản đến video.
			</p>

			{/* Thanh chọn kiểu tải lên */}
			<div className="upload-options">
				<button className="option">📌 Lời gợi ý đơn giản</button>
				<button className="option active">📄 PDF / Tài liệu</button>
				<button className="option">📝 Văn bản dài</button>
				<button className="option">🌐 Trang web</button>
				<button className="option">🎥 YouTube</button>
				<button className="option">🖼 Hình ảnh</button>
			</div>

			{/* Khu vực tải lên */}
			<div className="upload-box">
				<Upload
					beforeUpload={(file) => {
						setFileList([file]); // Cập nhật lại danh sách chỉ với file mới
						return false; // Không tự động upload
					}}
					onChange={handleChange}
					fileList={fileList}
					showUploadList={false} // Ẩn danh sách file bên dưới
				>
					<Button icon={<UploadOutlined />} className="upload-button">
						{fileList.length > 0 ? (
							<p className="upload-text">{fileList[0].name}</p> // Hiển thị tên file đã chọn
						) : (
							<>
								<p className="upload-text">Nhấn để tải lên</p>
								<p className="upload-note">Hỗ trợ PDF, DOC, Excel, TXT, PNG, JPG</p>
							</>
						)}
					</Button>
				</Upload>
			</div>

			{/* Nút gửi file */}
			<Button type="primary" size="large" className="start-button" onClick={handleUpload}>
				✨ Bắt đầu tạo
			</Button>

			<div style={{ width: "80vw", height: "100vh" }}>
				<SummaryBtn data={apiData} />
				<Questions data={apiData} />
				<MindMap data={apiData} />
				<Chat />
			</div>
		</div>
	);
}
