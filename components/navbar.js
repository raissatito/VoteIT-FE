import { AiOutlineUser } from 'react-icons/ai'
import { logout, getUser } from '@/helpers/auth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { VscBell, VscBellDot } from 'react-icons/vsc'

export default function Navbar() {
  const baseUrl = "35.223.128.34:8000"
  const router = useRouter()

  const [username, setUsername] = useState(null)
  const [token, setToken] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      setToken(localStorage.getItem("token"))
      getUser().then((res) => {
        setUsername(res.username)
      })
      console.log(router.pathname)
    }
  }, [])

  const callLogout = () => {
    logout().then((res) => {
      if (res) {
        if (router.pathname != "/") {
        router.push('/')
        } else {
          router.reload()
        }
      }
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      router.push("/" + event.target.value)
    }
  };

  useEffect(() => {
    if (username != null) {
      const newSocket = new WebSocket(`ws://${baseUrl}/ws/user/${username}/`);
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [username]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = event => {
      const data = JSON.parse(event.data);
      console.log(data)
      setNotifications(notifications => [...notifications, data])
    };

    socket.addEventListener('message', handleMessage);

    return () => socket.removeEventListener('message', handleMessage);
  }, [socket]);

  return (
    <div className="flex m-5">
      <div className="navbar bg-base-200 rounded-box">
        <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          VoteIT
        </Link>
          {token != null && (
            <div className="dropdown dropdown-right">
              <button tabIndex={1} className="btn btn-ghost btn-circle">
                { notifications.length > 0 ? <VscBellDot /> : <VscBell />}
              </button>
              <ul tabIndex={1} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-96">
                {notifications.map((notification, index) => (
                  <li key={index}>
                    <Link href={`/${notification.room_id}`}>
                      "{notification.name}" Voting has ended, check the result!
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input type="text" placeholder="Enter Room Code" className="input input-bordered" onKeyDown={(e) => handleKeyDown(e)} />
          </div>
          <div className="dropdown dropdown-end">
            <a tabIndex={0} className="btn btn-ghost">
              <AiOutlineUser />
            </a>
            {token == null ? (
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link href="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register">
                    Register
                  </Link>
                </li>
              </ul>
            )
              : <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li><a onClick={callLogout}>Logout</a></li>
              </ul>
            }
          </div>
        </div>
      </div>
    </div>

  )
}