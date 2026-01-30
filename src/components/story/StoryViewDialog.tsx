import React, { useEffect, useState } from "react";
import { Story } from "../../../types/story";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

type StoryViewDialogProps = {
    story: Story | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function StoryViewDialog({
    story,
    isOpen,
    onClose,
}: StoryViewDialogProps) {
    const [progress, setProgress] = useState(0);

    // Reset progress when story changes or dialog opens
    useEffect(() => {
        if (isOpen && story) {
            setProgress(0);
        }
    }, [isOpen, story]);

    // Auto-close logic (simulating story time) - optional, for now just static view
    // You can implement auto-advancing logic here if needed later

    if (!isOpen || !story) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
            >
                <FaTimes size={24} />
            </button>

            {/* Main Content Container */}
            <div className="relative w-full h-full md:max-w-md md:h-[80vh] md:rounded-xl overflow-hidden bg-black flex flex-col">

                {/* Progress Bar (Visual only for now) */}
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-full" />
                    </div>
                </div>

                {/* Header / User Info */}
                <div className="absolute top-4 left-0 right-0 z-20 px-4 pt-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary relative">
                        <Image
                            src={story.author.image || "/images/avatar.png"}
                            alt={story.author.name || "User"}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">
                            {story.author.name || story.author.username || "User"}
                        </span>
                        <span className="text-white/70 text-xs">
                            {formatDistanceToNow(new Date(story.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>

                {/* Story Content */}
                <div className="flex-1 relative flex items-center justify-center">
                    {story.image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={story.image}
                                alt="Story content"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-8 text-center">
                            <p className="text-white font-bold text-2xl md:text-3xl leading-relaxed animate-in fade-in zoom-in duration-500">
                                {story.text}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
