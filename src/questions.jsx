import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function Questions({ data }) {
	const [questions, setQuestions] = useState([]);
	const [showQuestions, setShowQuestions] = useState(false);
	const [option, setOption] = useState(""); // Lựa chọn loại câu hỏi

	useEffect(() => {
		console.log("Data generate-exercise nhận vào:", data);

		const fetchExercise = async () => {
			try {
				const response = await axios.post("http://127.0.0.1:8000/generate-exercise/", {
					text: data,
					type: option, // Gửi loại câu hỏi được chọn
				});

				console.log("API generate-exercisegenerate-exercise:", response.data.exercise);
				setQuestions(response.data.exercise); // Lưu danh sách câu hỏi vào state
			} catch (error) {
				console.error("Lỗi khi gọi API:", error);
			}
		};

		if (option && data) {
			fetchExercise();
		}
	}, [option, data]); // Khi option hoặc data thay đổi thì fetch API

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
			{!showQuestions ? (
				<button className="toggle-button" onClick={() => setShowQuestions(true)}>
					📖 Câu hỏi ôn tập
				</button>
			) : (
				<>
					<button className="toggle-button" onClick={() => setShowQuestions(false)}>
						Ẩn câu hỏi
					</button>

					{/* Chọn loại câu hỏi */}
					<div className="options-container">
						<label>
							<input type="radio" name="questionType" value="fill_in_the_blank" onChange={(e) => setOption(e.target.value)} />
							Điền vào chỗ trống
						</label>
						<label>
								<input type="radio" name="questionType" value="short_answer" onChange={(e) => setOption(e.target.value)} />
							Tự luận
						</label>
						<label>
							<input type="radio" name="questionType" value="multiple_choice" onChange={(e) => setOption(e.target.value)} />
							Trắc nghiệm
						</label>
					</div>

					{/* Danh sách câu hỏi */}
					{questions.length > 0 && (
						<div className="question-list">
							<h2>Danh sách câu hỏi:</h2>
							<ul>
								{questions.map((q, index) => (
									<li key={index}>{q.question}</li>
								))}
							</ul>
							<button className="download-button" onClick={handleDownloadWord}>
								📄 Tải câu hỏi dưới dạng Word
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
