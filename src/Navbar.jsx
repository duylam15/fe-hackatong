import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();
	const [showLogout, setShowLogout] = useState(false); // Kiểm soát hiển thị nút Đăng xuất

	// Lấy user từ localStorage
	const user = JSON.parse(localStorage.getItem("user"));

	// Xử lý khi nhấn nút đăng nhập
	const handleLogin = () => {
		navigate("/login");
	};

	// Xử lý đăng xuất
	const handleLogout = () => {
		localStorage.removeItem("user"); // Xóa user khỏi localStorage
		window.location.reload(); // Reload trang để cập nhật giao diện
	};

	return (
		<nav style={styles.navbar}>
			{/* Logo bên trái */}
			<div style={styles.logo}>
				<img src="/public/mind body green.png" className="imgLogo" alt="" />
				<p className="imgtext">EduMind</p>
			</div>

			{/* Hiển thị tên user nếu đã đăng nhập, nếu chưa thì hiển thị nút Đăng nhập */}
			<div
				style={styles.userContainer}
				onMouseEnter={() => setShowLogout(true)}
				onMouseLeave={() => setShowLogout(false)}
			>
				{user?.name ? (
					<div style={styles.userBox}>
						{user.name}
						{/* Nếu hover thì hiển thị nút Đăng xuất */}
						{showLogout && (
							<button onClick={handleLogout} style={styles.logoutButton}>
								Đăng xuất
							</button>
						)}
					</div>
				) : (
					<button onClick={handleLogin} style={styles.loginButton}>
						Đăng nhập
					</button>
				)}
			</div>
		</nav>
	);
}

// CSS inline styles
const styles = {
	navbar: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		color: "white",
		padding: "10px 170px",
		fontSize: "18px",
		fontWeight: "bold",
		background: "#add4fd",
		width: "1325px",
	},
	imgLogo: {
		width: "10px",
		height: "10px",
		padding: "0 10px 0 0px",
	},
	logo: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",

	},
	userContainer: {
		position: "relative",
	},
	userBox: {
		background: "#007bff",
		padding: "5px 10px",
		borderRadius: "5px",
		cursor: "pointer",
		color: "white",
		position: "relative",
	},
	loginButton: {
		backgroundColor: "#007bff",
		color: "white",
		border: "none",
		padding: "5px 10px",
		borderRadius: "5px",
		cursor: "pointer",
		fontSize: "16px",
	},
	logoutButton: {
		position: "absolute",
		top: "75%",
		left: "50%",
		transform: "translateX(-50%)",
		backgroundColor: "#dc3545",
		color: "white",
		border: "none",
		padding: "5px 10px",
		borderRadius: "5px",
		cursor: "pointer",
		marginTop: "5px",
		fontSize: "14px",
		whiteSpace: "nowrap",
	},
};
