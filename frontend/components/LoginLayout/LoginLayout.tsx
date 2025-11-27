'use client'

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form"
import { useState } from "react";
import { AuthProps } from "@/types";
import { authApi } from "@/apis/auth";
import { useRouter } from 'next/navigation'
import axios from "axios";

export function LoginLayout() {

  const [ apiResError, setApiResError ] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: {errors}
  } = useForm<AuthProps.LoginType>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const router = useRouter()

  async function onSubmit(data: AuthProps.LoginType) {
    try {
      const res = await authApi.login(data);
      localStorage.setItem("accessToken", JSON.stringify({ state: { accessToken: res.data.accessToken } }));
      router.push('/')
    } catch (error: unknown) {
      console.log('Login Failed: ', error);
      if (axios.isAxiosError(error)) {
        const msg = 
          error.response?.data.message ||
          error.response?.data.error ||
          'Username or Password incorrect'
          
          setApiResError(msg);
      }
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
        {/* Left-side */}
        <div className="relative h-full">
          <Image
            src="/images/felipe-bustillo-4VDRCoNuvE0-unsplash.jpg"
            alt="login-image"
            fill={true}
            className="object-cover"
          />
        </div>

        {/* Right-side */}
        <div className="flex items-center justify-center p-12">
          <div className="w-full">

            <div className="text-center font-bold text-4xl mb-10">
              <h1> <span className="text-purple-700">Sign in</span> to Account</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} name="login" className="flex flex-col gap-6">
              <div>
                <label htmlFor="uesrname" className="block mb-2 text-base font-medium text-gray-700">Username</label>
                <input 
                  type="text"
                  {...register('username', { required: 'This is required.', minLength: { value: 3, message: 'Min length is 3'} })}
                  className={`w-full shadow-xs 
                    ${errors.username ? 'shadow-red-500/50' : 'shadow-purple-500/50'}
                    focus:shadow-lg 
                    ${errors.username ? 'focus:red-purple-500/50 ' : 'focus:shadow-purple-500/50'}
                    focus:outline-none rounded-md p-3 text-base`}
                  placeholder="Type your username"
                />
                <div className="h-[20px] mt-1.5">
                {
                  errors.username && (
                    <p className="text-red-500 text-[13px] font-bold">{errors.username.message}</p>
                  )
                }
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-700">Password</label>
                <input 
                  type="password"
                  {...register('password', { required: 'This is required', minLength: { value: 3, message: 'Min length is 3'} })}
                  className={`w-full shadow-xs 
                    ${errors.password ? 'shadow-red-500/50': 'shadow-purple-500/50'}
                    focus:shadow-lg 
                    ${errors.password ? 'focus:shadow-red-500/50': 'focus:shadow-purple-500/50'}
                    focus:outline-none rounded-md p-3 text-base`}
                  placeholder="Type your password"
                />
                <div className="h-[20px] mt-1.5">
                  {
                    errors.password && (
                      <p className="text-red-500 text-[13px] font-bold">{errors.password.message}</p>
                    )
                 }
                </div>
              </div>
              <div className="text-center">
                <div className="h-[32px]">
                {
                  apiResError && (
                    <p className="text-red-500 text-center pb-2">{apiResError}</p>
                  )
                }
                </div>
                <button
                  type="submit"
                  className={`
                    ${errors.username || errors.password ? 
                      'bg-purple-700 hover:shadow-lg cursor-not-allowed opacity-50' : 
                      'bg-purple-700 hover:bg-purple-900 hover:shadow-lg hover:shadow-yellow-200/50 cursor-pointer'
                    }
                    rounded-xl text-white text-shadow-lg w-50 h-full p-3 
                    `}
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-5 text-center">
                <p>Don&apos;t have an account? <Link href="/register" className="text-purple-700">Sign Up</Link></p>
            </div>
       
          </div>
        </div>

      </div>
    </>
  );
}
