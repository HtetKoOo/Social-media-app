"use client";
import React, { useRef, useState, useEffect } from "react";
import StoryCard from "./StoryCard";
import CreateStoryCard from "./CreateStoryCard";
import { useGetUser } from "../../../custom-hooks/useUser";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DUMMY_STORIES = [
    {
        id: "1",
        user: {
            id: "u1",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u1",
        },
        image: "https://picsum.photos/id/1015/300/500",
    },
    {
        id: "2",
        user: {
            id: "u2",
            name: "Myint Myat Noe",
            image: "https://i.pravatar.cc/150?u=u2",
        },
        image: "https://picsum.photos/id/1016/300/500",
    },
    {
        id: "3",
        user: {
            id: "u3",
            name: "Thu Hnin Phyusin",
            image: "https://i.pravatar.cc/150?u=u3",
        },
        image: "https://picsum.photos/id/1018/300/500",
    },
    {
        id: "4",
        user: {
            id: "u4",
            name: "Hsu Myat",
            image: "https://i.pravatar.cc/150?u=u4",
        },
        image: "https://picsum.photos/id/1019/300/500",
    },
    {
        id: "5",
        user: {
            id: "u5",
            name: "Cynthia Tun",
            image: "https://i.pravatar.cc/150?u=u5",
        },
        image: "https://picsum.photos/id/1020/300/500",
    },
    {
        id: "6",
        user: {
            id: "u6",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u6",
        },
        image: "https://picsum.photos/id/1021/300/500",
    },
    {
        id: "7",
        user: {
            id: "u7",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u7",
        },
        image: "https://picsum.photos/id/1022/300/500",
    },
    {
        id: "8",
        user: {
            id: "u8",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u8",
        },
        image: "https://picsum.photos/id/1023/300/500",
    },
    {
        id: "9",
        user: {
            id: "u9",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u9",
        },
        image: "https://picsum.photos/id/1024/300/500",
    },
    {
        id: "10",
        user: {
            id: "u10",
            name: "Chananyar Ap",
            image: "https://i.pravatar.cc/150?u=u10",
        },
        image: "https://picsum.photos/id/1025/300/500",
    },
];

export default function Story() {
    const { data: user } = useGetUser();
    const userImage = user?.image || "/images/avatar.png";
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                scrollContainerRef.current;
            setShowLeft(scrollLeft > 0);
            setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener("resize", handleScroll);
        return () => window.removeEventListener("resize", handleScroll);
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -500,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 500,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative w-full max-w-full group/list">
            {/* Left Scroll Button */}
            {showLeft && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/list:opacity-100 transition-opacity duration-300"
                >
                    <FaChevronLeft />
                </button>
            )}

            {/* Right Scroll Button */}
            {showRight && (
                <button
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/list:opacity-100 transition-opacity duration-300"
                >
                    <FaChevronRight />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 w-full max-w-full scroll-smooth"
            >
                <CreateStoryCard userImage={userImage} />
                {DUMMY_STORIES.map((story) => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
}