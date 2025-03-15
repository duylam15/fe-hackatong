import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import MindMapGenerator from "./MindMapGenerator";
import MainLayout from "./MainLayout";

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/" element={<MindMapGenerator />} />
				</Route>
				<Route path="/login" element={<LoginForm />} />
			</Routes>
		</Router>
	);
};

export default AppRouter;
