export function Footer() {
  return (
    <footer className="mt-7 border-t border-gray-200">
      <div className="mx-45 py-6 flex items-center text-sm text-gray-600 justify-center">
        
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-purple-700">Movie Review</span>. 
          All rights reserved.
        </p>

      </div>
    </footer>
  )
}
