import Image from "next/image";
import Lessons from "./components/Lessons";
import Comment from "./components/Comment";
import Hero from "./components/Hero";
import Footer from "@/components/Footer";
import Cta from "@/components/Cta";


export default function Home() {
  return (
    <main>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1> */}
      <Hero></Hero>
      <Lessons></Lessons>
      <Cta></Cta>
      <Comment></Comment>


    </main>
  );
}
