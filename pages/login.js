import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/helpers/auth';
import Link from 'next/link';
import Navbar from '@/components/navbar';


export default function Login() {
    const router = useRouter();
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', "light");
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function postLogin() {
        const body = {
            username, password
        }
        login(body)
            .then((res) => {
                console.log(res)
                localStorage.setItem("token", res.accessToken);
                router.push("/");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div>
            <div className="fixed top-0 w-full z-10">
                <Navbar />
            </div>
            <div className="flex h-screen items-center justify-center">
                <div className="card w-96 bg-base-200 shadow-xl">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">Login</h2>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="" className="input input-bordered w-full max-w-xs" />
                            <Link className="link mt-5" href="/register">
                                Don't Have Account? Register Here!
                            </Link>
                        </div>
                        <div className="card-actions mt-5 justify-end">
                            <button onClick={postLogin} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}