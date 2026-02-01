import { User } from "../../../types/user";
import Image from "next/image";
import { SlCalender } from "react-icons/sl";
import moment from "moment";

export default function ProfileCard({ user, setIsModalOpen }: { user: User | undefined, setIsModalOpen: (Open: boolean) => void }) {

    return (
        <div className="bg-dark-3 px-4 py-8 rounded-2xl">
            <div className="relative w-25 h-25 shrink-0">
                <Image
                    src={user?.image || "/images/avatar.png"}
                    alt="profile-pic"
                    fill
                    className="object-cover rounded-full border-6 border-dark-4"
                />
            </div>
            <div className="mt-6 text-gray-200">
                <p className="text-2xl font-bold">{user?.name}</p>
                <p className="text-md font-normal text-gray-500">@{user?.username}</p>
                <div className="mt-6">
                    <label className="block text-sm text-gray-600 font-medium">
                        Bio
                    </label>
                    <p className="mt-1 text-sm text-gray-300">
                        {user?.bio || "Your bio will help others get to know you better!"}
                    </p>
                </div>
            </div>
            <p className="flex my-4 gap-2 items-center">
                <SlCalender size={15} className="text-primary" />
                <span className="text-gray-400 text-sm">
                    Joined {moment(user?.createdAt).fromNow()}
                </span>
            </p>

            {/* profile stats and edit profile button */}
            <div className="flex items-center gap-6">
                <div className="text-center text-gray-200">
                    <p className="font-semibold">{user?._count.posts}</p>
                    <p className="font-normal text-gray-400 text-xs">Posts</p>
                </div>
                <div className="text-center text-gray-200">
                    <p className="font-semibold">{user?._count.followers}</p>
                    <p className="font-normal text-gray-400 text-xs">Followers</p>
                </div>
                <div className="text-center text-gray-200">
                    <p className="font-semibold">{user?._count.following}</p>
                    <p className="font-normal text-gray-400 text-xs">Following</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex bg-primary px-4 py-2 rounded-full cursor-pointer"
                >
                    Edit Profile
                </button>
            </div>

        </div>
    )
}