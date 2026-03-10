export function Footer() {
  return (
    <footer className="mt-7 border-t border-gray-200 px-4 md:px-0">
      <div className="max-w-[1400px] mx-auto py-6 flex flex-col md:flex-row items-center text-xs md:text-sm text-gray-600 justify-center">
        
        <p className="text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-purple-700">Movie Review</span>. 
          All rights reserved.
        </p>

      </div>
    </footer>
  )
}
