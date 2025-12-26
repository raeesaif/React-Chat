import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { SignUpSchema } from '../schema/authschema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignup } from '../hook/useAuth'
import CircularProgress from '@mui/material/CircularProgress'
const INITIAL_VALUE = {
    first_name: "",
    email: "",
    password: "",
    confirmPassword: ""
}
const Signup = () => {
    const [show, setShow] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const { mutate: signup, isLoading, isPending } = useSignup()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: INITIAL_VALUE
    })

    const onSubmit = (data) => {
        signup(data)
        reset()
    }


    return (
        <>
            <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center min-h-screen  md:px-0 px-5' >
                <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  text-white w-full md:w-[450px] lg:w-[500px] xl:w-[550px] 
                 shadow-2xl rounded-4xl p-8' >
                    <h1 className='text-2xl text-center mb-2 font-bold ' >Sign Up </h1>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className='space-y-5' >
                            <div>
                                <input type="text" placeholder='Enter your name' className='rounded-lg border border-gray-300 px-2 py-1 outline-none w-full ' {...register("first_name")} />
                                {errors.first_name && <p className='text-red-500 text-sm '>{errors?.first_name?.message}</p>}
                            </div>
                            <div>
                                <input type="text" placeholder='Enter your email' className='rounded-lg px-2 py-1 border border-gray-300 outline-none w-full' {...register("email")} />
                                {errors.email && <p className='text-red-500 text-sm ' >{errors?.email?.message}</p>}
                            </div>
                            <div className='relative'>
                                <input type={show ? "text" : "password"} placeholder='Enter your password' className='rounded-lg px-2 py-1 border border-gray-300 outline-none w-full' {...register("password")} />
                                <span className='text-gray-300 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer ' onClick={() => setShow(!show)} >

                                    {show ? <LockKeyholeOpen className='mb-1.5' /> : <LockKeyhole className='mb-1.5' />}
                                </span>
                                <div className="h-1 mt-1">
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className='relative'>
                                <input type={showCPassword ? "text" : "password"} placeholder='Enter your confirm password' className='rounded-lg px-2 py-1 border border-gray-300 outline-none w-full' {...register("confirmPassword")} />
                                <span className='text-gray-300 absolute top-1/3 right-3 -translate-y-1/2 cursor-pointer ' onClick={() => setShowCPassword(!showCPassword)}  >

                                    {showCPassword ? <LockKeyholeOpen className='mb-1.5' /> : <LockKeyhole className='mb-1.5' />}
                                </span>
                                <div className="h-5 mt-1">
                                    {errors.confirmPassword && <p className='text-red-500 text-sm ' >{errors?.confirmPassword?.message}</p>}
                                </div>

                            </div>
                            <button
                                disabled={isPending || isLoading}
                                type="submit"
                                className="!w-full !bg-purple-500 hover:!bg-purple-500/90 !text-primary-foreground group !rounded-xl px-3 py-2 cursor-pointer flex justify-center items-center gap-2"
                            >
                                {(isPending || isLoading) ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" />
                                        <span>Signing Up...</span>
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                            <Link to={"/login"} className='text-center text-sm text-gray-400' >Already have an account? <span className='text-purple-500 cursor-pointer' >Login</span></Link>
                        </div>
                    </form>
                </div>
            </div>


        </>
    )
}

export default Signup