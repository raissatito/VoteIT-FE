import { AiOutlineUser } from 'react-icons/ai'

export default function Navbar() {
  return (

    <div className="flex m-5">
      <div className="navbar bg-base-200 rounded-box">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost normal-case text-xl">VoteIT</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input type="text" placeholder="Enter Room Code" className="input input-bordered" />
          </div>
          <a href="/" className="btn btn-ghost">
            <AiOutlineUser />
          </a>
        </div>
      </div>
    </div>

  )
}