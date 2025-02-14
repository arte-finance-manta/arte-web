"use client"

import Image from "next/image"
import React, { useState } from "react"
import { Label } from "../ui/label"
import { FaBook, FaDiscord, FaGithub, FaTwitter } from "react-icons/fa"
import Link from "next/link"
import { ChevronUp } from "lucide-react"
import { Button } from "../ui/button"
import { motion, AnimatePresence } from "framer-motion"

export const Footer = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <footer className="w-full border-t-2 px-5 sm:px-10 lg:px-20">
            <div className="relative flex justify-between items-center py-5 w-full h-auto z-40 gap-5 xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
                <div className="flex flex-row gap-10">
                    <div className="flex flex-row space-x-2 items-center">
                        <Image src={"https://res.cloudinary.com/dutlw7bko/image/upload/v1731828498/Artha/story-protocol-logo_bknevb.jpg"} width={50} height={50} alt="audits" className="rounded-full" />
                        <div className="flex flex-col">
                            <Label className="font-bold text-sm sm:text-md">Build On</Label>
                            <Label className="text-xs sm:text-sm">Story Protocol</Label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <Button
                        className="block sm:hidden p-2 transition-all duration-200"
                        onClick={() => setIsDialogOpen(!isDialogOpen)}
                        variant={"outline"}
                    >
                        <motion.div
                            animate={{ rotate: isDialogOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronUp size={24} />
                        </motion.div>
                    </Button>

                    <AnimatePresence>
                        {isDialogOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="sm:hidden flex flex-col gap-5 p-4 border rounded-md shadow-md bg-background/90 absolute bottom-full mb-3"
                            >
                                <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://x.com"}>
                                    <FaTwitter />
                                </Link>
                                <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://discord.com"}>
                                    <FaDiscord />
                                </Link>
                                <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://github.com/Arte-Finance-Protocol"}>
                                    <FaGithub />
                                </Link>
                                <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://kbaji.gitbook.io/arte-finance"}>
                                    <FaBook />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="hidden sm:flex flex-row gap-5">
                        <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://x.com"}>
                            <FaTwitter />
                        </Link>
                        <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://discord.com"}>
                            <FaDiscord />
                        </Link>
                        <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://github.com/Arte-Finance-Protocol"}>
                            <FaGithub />
                        </Link>
                        <Link className="hover:text-primary/70 duration-200" target="_blank" href={"https://kbaji.gitbook.io/arte-finance"}>
                            <FaBook />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
