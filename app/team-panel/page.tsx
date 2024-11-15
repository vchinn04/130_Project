"use client";

import React from 'react';
import {
    UserCircle,
    Settings,
    // MessageCircle,
    Users,
    Hash,
    Bell,
    PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import PopUp from '../@home/components/PopUp';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
export default function TeamPanel() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-800">
            {/* Left Sidebar - Channel List */}
            <div className="w-64 bg-gray-900 text-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <div>
                        <Link href="/"> Return to Home Screen </Link>
                    </div>
                    <h1 className="text-xl font-bold">Team Awesome</h1>
                </div>

                {/* Channels Section */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-3 py-2">
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                            <span>TEXT CHANNELS</span>
                            <PlusCircle size={16} className="cursor-pointer hover:text-gray-200" />
                        </div>

                        {/* Channel List */}
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">
                                <Hash size={20} className="mr-2" />
                                <span>general</span>
                            </div>
                            <div className="flex items-center px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">
                                <Hash size={20} className="mr-2" />
                                <span>announcements</span>
                            </div>
                            <div className="flex items-center px-2 py-1 hover:bg-gray-700 rounded cursor-pointer bg-gray-700">
                                <Hash size={20} className="mr-2" />
                                <span>team-chat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="h-14 border-b border-gray-700 bg-gray-800 flex items-center px-4 justify-between">
                    <div className="flex items-center">
                        <Hash size={24} className="text-gray-400 mr-2" />
                        <span className="text-gray-100 font-semibold">team-chat</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400">
                        <Bell className="cursor-pointer hover:text-gray-100" />
                        <Users className="cursor-pointer hover:text-gray-100" />
                        <Settings className="cursor-pointer hover:text-gray-100" />
                    </div>
                </div>

                {/* Member List - Right Sidebar */}
                <div className="flex flex-1">
                    <div className="flex-1 bg-gray-700">
                        {/* Chat content would go here */}
                        <Button onClick={() => setIsPopupOpen(!isPopupOpen)}>Toggle Popup</Button>
                        {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
                        </div>
                        <div className="w-60 bg-gray-800 p-4">
                            <div className="text-gray-400 text-sm mb-4">MEMBERS - 5</div>
                            <div className="space-y-2">
                                {/* Online Members */}
                            <div className="text-gray-400 text-xs mt-4 mb-2">ONLINE - 3</div>
                            <div className="flex items-center text-gray-200 py-2">
                                <UserCircle className="mr-2" />
                                <span>John Doe</span>
                            </div>
                            <div className="flex items-center text-gray-200 py-2">
                                <UserCircle className="mr-2" />
                                <span>Jane Smith</span>
                            </div>
                            <div className="flex items-center text-gray-200 py-2">
                                <UserCircle className="mr-2" />
                                <span>Bob Johnson</span>
                            </div>

                            {/* Offline Members */}
                            <div className="text-gray-400 text-xs mt-4 mb-2">OFFLINE - 2</div>
                            <div className="flex items-center text-gray-500 py-2">
                                <UserCircle className="mr-2" />
                                <span>Alice Brown</span>
                            </div>
                            <div className="flex items-center text-gray-500 py-2">
                                <UserCircle className="mr-2" />
                                <span>Charlie Wilson</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
