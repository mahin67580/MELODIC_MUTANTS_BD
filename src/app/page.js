import Image from "next/image";
import Lessons from "./components/Lessons";
import Comment from "./components/Comment";
import Hero from "./components/Hero";
import Footer from "@/components/Footer";
import Cta from "@/components/Cta";
import InstrumentsCard from "./components/InstrumentsCard";
import SocialLoginHandler from "@/components/SocialLoginHandler";


export default function Home() {
  
  return (
    <main>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1> */}
       <SocialLoginHandler />
      <Hero></Hero>
      <Lessons></Lessons>
      <InstrumentsCard></InstrumentsCard>
      <Comment></Comment>
      <Cta></Cta>


    </main>
  );
}
