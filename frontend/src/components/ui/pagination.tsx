import type { LinkProps } from "../../../types/types";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

interface PaginationDataProps {
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface PaginationProps {
    paginateData: PaginationDataProps;
    perPage: number | null;
    onPerPageChange: (value: string | number) => void;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    paginateData,
    perPage,
    onPerPageChange,
    onPageChange,
}: PaginationProps) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-black">
                Showing <strong>{paginateData.from}</strong> to{" "}
                <strong>{paginateData.to}</strong> of{" "}
                <strong>{paginateData.total}</strong> entries
            </p>

            <div className="flex items-center space-x-4">
                <span className="text-sm text-black">Row per page:</span>
                <Select
                    onValueChange={onPerPageChange}
                    value={perPage?.toString() || "10"}
                >
                    <SelectTrigger className="w-[120px] h-8">
                        <span className="block truncate">
                            Entries: {perPage === -1 ? "All" : perPage}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="-1">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex space-x-2">
                {paginateData.links.map((link, index) => {
                    const pageNumber = link.page;
                    const isDisabled = !pageNumber;

                    return (
                        <Button
                            key={index}
                            onClick={() =>
                                pageNumber && onPageChange(pageNumber)
                            }
                            className={`px-3 py-2 h-8 rounded-md ${
                                isDisabled
                                    ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                                    : link.label.includes("Next") ||
                                      link.label.includes("Previous")
                                    ? "bg-indigo-600 text-white hover:bg-indigo-300" // Next/Prev style
                                    : link.active
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700" // Active page
                                    : "bg-indigo-100 text-black hover:bg-indigo-100" // Normal page
                            }`}
                            disabled={isDisabled}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
