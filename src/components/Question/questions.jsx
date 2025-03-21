import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Chat from "../Chat/Chat";
import { Spin } from "antd";

export default function Questions({ data }) {
	const [questions, setQuestions] = useState([]);
	const [showQuestions, setShowQuestions] = useState(false);
	const [option, setOption] = useState("short_answer"); // Lựa chọn loại câu hỏi
	const [selectedAnswers, setSelectedAnswers] = useState({}); // Lưu trạng thái các đáp án đã chọn
	const [submittedAnswers, setSubmittedAnswers] = useState({});
	const [loading, setLoading] = useState(false); // Thêm state loading
	const [submittedMCAnswers, setSubmittedMCAnswers] = useState({}); // Lưu trạng thái câu trả lời trắc nghiệm đã chọn


	useEffect(() => {
		console.log("Data generate-exercise nhận vào:", data);

		const fetchExercise = async () => {
			setLoading(true); // Bật loading
			try {
				const response = await axios.post("http://127.0.0.1:8000/generate-exercise/", {
					text: data,
					type: option, // Gửi loại câu hỏi được chọn
				});

				console.log("API response:", response.data.exercise);
				setQuestions(response.data.exercise); // Lưu danh sách câu hỏi vào state
				setSelectedAnswers({}); // Reset lại trạng thái chọn đáp án khi load câu hỏi mới
			} catch (error) {
				console.error("Lỗi khi gọi API:", error);
			} finally {
				setLoading(false); // Tắt loading
			}
		};

		if (option && data) {
			fetchExercise();
		}
	}, [option, data]);

	// Xử lý khi người dùng chọn đáp án trắc nghiệm
	const handleMCAnswerSelect = (questionIndex, answer, correctAnswer) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: answer,
		}));

		setSubmittedMCAnswers((prev) => ({
			...prev,
			[questionIndex]: answer === correctAnswer,
		}));
	};
	// Xử lý khi người dùng chọn đáp án
	const handleAnswerSelect = (questionIndex, answer) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: answer,
		}));
	};
	// Hàm tạo file Word và tải về
	const handleDownloadWord = () => {
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [new TextRun({ text: "Danh sách câu hỏi", bold: true, size: 28 })],
						}),
						...questions.map((q, index) =>
							new Paragraph({
								children: [new TextRun({ text: `${index + 1}. ${q.question}`, size: 24 })],
							})
						),
					],
				},
			],
		});

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, "Danh_sach_cau_hoi.docx");
		});
	};

	return (
		<div className="question-container">
			{/* Chọn loại câu hỏi */}
			<div className="options-container">
				<label>
					<input type="radio" name="questionType" value="short_answer" onChange={(e) => setOption(e.target.value)} defaultChecked disabled={loading} />
					Tự luận
				</label>
				<label>
					<input type="radio" name="questionType" value="multiple_choice" onChange={(e) => setOption(e.target.value)} disabled={loading} />
					Trắc nghiệm
				</label>
				<label>
					<input type="radio" name="questionType" value="fill_in_the_blank" onChange={(e) => setOption(e.target.value)} disabled={loading} />
					Điền vào chỗ trống
				</label>
			</div>
			{/* */}
			{/* Danh sách câu hỏi */}
			<div className="question-list">
				<h2>Danh sách câu hỏi:</h2>
				{loading ? (
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
						<Spin size="large" tip="Đang tạo câu hỏi..." />
					</div>
				) : (
					<ul className="list-over">
						{questions.map((q, index) => (
							<li key={index} className="question-item">
								{q.type === "multiple_choice" && q.options ? (
									<ul className="options-list">
										<p className="heading-question">
											Câu {index + 1}: {q.question}
										</p>
										{q.options.map((option, i) => (
											<div className="option-item-group" key={i}>
												<div
													className={`option-item ${selectedAnswers[index] === option ? "selected" : ""}`}
													onClick={() => handleMCAnswerSelect(index, option, q.correct_answer)} // Gọi xử lý kiểm tra
												>
													{option}
												</div>
											</div>
										))}
										{submittedMCAnswers[index] !== undefined && (
											<p className={submittedMCAnswers[index] ? "answer-correct" : "answer-wrong"}>
												{submittedMCAnswers[index] ? "✅ Chính xác!" : `❌ Sai! Đáp án đúng là: ${q.correct_answer}`}
											</p>
										)}
									</ul>
								) : q.type === "fill_in_the_blank" ? (
									<>
										<div className="fill_in_the_blank--wrap">
											<p className="heading-question">
												Câu {index + 1}: {q.question}
											</p>
											<div className="fill_in_the_blank--wrap-2">
												<input
													type="text"
													className="input-answer"
													value={selectedAnswers[index] || ""}
													onChange={(e) => setSelectedAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
												/>
												<button
													className="submit-answer"
													onClick={() => {
														setSubmittedAnswers((prev) => ({
															...prev,
															[index]: selectedAnswers[index],
														}));
													}}
												>
													Gửi
												</button>
												{submittedAnswers[index] && (
													<p className={submittedAnswers[index] === q.correct_answer ? "answer-correct" : "answer-wrong"}>
														{submittedAnswers[index] === q.correct_answer
															? "✅ Chính xác!"
															: `❌ Sai! Đáp án đúng là: ${q.correct_answer}`}
													</p>
												)}
											</div>
										</div>
									</>
								) : (
									<p className="heading-question">Câu {index + 1}: {q.question}</p>
								)}
							</li>
						))}
					</ul>
				)}
				{!loading && (
					<button className="download-button" onClick={handleDownloadWord}>
						📄 Tải câu hỏi dưới dạng Word
					</button>
				)}
			</div>
			<Chat />
		</div>
	);
}
