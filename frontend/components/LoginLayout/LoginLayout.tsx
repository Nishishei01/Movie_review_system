import Image from "next/image";

export function LoginLayout() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left-side */}
        <div className="bg-green-50 relative h-full">
          <Image
            src="/images/felipe-bustillo-4VDRCoNuvE0-unsplash.jpg"
            alt="login-image"
            fill={true}
            className="object-cover"
          />
        </div>

        {/* Right-side */}
        <div className="flex items-center justify-center">
          <div className="w-full m-20">

            <div className="text-center font-bold text-5xl mb-15">
              <h1>Sign in to Account</h1>
            </div>

            <form name="login" className="flex flex-col gap-10 text-3xl">
              <div>
                <label htmlFor="email" className="block mb-5">Email</label>
                <input 
                  type="text"
                  name="email"
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-[5px] p-[15px] text-lg"
                  placeholder="Type your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-5">Password</label>
                <input 
                  type="password"
                  name="password"
                  className="w-full shadow-xs shadow-purple-500/50 focus:shadow-lg focus:shadow-purple-500/50 focus:outline-none rounded-[5px] p-[15px] text-lg"
                  placeholder="Type your password"
                />
              </div>
              <div className="text-center mt-10">
                <button
                  type="button"
                  className="bg-purple-700 rounded-xl text-white text-shadow-lg w-50 h-full p-3 hover:bg-purple-900 hover:shadow-lg hover:shadow-yellow-200/50 "
                >
                  Sign In
                </button>
              </div>
            </form>
            {/* <form name="register">
         <div>
           Email  <input type="text" name="email" />
         </div>
         <div>
           Username  <input type="text" name="username" />
         </div>
         <div>
           FirstName  <input type="text" name="firstName" />
         </div>
         <div>
           LastName  <input type="text" name="lastName" />
         </div>
         <div>
           Confirm Password  <input type="text" name="password" />
         </div>
         <div>
           Password  <input type="password" name="password" />
         </div>
         <button>Register!</button>
       </form>   */}
          </div>
        </div>
      </div>
    </>
  );
}
