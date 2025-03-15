import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import MindMap from "./MindMap";
import Chat from "./Chat";
import MindMapGenerator from "./MindMapGenerator";

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MindMapGenerator />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/login" element={<LoginForm />} />
			</Routes>
		</Router>
	);
};

export default AppRouter;
