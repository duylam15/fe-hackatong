import React, { useState, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import { toPng } from "html-to-image";
import axios from "axios";
import { Button } from "antd";
import Questions from "../Question/questions";
import { motion, AnimatePresence } from "framer-motion";
import { Spin } from "antd";


const MindMap = (data) => {
	console.log("data MindMap", data.data);
	const [summary, setSummary] = useState(null);
	const [showQuestions, setShowQuestions] = useState(false); // State để điều khiển hiển thị
	const mindmapRef = useRef(null);

	const [loading, setLoading] = useState(false); // Thêm state loading

	useEffect(() => {
		const fetchSummary = async () => {
			setLoading(true); // Bật loading
			try {
				const response = await axios.post("http://127.0.0.1:8000/summarize/", {
					text: data?.data,
					mode: "normal",
				});
				setSummary(response.data.summary);
			} catch (error) {
				console.error("Lỗi khi gọi API:", error);
			} finally {
				setLoading(false); // Tắt loading
			}
		};

		if (data?.data) fetchSummary();
	}, [data]);
	const generateNodesAndEdges = (data, parentId = null, x = 0, y = 0, depth = 0) => {
		let nodes = [];
		let edges = [];
		const id = `${parentId ? parentId + "-" : ""}${data.title}`;
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

	const handleDownload = () => {
		if (mindmapRef.current) {
			const controls = mindmapRef.current.querySelector(".react-flow__controls");
			if (controls) controls.style.display = "none";

			toPng(mindmapRef.current)
				.then((dataUrl) => {
					if (controls) controls.style.display = "block";

					const link = document.createElement("a");
					link.href = dataUrl;
					link.download = "mindmap.png";
					link.click();
				})
				.catch((err) => {
					console.error("Lỗi khi tải ảnh:", err);
					if (controls) controls.style.display = "block";
				});
		}
	};

	return (
		<div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>
			<AnimatePresence mode="wait">
				{!showQuestions ? (
					<motion.div
						key="mindmap"
						initial={{ x: 0 }}
						animate={{ x: 0 }}
						exit={{ x: "-100%", opacity: 0 }}
						transition={{ duration: 0.4 }}
						style={{ width: "100%", height: "100%" }}
					>
						<div style={{ width: "80%", height: "80vh", border: "1px solid #ddd", margin: "auto", position: "relative" }}>
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

							<div ref={mindmapRef} style={{ width: "95%", height: "100%", marginLeft: "20px" }}>
								{loading ? (
									<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
										<Spin size="large" tip="Đang tải dữ liệu..." />
									</div>
								) : (
									<ReactFlow nodes={elements.nodes} edges={elements.edges}>
										<Controls />
										<Background />
									</ReactFlow>
								)}
							</div>


							<Button
								type="default"
								size="large"
								className="back-button-mindmap"
								onClick={() => setShowQuestions(true)}
							>
								Làm bài tập
							</Button>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="questions"
						initial={{ x: "100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "100%", opacity: 0 }}
						transition={{ duration: 0.4 }}
						style={{ width: "100%", height: "100%" }}
					>
						<Questions data={data.data} />
						<Button type="default" size="large" className="question-back-BTN" onClick={() => setShowQuestions(false)}>
							⬅ Quay lại
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MindMap;
