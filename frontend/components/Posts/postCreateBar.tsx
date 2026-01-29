"use client";

import { useEffect, useState } from "react";
import { 
  PencilSquareIcon, 
  XMarkIcon, 
  StarIcon, 
  // PhotoIcon 
} from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { SearchAutocomplete } from "../searchBar";
import { MovieProps } from "@/types/movie-type";
import { movieApi } from "@/apis/movie";
import Image from 'next/image'
import { postApi } from "@/apis/post";

interface FormDataState {
  content: string;
  rating: number;
  userID: string;
  movieName: string;
  movieImage: string;
  overview: string;
  genreIDs: number[];
  imdbID: string;
}

export default function PostCreateBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const [formData, setFormData] = useState<FormDataState>({
    content: "",
    rating: 0,
    userID: "",
    movieName: "",
    movieImage: "",
    overview: "",
    genreIDs: [], 
    imdbID: "", 
  });

  useEffect(() => {
    const currentUserString = localStorage.getItem('user-storage');
    if (!currentUserString) return;

    const currentUserObj = JSON.parse(currentUserString as string);
    
    const currentUserId = currentUserObj.state.userData.id

    if (currentUserId) {
      setCurrentUserId(currentUserId);
    }
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rate: number) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleSubmit = async () => {
    if (!formData.movieName || !formData.content || formData.rating === 0) {
      alert("กรุณากรอกข้อมูลให้ครบ (ชื่อหนัง, รีวิว, คะแนน)");
      return;
    }

    setLoading(true);
    try {

      const res = await postApi.create({
        ...formData
      })

      if (res.status === 201) {
        setIsOpen(false);
        setFormData({
          content: "",
          rating: 0,
          userID: "",
          movieName: "",
          movieImage: "",
          overview: "",
          genreIDs: [],
          imdbID: "",
        });
        alert("โพสต์รีวิวสำเร็จ!");
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- Trigger Bar --- */}
      <div className="flex justify-center items-center mt-3 px-4">
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full max-w-2xl p-3 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-[0_0_15px] hover:shadow-violet-700/25 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          
          <div className="flex-grow bg-gray-100 h-10 rounded-full flex items-center px-4 text-gray-500 group-hover:bg-gray-50 transition">
            รีวิวหนังที่คุณเพิ่งดูมา...
          </div>

          <PencilSquareIcon className="h-6 w-6 text-violet-500" />
        </div>
      </div>

      {/* --- Modal --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-gray-800">สร้างรีวิวใหม่</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 flex justify-between">
                    ข้อมูลภาพยนตร์ 
                    {formData.imdbID && <span className="text-xs font-normal text-violet-500">ID: {formData.imdbID}</span>}
                </h3>
                
                <div className="relative z-20"> 
                    <SearchAutocomplete<MovieProps.SearchMovieType>
                        placeholder="ค้นหาชื่อภาพยนตร์เพื่อ Auto-fill..."
                        fetcher={(q) =>
                        movieApi.searchMovie({ query: q }).then(r => r.data.results)
                        }
                        getOptionLabel={(item) =>
                        `${item.title} (${item.release_date ? item.release_date.substring(0, 4) : 'N/A'})`
                        }
                        getOptionValue={(item) => item.id.toString()}
                        onSelect={(item) => {
                            setFormData((prev) => ({
                                ...prev,
                                movieName: item.title,
                                movieImage: item.poster_path 
                                    ? `${item.poster_path}` 
                                    : "https://placehold.co/600x400?text=No+Image",
                                overview: item.overview || "",
                                imdbID: item.id.toString(),
                                genreIDs: item.genre_ids || [],
                                userID: currentUserId
                            }));
                        }}
                    />
                </div>

                {/* แสดง Preview รูปหนังถ้ามีข้อมูลแล้ว */}
                {formData.movieImage && (
                    <div className="flex gap-4 mt-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                        <Image 
                          src={`https://image.tmdb.org/t/p/original${formData.movieImage}`}
                          width={64}
                          height={96}
                          alt="Poster" 
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-800 truncate">{formData.movieName}</p>
                            <p className="text-xs text-gray-500 line-clamp-3 mt-1">{formData.overview || "ไม่มีเรื่องย่อ"}</p>
                        </div>
                    </div>
                )}

              
              </div>

              {/* ส่วนรีวิว */}
              <div className="space-y-2">
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="เขียนรีวิวของคุณที่นี่... หนังเรื่องนี้เป็นยังไงบ้าง?"
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                />
              </div>

              {/* ส่วนให้คะแนน */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">คะแนน:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleRating(star)} type="button">
                      {star <= formData.rating ? (
                        <StarIcon className="h-8 w-8 text-yellow-400 hover:scale-110 transition" />
                      ) : (
                        <StarOutline className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">({formData.rating}/5)</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition font-medium shadow-lg shadow-violet-200 disabled:opacity-50"
              >
                {loading ? "กำลังโพสต์..." : "โพสต์รีวิว"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}