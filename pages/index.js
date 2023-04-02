import { useEffect, useState, createElement } from 'react'
import { useRouter } from 'next/router'
import * as ReactDOMClient from 'react-dom/client';
import { AiOutlineUser, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'
import Navbar from '../components/navbar'
import { getAllRooms, createRoom, createVoteOptions } from '@/helpers';
import { v4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', "light");
    const fetchRoomlist = async () => {
      getAllRooms().then((res) => {setRooms(res.rooms)})
    }
    fetchRoomlist();
  }, []);

  const [voteid, setVoteid] = useState(1)
  // const [vote_option, setVoteOptions] = useState([])

  const addVoteInput = () => {
    setVoteid(voteid + 1)
    const votelist = document.getElementById("voteList")
    const div = document.createElement("div")
    div.id = `vote${voteid + 1}`
    div.className = "mb-3"

    const input = document.createElement("input")
    input.type = "text"
    input.name = "vote[]"
    input.className = "input input-bordered w-full max-w-xs"

    const button = document.createElement("button")
    button.className = "btn btn-square ml-3"
    button.onclick = function () {
      removeVoteInput(div.id);
    };

    const root = ReactDOMClient.createRoot(button)
    const minusIcon = createElement(AiOutlineMinus);
    root.render(minusIcon);

    div.appendChild(input);
    div.appendChild(button);

    votelist.appendChild(div);
  }

  const removeVoteInput = (e) => {
    document.getElementById(e).remove();
  }

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8000/ws/rooms/');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = event => {
      const data = JSON.parse(event.data);
      setRooms(data);
    };

    socket.addEventListener('message', handleMessage);

    return () => socket.removeEventListener('message', handleMessage);
  }, [socket]);

  // const [room_id, setRoomId] = useState("")
  // const [name, setName] = useState("")
  const postCreateRoom = () => {
    if (localStorage.getItem("token") == null) {
      router.push("/login")
    } else {
      const name = document.getElementById("roomName").value;
      // setName(roomName);

      const voteInputs = document.getElementsByName("vote[]");
      const vote_option = [];
      for (let i = 0; i < voteInputs.length; i++) {
        vote_option.push(voteInputs[i].value);
      }

      const isPrivateElement = document.getElementById("isPrivate");
      const is_private = isPrivateElement.checked;
      // setRoomId(v4())
      const room_id = v4()
      const body = { room_id, name, is_private }
      const voteBody = { room_id, vote_option }
      createRoom(body).then(() => {
        createVoteOptions(voteBody).then(() => {
          router.push(`/${room_id}`)
        })
      })
    }
  }

  const openRoom = (room_id) => {
    router.push(`/${room_id}`)
  }

  return (
    <div>
      <Navbar className="fixed"/>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 mt-20">
        {rooms.map((room, index) => (
        <div onClick={() => openRoom(room.room_id)} key={index} className="card w-96 bg-primary text-primary-content justify-self-center">
          <div className="card-body">
            <h2 className="card-title">{room.name}</h2>
            <div className="flex items-center">
              <BsPersonFill className='mr-3' />
              <p>{room.creator_id}</p>
            </div>
            <div className="card-actions justify-end">
              <span>20 Participants</span>
            </div>
          </div>
        </div>
        ))}
      </div>
      <a href="#create-room" className="btn btn-circle btn-success fixed bottom-14 right-14 ">
        <AiOutlinePlus size={41} className="text-base-100 " />
      </a>
      <div className="modal" id="create-room">
        <div className="modal-box relative">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">Create New Room</h3>
            <a href="#" className="btn btn-sm btn-circle">✕</a>
          </div>
          <label className="label">
            <span className="label-text">Vote Title</span>
          </label>
          <input type="text" id="roomName" className="input input-bordered w-full max-w-xs" />
          <label className="label">
            <span className="label-text">Vote Option</span>
          </label>
          <div id="voteList">
            <div id="vote1" className="mb-3">
              <input type="text" name="vote[]" className="input input-bordered w-full max-w-xs" />
              <button onClick={addVoteInput} className="btn btn-square ml-3">
                <AiOutlinePlus />
              </button>
            </div>
          </div>
          <div>
          <input id="isPrivate" type="checkbox" className="checkbox" />
          <span className="ml-3">Private? (It will not be shown in main page)</span>
          </div>
          <div className="modal-action justify-center">
            <button onClick={postCreateRoom} className="btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
