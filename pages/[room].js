import { useEffect, useState, createElement } from 'react'
import { useRouter } from 'next/router'
import * as ReactDOMClient from 'react-dom/client';
import { AiOutlineUser, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'
import Navbar from '../components/navbar'
import { getRoomDetail, getVoteOptions, vote, endVote} from '@/helpers';
import { getUser } from '@/helpers/auth';
import { v4 } from 'uuid';

export default function Room() {
    const [roomId, setRoomId] = useState("0")
    const [username, setUsername] = useState("")
    const [roomDetails, setRoomDetails] = useState({})
    const [voteOptions, setVoteOptions] = useState([])

    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) return;
        setRoomId(router.query.room)
    }, [router.isReady]);

    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', "light");
        if (localStorage.getItem("token") == null) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        if (!router.isReady) return;
        const fetchGroupInfo = async () => {
            if (roomId != "0" && roomId != undefined) {
                getRoomDetail(roomId).then((res) => {
                    setRoomDetails(res.rooms)
                })
                getVoteOptions(roomId).then((res) => {
                    setVoteOptions(res.votes)
                })
                getUser().then((res) => {
                    setUsername(res.username)
                })
            }
        }
        fetchGroupInfo()
    }, [roomId])

    const handleVote = (e) => {
        console.log(roomDetails.is_finished)
        if (roomDetails.is_finished == false) {
            const id = e;
            var previous_id = 0;
            if (document.getElementById("prev")) {
                previous_id = document.getElementById("prev").value;
            }
            const body = { id, previous_id }
            vote(body)
        }
    }

    const handleEndVote = () => {
        const room_id = roomId;
        const body = { room_id }
        endVote(body)
    }

    const [socket, setSocket] = useState(null);

    const baseUrl = "35.223.128.34:8000"
    useEffect(() => {
        if (roomId != "0" && roomId != undefined) {
            const newSocket = new WebSocket(`ws://${baseUrl}/ws/vote/${roomId}/`);
            setSocket(newSocket);
            return () => newSocket.close();
        }
    }, [roomId]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = event => {
            console.log(event)
            const data = JSON.parse(event.data);
            if (data.type === 'send_vote_count') {
                setVoteOptions(data.vote_list);
            } else if (data.type === 'send_room_ended') {
                setRoomDetails(data.room_details);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => socket.removeEventListener('message', handleMessage);
    }, [socket]);

    return (
        <div>
            <div className="fixed top-0 w-full z-10">
                <Navbar />
            </div>
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-center">Room Code:</h1>
                    <h1 className="text-center mb-10">{roomDetails.room_id}</h1>
                    <div className="card w-96 bg-base-200 shadow-xl">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title mb-4">{roomDetails.name}</h2>

                            {voteOptions.map((voteOption, index) => (
                                <div key={index} className="grid grid-cols-6 min-w-full">
                                    <div className="col-span-5">
                                        {voteOption.voter.includes(username) ?
                                            (
                                                <div>
                                                    <button key={index} onLoad={(e) => setPreviousId(voteOption.id)} onClick={(e) => handleVote(e)} value={voteOption.id} className="btn min-w-full" disabled>
                                                        {voteOption.vote_option}
                                                    </button>
                                                    <input type="hidden" id="prev" value={voteOption.id} />
                                                </div>
                                            )
                                            : <button key={index} onClick={(e) => handleVote(e.target.value)} value={voteOption.id} className="btn min-w-full">
                                                {voteOption.vote_option}
                                            </button>
                                        }
                                    </div>
                                    <div className="flex items-center">
                                        <p>{voteOption.vote_amount}</p>
                                        <AiOutlineUser />
                                    </div>
                                </div>
                            ))}
                        
                        </div>
                    </div>
                    { (roomDetails.creator_id == username && roomDetails.is_finished == false) && (
                        <button onClick={handleEndVote} className="btn mt-10">End Vote</button>
                    )}
                    { (roomDetails.is_finished == true) && (
                        <h1 className='mt-10'>The Vote Has Ended!</h1>
                    )}
                </div>
            </div>
        </div>
    )
}