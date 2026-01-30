import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa";

type CreateStoryCardProps = {
    userImage: string;
};

export default function CreateStoryCard({ userImage }: CreateStoryCardProps) {
    return (
        <div className="relative w-24 h-44 sm:w-28 sm:h-52 rounded-xl overflow-hidden cursor-pointer group hover:bg-dark-3/80 transition-colors bg-dark-3 flex flex-col shrink-0">
            {/* Top Image Section */}
            <div className="relative h-[75%] w-full border-b border-dark-4">
                <Image
                    src={userImage}
                    alt="Create Story"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Bottom Section with Text */}
            <div className="relative h-[25%] bg-dark-2 flex items-end justify-center pb-2 sm:pb-3 w-full">
                <p className="text-white font-semibold text-xs sm:text-sm text-center px-1">
                    Create story
                </p>
            </div>

            {/* Floating Plus Button */}
            <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full border-4 border-dark-2 flex items-center justify-center z-10 group-hover:scale-110 transition-transform text-white">
                <FaPlus size={14} className="sm:text-lg" />
            </div>
        </div>
    );
}
