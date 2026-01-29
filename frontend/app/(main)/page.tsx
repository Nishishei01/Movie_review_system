import Posts from "@/components/Posts/posts";
import PostCreateBar from "@/components/Posts/postCreateBar";

export default async function Home() {
  
  return (
    <>
      <PostCreateBar />
      <Posts />
    </>
  );
}
