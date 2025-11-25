'use client'

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form"
import { AuthProps } from "@/types";
import { authApi } from "@/apis/auth";
import { useRouter } from 'next/navigation'

export function LoginLayout() {

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

  console.log(errors);

  async function onSubmit(data: AuthProps.LoginType) {
    try {
      const res = await authApi.login(data);
      localStorage.setItem("accessToken", JSON.stringify({ state: { accessToken: res.data.accessToken } }));
      router.push('/')
    } catch (error) {
      console.error("Login Failed: ", error)
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
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-3 text-base"
                  placeholder="Type your username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-700">Password</label>
                <input 
                  type="password"
                  {...register('password', { required: true })}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-3 text-base"
                  placeholder="Type your password"
                />
              </div>
              <div className="text-center mt-10">
                <button
                  type="submit"
                  className="bg-purple-700 rounded-xl text-white text-shadow-lg w-50 h-full p-3 hover:bg-purple-900 hover:shadow-lg hover:shadow-yellow-200/50 "
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
