import FullBoard from "@/components/board/FullBoard";
import Navbar from "@/components/nav/Navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="main-content p-2">
        <FullBoard />
      </div>
    </div>
  );
}
