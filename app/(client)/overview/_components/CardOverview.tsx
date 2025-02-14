"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Rocket,
    Shield,
    Lock,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const features = [
    {
        icon: <Rocket className="w-5 h-5 text-white" />,
        title: "Earn",
        description: "Generate passive income by lending or staking intellectual property assets.",
        border: "border-white/20",
        bg: "bg-gradient-to-br from-[#0900F4] to-[#4D29FF]",
        text: "text-white",
        iconBg: "bg-white/20"
    },
    {
        icon: <Shield className="w-5 h-5" />,
        title: "Borrow",
        description: "Access liquidity by using your intellectual property as collateral.",
        border: "border-green-100/20",
        bg: "bg-gradient-to-br from-[#00F483] to-[#00A3FF]",
        text: "text-black",
        iconBg: "bg-black/20"
    },
    {
        icon: <Lock className="w-5 h-5 text-white" />,
        title: "Pools",
        description: "Participate in curated liquidity pools for diverse IP assets.",
        border: "border-purple-100/20",
        bg: "bg-gradient-to-br from-[#F40071] to-[#FF6B9E]",
        text: "text-white",
        iconBg: "bg-white/20"
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Auctions",
        description: "Engage in competitive bidding for unique intellectual property opportunities.",
        border: "border-indigo-100/20",
        bg: "bg-gradient-to-br from-[#EBF400] to-[#FFD700]",
        text: "text-black",
        iconBg: "bg-black/10"
    }
];

export default function CardOverview() {
    return (
        <div className="container mx-auto space-y-8">
            <Card className="overflow-hidden rounded-2xl">
                <CardContent className="flex flex-col md:flex-row w-full items-center justify-between p-8 space-y-6 md:space-y-0 md:space-x-6">
                    <div className="flex flex-col gap-4 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Label className="text-2xl font-bold block">
                                Arte is a permissionless lending protocol for intellectual property (IP)
                            </Label>
                            <CardDescription className="mt-2 text-textGrayCustom">
                                Built natively on the Story Protocol
                            </CardDescription>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.01
                            }}
                            transition={{
                                duration: 0.6,
                                type: "spring",
                                stiffness: 300
                            }}
                            className="w-fit"
                        >
                            <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 w-fit">
                                View docs
                            </Button>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-row gap-6 items-center"
                    >
                        <div className="flex flex-col items-center">
                            <Label className="text-sm text-gray-500">Curator Highest APY</Label>
                            <Label className="text-3xl font-bold text-blue-600">24.53%</Label>
                        </div>
                        <Separator orientation="vertical" className="h-16 bg-gray-300" />
                        <div className="flex flex-col items-center">
                            <Label className="text-sm text-gray-500">Total Value Locked</Label>
                            <Label className="text-3xl font-bold text-green-600">$10.79M</Label>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, staggerChildren: 0.2 }}
                className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6"
            >
                {features.map((feature, index) => (
                    <motion.a
                        key={index}
                        href={`/${feature.title.toLowerCase()}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.3 }
                        }}
                        className={`
                            ${feature.bg} 
                            ${feature.border} 
                            rounded-2xl 
                            overflow-hidden 
                            shadow-lg 
                            border 
                            cursor-pointer
                            hover:shadow-xl
                        `}
                    >
                        <CardContent className="w-full p-6 space-y-4 relative">
                            <div className="space-y-3">
                                <div className="flex flex-row justify-between items-center">
                                    <div className={`text-2xl font-bold ${feature.text}`}>
                                        {feature.title}
                                    </div>
                                    <div className="flex">
                                        <motion.div
                                            whileHover={{
                                                scale: 1.2
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                type: "spring",
                                                stiffness: 300
                                            }}
                                            className={`
                                                ${feature.iconBg} 
                                                w-10 h-10 
                                                rounded-full 
                                                flex 
                                                items-center 
                                                justify-center
                                            `}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className={`text-sm ${feature.text} opacity-80`}>
                                    {feature.description}
                                </div>
                            </div>
                        </CardContent>
                    </motion.a>
                ))}
            </motion.div>
        </div>
    )
}