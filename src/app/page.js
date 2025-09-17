import Image from "next/image";
import Lessons from "./components/Lessons";
import Comment from "./components/Comment";


export default function Home() {
  return (
    <main>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1> */}
      <Lessons></Lessons>
      <Comment></Comment>

    </main>
  );
}
