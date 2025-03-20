import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function SummaryBtn({ data }) {
	const [summary, setSummary] = useState("");

	useEffect(() => {
		if (!data) return;

		console.log("Data summarize-text nhận vào:", data);

		const fetchSummary = async () => {
			try {
				const response = await axios.post("http://127.0.0.1:8000/summarize-text/", {
					text: data,
				});
				console.log("API response summarize:", response.data.summary);
				setSummary(response.data.summary);
			} catch (error) {
				console.error("Lỗi khi gọi API:", error);
			}
		};

		fetchSummary();
	}, [data]);

	// Hàm tạo file Word và tải về
	const handleDownloadWord = () => {
		if (!summary) {
			alert("Chưa có nội dung tóm tắt để tải!");
			return;
		}

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [new TextRun({ text: "Bản Tóm Tắt", bold: true, size: 28 })],
						}),
						new Paragraph({
							children: [new TextRun({ text: summary, size: 24 })],
						}),
					],
				},
			],
		});

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, "Tom_Tat.docx");
		});
	};

	return (
		<div className="summary-container">
			<button className="download-button" onClick={handleDownloadWord}>
				📄 Tải tóm tắt dưới dạng Word
			</button>
		</div>
	);
}
