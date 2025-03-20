import React, { useState, useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message, Spin, Progress } from "antd";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import "./MindMapGenerator.css";
import MindMap from "./MindMap";

export default function MindMapGenerator() {
	const [fileList, setFileList] = useState([]);
	const [apiData, setApiData] = useState();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showMindMap, setShowMindMap] = useState(false);
	const [watchMindMap, setWatchMindMap] = useState(false);

	const handleChange = ({ fileList }) => {
		setFileList(fileList);
	};

	const handleUpload = async (type) => {
		if (fileList.length === 0) {
			message.warning("Vui lòng chọn file trước khi tải lên!");
			return;
		}

		setLoading(true);
		setProgress(10);

		const formData = new FormData();
		formData.append("file", fileList[0].originFileObj);

		try {
			const uploadResponse = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
				onUploadProgress: (progressEvent) => {
					const percent = Math.round((progressEvent.loaded / progressEvent.total) * 50);
					setProgress(percent);
				},
			});

			message.success("Tải lên thành công!");
			setProgress(60);

			let summarizeResponse = null;
			if (type === "detail") {
				try {
					summarizeResponse = await axios.post("http://127.0.0.1:8000/summarize-text/", {
						text: uploadResponse.data.content,
					});
					setProgress(80);
					message.success("Tóm tắt thành công!");
					console.log("summarizeResponsesummarizeResponsesummarizeResponse", summarizeResponse)
					setApiData(summarizeResponse.data.summary);
				} catch (error) {
					message.error("Tóm tắt thất bại!");
					throw error;
				}
			}

			if (type === "short") {
				try {
					summarizeResponse = await axios.post("http://127.0.0.1:8000/summarize-text-short/", {
						text: uploadResponse.data.content,
					});
					setProgress(80);
					message.success("Tóm tắt thành công!");
					setApiData(summarizeResponse.data.summary);
				} catch (error) {
					message.error("Tóm tắt thất bại!");
					throw error;
				}
			}

			const shortSummary = summarizeResponse.data.summary.split(" ").slice(0, 20).join(" ");
			const chuDe = {
				name_chu_de: summarizeResponse.data.title,
				noi_dung: shortSummary,
			};

			const response = await axios.post("http://localhost:8000/api/chude/", chuDe);
			if (response.status === 201) {
				message.success("Lưu chủ đề thành công! ID: " + response.data.id);
				localStorage.setItem("idChuDe", response.data.id);
				setProgress(100);
				setWatchMindMap(true)
			}
		} catch (error) {
			message.error("Tải lên, tóm tắt hoặc lưu chủ đề thất bại!");
			console.error("Lỗi:", error);
		} finally {
			setTimeout(() => {
				setLoading(false);
				setProgress(0);
			}, 1000);
		}
	};

	// Chuyển sang MindMap
	const handleShowMindMap = () => {
		setShowMindMap(true);
	};


	// Chuyển về khu vực tải lên
	const handleBack = () => {
		setShowMindMap(false);
	};

	return (
		<div className="main-container">
			<AnimatePresence mode="wait">
				{!showMindMap ? (
					<motion.div
						key="upload-section"
						className="container"
						initial={{ x: 0, opacity: 1 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "-100%", opacity: 0 }}
						transition={{ duration: 0.4 }}
					>
						<h1 className="title">Tổng hợp, luyện tập, tiến bộ - Tất cả trong một</h1>
						<h2 className="subtitle">Hình dung mọi thứ</h2>
						<p className="description">
							Trình tạo sơ đồ tư duy, tạo bài tập và hỏi đáp cùng AI
						</p>

						<div className="upload-box">
							{loading && (
								<Progress percent={progress} showInfo={false} strokeColor="#1890ff" status="active" />
							)}
							<Upload
								beforeUpload={(file) => {
									setFileList([file]);
									return false;
								}}
								onChange={handleChange}
								disabled={loading}
								fileList={fileList}
								showUploadList={false}
							>
								<Button icon={!loading ? <UploadOutlined /> : <Spin size="small" />} className="upload-button" loading={loading}>
									{loading ? (
										""
									) : fileList.length > 0 ? (
										<p className="upload-text">{fileList[0].name}</p>
									) : (
										<>
											<p className="upload-text">Nhấn để tải lên</p>
											<p className="upload-note">Hỗ trợ PDF, DOC</p>
										</>
									)}
								</Button>
							</Upload>
						</div>
						<div className="btn-group">
							<Button type="primary" size="large" className="start-button" disabled={loading} onClick={() => handleUpload("short")}>
								✨ Tóm tắt ngắn gọn
							</Button>
							<Button type="primary" size="large" className="start-button" disabled={loading} onClick={() => handleUpload("detail")}>
								✨ Tóm tắt chi tiết
							</Button>
							{watchMindMap ? <Button type="primary" size="large" className="start-button" disabled={loading} onClick={handleShowMindMap}>
								✨ Xem MindMap
							</Button> : <></>}
						</div>
					</motion.div>
				) : (
					<motion.div
						key="mindmap-section"
						className="mindmap-container"
						initial={{ x: "100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "100%", opacity: 0 }}
						transition={{ duration: 0.4 }}
					>

						<div className="mindmap-wrapper">
							<MindMap data={apiData} />
						</div>
						<div className="btn-group-2">
							<Button type="default" size="large" className="back-button" onClick={handleBack}>
								⬅ Quay lại
							</Button>
						</div>

					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
