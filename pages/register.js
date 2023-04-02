import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/helpers/auth';

export default function Login() {
    const router = useRouter();
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', "light");
      }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function postRegister () {
        const body = {
            username, password
        }
        register(body).then((res) => {
            router.push("/login");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="card w-96 bg-base-200 shadow-xl">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Register</h2>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="" className="input input-bordered w-full max-w-xs" />
                        <a href="/login" className="link mt-5">Already Have An Account? Login Here!</a>
                    </div>  
                    <div className="card-actions mt-5 justify-end">
                        <button onClick={postRegister} className="btn btn-primary">Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}