import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function SummaryBtn({ data }) {

	// Hàm tạo file Word và tải về
	const handleDownloadWord = () => {
		if (!data) {
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
							children: [new TextRun({ text: data, size: 24 })],
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
			<button className="start-button" onClick={handleDownloadWord}>
				📄 Tải tóm tắt dưới dạng Word
			</button>
		</div>
	);
}
