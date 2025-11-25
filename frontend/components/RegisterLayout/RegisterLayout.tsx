'use client'
import { authApi } from "@/apis/auth";
import { AuthProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function RegisterLayout() {

  const { 
    register,
    handleSubmit,
    formState: {errors},
    watch
  } = useForm<AuthProps.RegisterType>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: ''
    }
  });
  
  const router = useRouter();
  console.log(errors);
  const password = watch('password')

  async function onSubmit(data: AuthProps.RegisterType) {
    try {
      await authApi.register(data);
      router.push('/login')
    } catch (error) {
      console.error("Logout Failed", error);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto ">
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

            <div className="text-center font-bold text-3xl mb-10">
              <h1> <span className="text-purple-700">Sign up</span> to create Account</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} name="register" className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block mb-1.5 text-base font-medium text-gray-700">Email</label>
                <input 
                  type="text"
                  {...register('email', {required: 'This is required', minLength: { value: 3, message: 'Min length is 3'}})}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type your email"
                />
              </div>
              <div>
                <label htmlFor="username" className="block mb-1.5 text-base font-medium text-gray-700">Username</label>
                <input 
                  type="text"
                  {...register('username', { required: 'This is required', minLength: { value: 3, message: 'Min length is 3'}})}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type your username"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                <label htmlFor="firstName" className="block mb-1.5 text-base font-medium text-gray-700">First Name</label>
                <input 
                  type="text"
                  {...register('firstName', {required: 'This is required', minLength: { value: 3, message: 'Min length is 3'}})}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type your FirstName"
                />
                </div>
                <div>
                <label htmlFor="lastName" className="block mb-1.5 text-base font-medium text-gray-700">Last Name</label>
                <input 
                  type="text"
                  {...register('lastName', {required: 'This is required', minLength: {value: 3, message: 'Min length is 3'}})}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type your LastName"
                />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-1.5 text-base font-medium text-gray-700">Password</label>
                <input 
                  type="password"
                  {...register('password', {required: 'This is required', minLength: {value: 3, message: 'Min length is 3'}})}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type your password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1.5 text-base font-medium text-gray-700">Confirm Password</label>
                <input 
                  type="password"
                  {...register('confirmPassword', {
                    required: 'This is required',
                    validate: (value) => value === password || 'The password do not match'
                  })}
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-md p-2.5 text-base"
                  placeholder="Type confirm password"
                />
              </div>
              <div className="text-center mt-10">
                <button
                  type="submit"
                  className="bg-purple-700 rounded-xl text-white text-shadow-lg w-50 h-full p-3 hover:bg-purple-900 hover:shadow-lg hover:shadow-yellow-200/50 "
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-5 text-center">
                <p>Already have an account? <Link href="/login" className="text-purple-700">Sign In</Link></p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
