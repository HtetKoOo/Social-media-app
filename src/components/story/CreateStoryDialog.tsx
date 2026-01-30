import React, { useState, useRef } from "react";
import { FaImage, FaFont, FaTimes } from "react-icons/fa";
import { useCreateStory } from "../../../custom-hooks/useStory";
import Image from "next/image";
import { toast } from "react-toastify";

type CreateStoryDialogProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

type StoryType = "text" | "image" | null;

export default function CreateStoryDialog({
    isOpen,
    setIsOpen,
}: CreateStoryDialogProps) {
    const [storyType, setStoryType] = useState<StoryType>(null);
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createStory, isPending } = useCreateStory();

    const resetForm = () => {
        setStoryType(null);
        setText("");
        setImageFile(null);
        setImagePreview(null);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setStoryType("image");
        }
    };

    const handleSubmit = () => {
        if (!storyType) return;

        if (storyType === "text" && !text.trim()) {
            toast.error("Please enter some text");
            return;
        }
        if (storyType === "image" && !imageFile) {
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData();
        if (storyType === "text") {
            formData.append("text", text);
        } else if (imageFile) {
            formData.append("image", imageFile);
        }

        createStory(formData, {
            onSuccess: () => {
                toast.success("Story created successfully");
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create story");
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dark-2 w-full max-w-md rounded-2xl p-6 relative shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-dark-4 pb-4">
                    <h2 className="text-xl font-bold text-gray-100">Create Story</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[300px] flex flex-col items-center justify-center">
                    {storyType === null ? (
                        <div className="flex gap-6">
                            <button
                                onClick={() => setStoryType("text")}
                                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-dark-3 hover:bg-dark-4 transition-colors w-32 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaFont className="text-white text-xl" />
                                </div>
                                <span className="text-gray-200 font-medium">Text</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-dark-3 hover:bg-dark-4 transition-colors w-32 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaImage className="text-white text-xl" />
                                </div>
                                <span className="text-gray-200 font-medium">Photo</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="w-full flex-1 flex flex-col animate-in fade-in zoom-in duration-200">
                            {/* Preview Area */}
                            <div className="flex-1 relative rounded-lg overflow-hidden bg-dark-3 mb-4 flex items-center justify-center min-h-[250px]">
                                {storyType === "text" ? (
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Start typing..."
                                        className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 text-center text-xl font-bold placeholder-white/50 outline-none resize-none flex items-center justify-center"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="relative w-full h-full min-h-[300px]">
                                        {imagePreview && (
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-contain bg-black"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center mt-auto">
                                <button
                                    onClick={() => {
                                        setStoryType(null);
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isPending ? "Sharing..." : "Share to Story"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
