import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
	const navigate = useNavigate(); // Hook điều hướng

	const onFinish = async (values) => {
		console.log("values", values);
		try {
			const response = await axios.post("http://127.0.0.1:8000/register/", {
				username: values.username,
				email: values.email,
				password: values.password,
			});

			if (response.status === 201) {
				message.success("Đăng ký thành công! Hãy đăng nhập.");
				navigate("/login"); // Chuyển hướng về trang đăng nhập
			} else {
				message.error("Đăng ký thất bại!");
			}
		} catch (error) {
			console.error("Lỗi khi đăng ký:", error);
			message.error("Có lỗi xảy ra khi đăng ký!");
		}
	};

	return (
		<div style={styles.container}>
			<Card style={styles.card}>
				<h2 style={styles.title}>📝 Đăng ký tài khoản</h2>
				<Form name="register" onFinish={onFinish} layout="vertical">
					<Form.Item
						name="username"
						rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" style={styles.input} />
					</Form.Item>

					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Vui lòng nhập email!" },
							{ type: "email", message: "Email không hợp lệ!" },
						]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" style={styles.input} />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" style={styles.input} />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" style={styles.button}>
							Đăng ký
						</Button>
					</Form.Item>
					<div onClick={() => navigate("/login")}>Đăng nhập</div>
				</Form>
			</Card>
		</div>
	);
};

// Style cho form đăng ký
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

export default RegisterForm;
