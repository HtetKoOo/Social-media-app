"use client";
import React, { useRef, useState, useEffect } from "react";
import StoryCard from "./StoryCard";
import CreateStoryCard from "./CreateStoryCard";
import { useGetUser } from "../../../custom-hooks/useUser";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useInfiniteStories } from "../../../custom-hooks/useStory";
import CreateStoryDialog from "./CreateStoryDialog";
import StoryViewDialog from "./StoryViewDialog";
import { Story as StoryType } from "../../../types/story";

export default function Story() {
    const { data: user } = useGetUser();
    const userImage = user?.image || "/images/avatar.png";
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const {
        data: storiesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteStories();

    const stories = storiesData?.pages.flatMap((page) => page.stories) || [];

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                scrollContainerRef.current;
            setShowLeft(scrollLeft > 0);

            // Check if we are near the end (within 20px)
            const isNearEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 20;
            setShowRight(!isNearEnd);

            // Infinite scroll trigger
            if (isNearEnd && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener("resize", handleScroll);
        return () => window.removeEventListener("resize", handleScroll);
    }, [storiesData]); // Re-run when stories change

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

    const handleStoryClick = (story: StoryType) => {
        setSelectedStory(story);
        setIsViewDialogOpen(true);
    };

    return (
        <div className="relative w-full max-w-full group/list">
            <CreateStoryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            <StoryViewDialog
                isOpen={isViewDialogOpen}
                onClose={() => setIsViewDialogOpen(false)}
                story={selectedStory}
            />

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
                <CreateStoryCard
                    userImage={userImage}
                    onClick={() => setIsDialogOpen(true)}
                />

                {stories.map((story) => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        onClick={() => handleStoryClick(story)}
                    />
                ))}
            </div>
        </div>
    );
}