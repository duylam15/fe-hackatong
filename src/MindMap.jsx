import React, { useState, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import { toPng } from "html-to-image";
import axios from "axios";

const MindMap = (data) => {
	console.log("data MindMapMindMapMindMap", data.data)
	const [summary, setSummary] = useState(null);

	console.log("summary", summary)

	useEffect(() => {
		console.log("Data nhận vào:", data.data);
		const fetchSummary = async () => {
			try {
				const response = await axios.post("http://127.0.0.1:8000/summarize/", {
					text: data?.data,
					mode: "normal",
				});

				console.log("API ResponseResponseResponseResponse:", response.data.summary);
				setSummary(response.data.summary); // Cập nhật state với kết quả tóm tắt
				console.log("summary Response", summary)
			} catch (error) {
				console.error("Lỗi khi gọi API:", error);
			}
		};

		if (data?.data) {
			fetchSummary();
		}
	}, [data]);



	console.log("summary", summary)

	const generateNodesAndEdges = (data, parentId = null, x = 0, y = 0, depth = 0) => {
		let nodes = [];
		let edges = [];

		const id = `${parentId ? parentId + "-" : ""}${data.title}`;

		// Mảng màu theo cấp độ
		const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF", "#B9FBC0"];
		const nodeColor = colors[depth % colors.length];

		nodes.push({
			id,
			data: { label: data.title },
			position: { x, y },
			style: {
				backgroundColor: nodeColor,
				border: "2px solid #333",
				borderRadius: "8px",
				padding: "10px",
				fontSize: "14px",
				color: "#333",
				textAlign: "center",
				width: "200px",
			},
		});

		if (parentId) {
			edges.push({
				id: `e-${parentId}-${id}`,
				source: parentId,
				target: id,
				type: "straight",
				animated: true,
				style: { stroke: "#555", strokeWidth: 2 },
			});
		}

		if (data.children) {
			const spacingX = 250;
			const baseSpacingY = 80;
			const maxChildren = Math.max(...data.children.map(child => (child.children ? child.children.length : 0)), 1);
			const spacingY = baseSpacingY * maxChildren;
			let newY = y - ((data.children.length - 1) * spacingY) / 2;

			data.children.forEach((child, index) => {
				const newX = x + spacingX;
				const childNodesAndEdges = generateNodesAndEdges(child, id, newX, newY, depth + 1);

				nodes = [...nodes, ...childNodesAndEdges.nodes];
				edges = [...edges, ...childNodesAndEdges.edges];

				newY += spacingY;
			});
		}

		return { nodes, edges };
	};

	const [elements, setElements] = useState({ nodes: [], edges: [] });

	useEffect(() => {
		if (summary) {
			const { nodes, edges } = generateNodesAndEdges(summary);
			setElements({ nodes, edges });
		}
	}, [summary]);



	const mindmapRef = useRef(null);

	const handleDownload = () => {
		if (mindmapRef.current) {
			// Ẩn Controls trước khi chụp
			const controls = mindmapRef.current.querySelector(".react-flow__controls");
			if (controls) controls.style.display = "none";

			toPng(mindmapRef.current)
				.then((dataUrl) => {
					// Hiện lại Controls sau khi chụp
					if (controls) controls.style.display = "block";

					const link = document.createElement("a");
					link.href = dataUrl;
					link.download = "mindmap.png";
					link.click();
				})
				.catch((err) => {
					console.error("Lỗi khi tải ảnh:", err);
					// Hiện lại Controls nếu có lỗi
					if (controls) controls.style.display = "block";
				});
		}
	};

	return (
		<div style={{ width: "100%", height: "600px", border: "1px solid #ddd", position: "relative" }}>
			<button
				onClick={handleDownload}
				style={{
					position: "absolute",
					top: 10,
					right: 10,
					padding: "8px 12px",
					backgroundColor: "#007BFF",
					color: "#fff",
					border: "none",
					borderRadius: "5px",
					cursor: "pointer",
					zIndex: 10,
				}}
			>
				📥 Tải Mindmap
			</button>
			<div ref={mindmapRef} style={{ width: "100%", height: "100%" }}>
				<ReactFlow nodes={elements.nodes} edges={elements.edges}>
					<Controls />
					<Background />
				</ReactFlow>
			</div>
		</div>
	);
};

export default MindMap;