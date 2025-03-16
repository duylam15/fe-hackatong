import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import MindMap from "./MindMap";
import MindMapGenerator from "./MindMapGenerator";
import MainLayout from "./MainLayout";
import Chat from "./Chat";
import RegisterForm from "./RegisterForm";

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
