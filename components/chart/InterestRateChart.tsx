import React, { useState, useEffect, useMemo } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    TrendingUp,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const calculateOptimalRate = (utilization: number) => {
    const baseRate = 2;
    const utilizationFactor = Math.pow(utilization / 100, 1.5);
    const kink = 0.8;
    const multiplier = utilization > kink * 100 ? 5 : 1;

    return baseRate +
        (utilizationFactor * 15 * multiplier) +
        (Math.max(0, utilization - 90) * 0.5);
};

const calculateSupplyRate = (borrowRate: number, utilization: number) => {
    return (borrowRate * (utilization / 100)) * 0.85;
};

const InterestRateChart = () => {
    const [currentUtilization, setCurrentUtilization] = useState(38.09);
    const [timeframe, setTimeframe] = useState("1d");
    const [isAnimating, setIsAnimating] = useState(true);

    const generateChartData = useMemo(() => {
        const data = [];
        for (let i = 0; i <= 100; i += 0.5) {
            const borrowAPR = calculateOptimalRate(i);
            const supplyAPR = calculateSupplyRate(borrowAPR, i);

            data.push({
                utilization: i,
                borrowAPR: Number(borrowAPR.toFixed(2)),
                supplyAPR: Number(supplyAPR.toFixed(2)),
                currentUtilization: i === Math.round(currentUtilization * 2) / 2 ? borrowAPR : null,
            });
        }
        return data;
    }, [currentUtilization]);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleUtilizationChange = (values: number[]) => {
        setCurrentUtilization(values[0]);
        setIsAnimating(true);
    };

    const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: { name: string, value: string, color: string }[], label: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-4 rounded-lg shadow-lg border bg-primary">
                    <p className="font-bold text-secondary">Utilization: {Number(label).toFixed(2)}%</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-xs">
                            {entry.name}: {Number(entry.value).toFixed(2)}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Interest Rate Analytics
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg sm:items-center">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium">Current Utilization</label>
                            <Slider
                                value={[currentUtilization]}
                                max={100}
                                step={0.01}
                                className="mt-2"
                                onValueChange={handleUtilizationChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Select value={timeframe} onValueChange={setTimeframe}>
                                <SelectTrigger className="w-20 sm:w-24">
                                    <SelectValue placeholder="Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1d">1D</SelectItem>
                                    <SelectItem value="1w">1W</SelectItem>
                                    <SelectItem value="1m">1M</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer>
                            <AreaChart
                                data={generateChartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                            >
                                <defs>
                                    <linearGradient id="borrowGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="stableGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" className="stroke-primary/20" />
                                <XAxis
                                    dataKey="utilization"
                                    tickFormatter={(value) => `${value}%`}
                                    domain={[0, 100]}
                                    type="number"
                                    padding={{ left: 0, right: 0 }}
                                >
                                </XAxis>
                                <YAxis
                                    tickFormatter={(value) => `${value}%`}
                                    domain={[0, "auto"]}
                                    padding={{ top: 20, bottom: 0 }}
                                >
                                </YAxis>

                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            active={true}
                                            payload={[]}
                                            label={`${currentUtilization.toFixed(2)}%`}
                                        />}
                                />
                                <Legend />

                                <ReferenceLine
                                    x={currentUtilization}
                                    stroke="#6b7280"
                                    strokeDasharray="3 3"
                                    label={{
                                        value: `Current: ${currentUtilization.toFixed(2)}%`,
                                        position: "top",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="borrowAPR"
                                    stroke="#3b82f6"
                                    fill="url(#borrowGradient)"
                                    name="Variable Borrow APR"
                                    isAnimationActive={isAnimating}
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                />

                                <Area
                                    type="monotone"
                                    dataKey="supplyAPR"
                                    stroke="#22c55e"
                                    fill="url(#supplyGradient)"
                                    name="Supply APR"
                                    isAnimationActive={isAnimating}
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                />

                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InterestRateChart;