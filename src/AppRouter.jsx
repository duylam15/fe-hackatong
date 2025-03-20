import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import MindMap from "./components/Mindmap/MindMap";
import MindMapGenerator from "./components/Mindmap/MindMapGenerator";
import MainLayout from "./components/MainLayout";
import Chat from "./components/Chat/Chat";
import RegisterForm from "./components/Auth/RegisterForm";

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/" element={<MindMapGenerator />} />
					<Route path="/chat" element={<Chat />} />
				</Route>
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
			</Routes>
		</Router>
	);
};

export default AppRouter;
