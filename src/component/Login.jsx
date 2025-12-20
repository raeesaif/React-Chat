import { LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '../schema/authschema'
import { useLogin } from '../hook/useAuth'
import CircularProgress from '@mui/material/CircularProgress'
const INITIAL_VALUE = {
    email: "",
    password: "",
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { mutate: login, isLoading, isPending } = useLogin()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: INITIAL_VALUE
    })

    const onSubmit = (data) => {
        login(data)
        reset()
    }

    return (
        <>
            <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center min-h-screen  md:px-5 px-5 ' >
                <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  text-white w-full lg:w-[500px] xl:w-[550px] 
                rounded-4xl  shadow-2xlrounded-4xl p-8' >
                    <h1 className='text-2xl text-center mb-2 font-bold ' >Login </h1>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className='space-y-5' >
                            <div>
                                <input type="text" placeholder='Enter your email' className='rounded-lg px-2 py-1 border border-gray-300 outline-none w-full' {...register("email")} />
                                {errors.email && <p className='text-red-500' >{errors?.email?.message}</p>}
                            </div>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter your password'
                                    className='rounded-lg px-2 py-1 border border-gray-300 outline-none w-full'
                                    {...register("password")}
                                />

                                <span
                                    className='text-gray-300 absolute top-1/3 right-3 -translate-y-1/2 cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <LockKeyholeOpen /> : <LockKeyhole />}
                                </span>

                                {/* Reserve space for error */}
                                <div className="h-5 mt-1">
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>
                            <button disabled={isPending || isLoading} type='submit' className="!w-full !bg-purple-500  hover:!bg-purple-500/90 !text-primary-foreground group !rounded-xl px-3 py-2 cursor-pointer  ">
                                {(isPending || isLoading) ? (
                                    <>
                                        <CircularProgress size={18} color="inherit" />
                                        <span> Login </span>
                                    </>
                                ) : (
                                    " Login "
                                )}
                            </button>
                            <Link to={"/signup"} className='text-center text-sm text-gray-400' >Don’t have an account? <span className='text-purple-500 cursor-pointer' >Sign Up</span></Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login 