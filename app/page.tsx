import FullBoard from "@/components/board/FullBoard";
import Navbar from "@/components/nav/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col w-[calc(100vw-16rem)]">
      <Navbar />
      <div className="main-content p-8">
        <FullBoard />
      </div>
    </div>
  );
}
