import type { LinkProps } from "../../../types/types";
import { useLanguage } from "../../hooks/useLanguage";
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
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";

    const getLinkLabel = (link: LinkProps) => {
        if (link.type === "next" || /Next|»/i.test(link.label)) {
            return t("next");
        }
        if (link.type === "previous" || /Previous|«/i.test(link.label)) {
            return t("previous");
        }
        return link.label; // page number
    };

    return (
        <div className="flex justify-between items-center mt-4">
            {/* Showing X to Y of Z entries */}
            <p className={`text-sm text-black ${font}`}>
                {t("showing")} <strong>{paginateData.from}</strong> {t("to")}{" "}
                <strong>{paginateData.to}</strong> {t("of")}{" "}
                <strong>{paginateData.total}</strong> {t("entries")}
            </p>

            {/* Per page selector */}
            <div className="flex items-center">
                <span
                    className={`text-sm text-black ${font} ${
                        isRTL ? "mr-2" : "ml-2"
                    }`}
                >
                    {t("rowPerPage")}:
                </span>
                <Select
                    onValueChange={onPerPageChange}
                    value={perPage?.toString() || "10"}
                >
                    <SelectTrigger className="w-[80px] h-8">
                        <span className={`block truncate ${font}`}>
                            {perPage === -1 ? t("all") : perPage}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50, 100].map((n) => (
                            <SelectItem
                                key={n}
                                value={n.toString()}
                                className={font}
                            >
                                {n}
                            </SelectItem>
                        ))}
                        <SelectItem value="-1" className={font}>
                            {t("all")}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Pagination buttons */}
            <div className={`flex ${isRTL ? "flex-row-reverse" : ""} gap-2`}>
                {paginateData.links.map((link, index) => {
                    const pageNumber = link.page;
                    const isDisabled = !pageNumber;

                    const label = getLinkLabel(link);

                    return (
                        <Button
                            key={index}
                            onClick={() =>
                                pageNumber && onPageChange(pageNumber)
                            }
                            className={`px-3 py-2 h-8 rounded-md ${
                                isDisabled
                                    ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                                    : /next|previous/i.test(label)
                                    ? "bg-indigo-600 text-white hover:bg-indigo-300" // Next/Prev style
                                    : link.active
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700" // Active page
                                    : "bg-indigo-100 text-black hover:bg-indigo-100" // Normal page
                            } ${font}`}
                            disabled={isDisabled}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
