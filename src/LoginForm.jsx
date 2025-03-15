import React from "react";
import { Form, Input, Button, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
	const navigate = useNavigate(); // Hook điều hướng

	const onFinish = (values) => {
		console.log("Đăng nhập thành công:", values);
		// Giả lập đăng nhập thành công -> Chuyển hướng
		setTimeout(() => {
			navigate("/"); // Chuyển về trang mindmap
		}, 1000);
	};

	return (
		<div style={styles.container}>
			<Card style={styles.card}>
				<h2 style={styles.title}>🧠 MindMap Login</h2>
				<Form name="login" onFinish={onFinish} layout="vertical">
					<Form.Item
						name="username"
						rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="Tên đăng nhập"
							style={styles.input}
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Mật khẩu"
							style={styles.input}
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" style={styles.button}>
							Đăng nhập
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

// Style cho form login
const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		width: "100vw",
		background: "linear-gradient(to right, #FFDDC1, #85E3FF)",
	},
	card: {
		width: 350,
		textAlign: "center",
		borderRadius: 10,
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
	},
	title: {
		fontSize: "24px",
		fontWeight: "bold",
		marginBottom: "20px",
	},
	input: {
		height: "40px",
		fontSize: "16px",
	},
	button: {
		width: "100%",
		height: "40px",
		fontSize: "16px",
		backgroundColor: "#007BFF",
		borderColor: "#007BFF",
	},
};

export default LoginForm;
