"use client";

// import Link from "next/link";
import FeaturesSection from "@/components/page-auction/FeaturesSection";
import Footer from "@/components/page-auction/Footer";
import HeroSection from "@/components/page-auction/HeroSection";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
// import Navbar from "@/components/page-auction/Navbar";
import ProcessSection from "@/components/page-auction/ProcessSection";
import type { NextPage } from "next";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <div className="bg-cosmic min-h-screen">
      {/* <Navbar /> */}
      <HeroSection />
      <ProcessSection />
      <FeaturesSection />
      <Footer />
    </div>
  );

  // return (
  //   <>
  //     <div className="flex items-center flex-col grow pt-10">
  //       <div className="px-5">
  //         <h1 className="text-center">
  //           <span className="block text-2xl mb-2">欢迎来到</span>
  //           <span className="block text-4xl font-bold">Web3平台</span>
  //         </h1>
  //         <div className="flex justify-center items-center space-x-2 flex-col">
  //           <p className="my-2 font-medium">Connected Address:</p>
  //           <Address address={connectedAddress} />
  //         </div>

  //         <p className="text-center text-lg">Get started by editing </p>
  //         <p className="text-center text-lg">Edit your smart contract </p>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default Home;
