import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Nếu có thanh điều hướng

const MainLayout = () => {
	return (
		<div className="layout">
			<div className="navbarrrr"><Navbar /></div>
			<div className="content">
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
