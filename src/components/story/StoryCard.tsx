import Image from "next/image";
import React from "react";

type Story = {
    id: string;
    user: {
        id: string;
        name: string;
        image: string;
    };
    image: string;
};

type StoryCardProps = {
    story: Story;
};

export default function StoryCard({ story }: StoryCardProps) {
    return (
        <div className="relative w-24 h-44 sm:w-28 sm:h-52 rounded-xl overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity shrink-0">
            {/* Background Image */}
            <Image
                src={story.image}
                alt="story"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

            {/* Avatar */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-blue-500 overflow-hidden z-10">
                <Image
                    src={story.user.image}
                    alt={story.user.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* User Name */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 right-2 text-white font-semibold text-sm sm:text-base truncate z-10 drop-shadow-md">
                {story.user.name}
            </div>
        </div>
    );
}
