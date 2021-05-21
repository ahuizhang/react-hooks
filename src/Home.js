import { useState } from 'react';
import { Form, Input, Button, Tabs, message } from 'antd';
import { useHistory } from "react-router-dom";
import axios from 'axios'
axios.defaults.baseURL = "http://bb.lyyx16.com"
export default function Home() {
    const { TabPane } = Tabs;
    const [isLogin, setIsLogin] = useState(true)
    const callback = (key) => {
        switch (key) {
            case "1":
                setIsLogin(true)
                break;
            case "2":
                setIsLogin(false)
                break;
            default:
                break;
        }
    }
    return (
        <div className="badyHome">
            <div className="login_container">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="登入" key="1">
                        <From isLogin={isLogin} />
                    </TabPane>
                    <TabPane tab="注册" key="2">
                        <From isLogin={isLogin} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

function From(props) {
    const history = useHistory();
    const layout = {
        labelCol: { span: 6 },
    };
    const onFinish = (values) => {
        if (props.isLogin) {
            axios.post('/user/login', values)
                .then(res => {
                    if (res.data && res.data.code === 0) {
                        message.success(res.data.msg);
                        localStorage.setItem('id', res.data.uid)
                        history.push('/chatroom')
                    } else {
                        message.success(res.data.msg);
                    }
                })
                .catch(err => {
                    message.error(err);
                })
        } else {
            if (values.password !== values.confirmPassword) return
            axios.post('/user/register', { username: values.username, password: values.password })
                .then(res => {
                    if (res.data && res.data.code === 0) {
                        message.success(res.data.msg);
                        localStorage.setItem('id', res.data.uid)
                        history.push('/chatroom')
                    } else {
                        message.success(res.data.msg);
                    }
                })
                .catch(err => {
                    message.error(err);
                })
        }
    };
    return (
        <Form
            {...layout}
            name="login"
            onFinish={onFinish}
        >
            <Form.Item
                label="账号"
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入账号!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            {
                !props.isLogin ?
                    <Form.Item
                        label="确认密码"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: '请输入确认密码!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    : null
            }
            <Form.Item >
                <Button type="primary" htmlType="submit" block>{props.isLogin ? "登入" : "注册"}</Button>
            </Form.Item>
        </Form>
    )
}