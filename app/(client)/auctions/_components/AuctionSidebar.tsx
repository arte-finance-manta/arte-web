import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, X } from "lucide-react";
import { COLLECTIONS, SORT_OPTIONS } from "./AuctionsComponent";

export const AuctionSidebar: React.FC<{
    searchText: string;
    setSearchText: (text: string) => void;
    collection: string;
    setCollection: (collection: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    onClearFilters: () => void;
}> = ({
    searchText,
    setSearchText,
    collection,
    setCollection,
    sortBy,
    setSortBy,
    onClearFilters
}) => {
    return (
        <div className="w-full lg:w-64 p-4 border-r shadow-sm">
            <div className="flex items-center mb-4">
                <Filter className="mr-2 text-gray-500" size={20} />
                <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="relative mb-4">
                <Input
                    type="text"
                    placeholder="Search by Token ID"
                    className="pr-8"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {searchText && (
                    <X
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                        size={16}
                        onClick={() => setSearchText("")}
                    />
                )}
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="collection">
                    <AccordionTrigger className="hover:no-underline">
                        Collection
                    </AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={collection}
                            onValueChange={setCollection}
                            className="space-y-2"
                        >
                            {COLLECTIONS.map(col => (
                                <div key={col} className="flex items-center space-x-2">
                                    <RadioGroupItem value={col} id={col} />
                                    <Label htmlFor={col}>{col}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order-by">
                    <AccordionTrigger className="hover:no-underline">
                        Sort By
                    </AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={sortBy}
                            onValueChange={setSortBy}
                            className="space-y-2"
                        >
                            {SORT_OPTIONS.map(option => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value}>{option.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button
                variant="outline"
                className="w-full mt-4 text-red-500 hover:text-red-600"
                onClick={onClearFilters}
            >
                <X className="mr-2" size={16} /> Clear all filters
            </Button>
        </div>
    );
};