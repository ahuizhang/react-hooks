import { useState, useEffect, useRef } from 'react';
import './ChatRoom.css'
import io from "socket.io-client";
import { List, Avatar, Button, Input, message } from 'antd';
import axios from 'axios'
import leftAvatar from './static/image/leftAvatar.jfif';
import rightAvatar from './static/image/rightAvatar.jpg';
axios.defaults.baseURL = "http://bb.lyyx16.com"
const socket = io()
export default function ChatRoom() {
    return (
        <div className="chatRoomContailter">
            <UserList />
            <Chat />
        </div>
    )
}

function UserList() {
    const [userList, setUserList] = useState([])
    const id = localStorage.getItem('id')
    const [otherID, setOtherID] = useState(localStorage.getItem('otherID'))
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('/user/list')
            setUserList(response.data.userList)
        }
        fetchData()
    }, [])
    const handleUserClick = (_id) => {
        localStorage.setItem("otherID", _id)
        setOtherID(_id)
        window.location.reload()
    }
    return (
        <div className="userList">
            {userList.length > 0 && <List
                itemLayout="horizontal"
                dataSource={userList}
                renderItem={item => {
                    if (id !== item._id) {
                        return (
                            <List.Item onClick={() => handleUserClick(item._id)} style={{ background: otherID === item._id ? "aqua" : "#fff" }}>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={item.username}
                                    description="个性签名"
                                />
                            </List.Item>
                        )
                    }
                }}
            />
            }
        </div>
    )
}
function Chat() {
    const chatContentEl = useRef(null);
    const [chatList, setChatList] = useState([])
    const [text, setText] = useState("")
    const otherID = localStorage.getItem('otherID')
    const id = localStorage.getItem('id')
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('/user/getMagsList')
            let filterArr = response.data.magsList.filter(item => ((item.chatID === otherID + "_" + id || item.chatID === id + "_" + otherID)))
            setChatList(filterArr)
        }
        fetchData()
    }, [id, otherID])
    useEffect(() => {
        socket.on('globalMsg', (data) => {
            setChatList([...chatList, data])
        })
    })
    const sendMsg = () => {
        if (text.trim() === "") return message.info("内容空")
        socket.emit('sendMsg', {
            msg: text,
            to: otherID,
            from: id
        })
        setText('')
        if (chatContentEl.current.scrollHeight > chatContentEl.current.clientHeight) {
            setTimeout(() => {
                chatContentEl.current.scrollTop = chatContentEl.current.scrollHeight
            }, 800)
        }
    }
    const handleMsg = (e) => {
        if (!e.target.value) return
        setText(e.target.value)
    }
    return (
        otherID && <div className="chatRightList">
            <div className="chatContent" ref={chatContentEl}>
                {chatList.length > 0 && chatList.map((item => {
                    if (item.from !== id) {
                        return (
                            <div className="chatLeft" key={item._id}>
                                <img src={leftAvatar} alt="" />
                                <div className="leftText">
                                    <span className="leftTitle">Tom</span>
                                    <span className="leftTx">{item.content}</span>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="chatRight" key={item._id}>
                                <img src={rightAvatar} alt="" />
                                <div className="rightText">
                                    <span className="rightTitle">Jack</span>
                                    <span className="RightText">{item.content}</span>
                                </div>
                            </div>
                        )
                    }
                }
                ))
                }
            </div>
            <div className="chatRoomFooter">
                <Button type="primary" className="chatSendButton" onClick={sendMsg}>发送</Button>
                <Input className="chatSendContent" placeholder="请输入内容......" value={text} onChange={handleMsg} />
            </div>
        </div>
    )
}