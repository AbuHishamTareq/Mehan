import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import JannaFontBase64 from "../assets/fonts/Janna-LT-Bold";

(pdfMake as any).vfs = {
    "Janna-LT-Bold.ttf": JannaFontBase64,
};

(pdfMake as any).fonts = {
    Janna: {
        normal: "Janna-LT-Bold.ttf",
        bold: "Janna-LT-Bold.ttf",
        italics: "Janna-LT-Bold.ttf",
        bolditalics: "Janna-LT-Bold.ttf",
    },
};

function isRTLText(text: string): boolean {
    const rtlChars = /[\u0600-\u06FF]/; // Arabic Unicode range
    return rtlChars.test(text);
}

interface Column {
    key: string;
    label: string;
}

interface GenerateAndDownloadFileProps<T> {
    data: T[];
    columns: Column[];
    fileName: string;
    toast: (params: {
        title: string;
        description: string;
        variant: "default" | "destructive" | "success" | null | undefined;
        className?: string;
    }) => void;
    t: (label: string) => string;
    type: "csv" | "excel" | "pdf";
}

export async function generateAndDownloadFile<T>({
    data,
    columns,
    fileName,
    toast,
    t,
    type,
}: GenerateAndDownloadFileProps<T>) {
    if (data.length === 0) {
        toast({
            title: "Notification",
            description: "Table is empty.",
            variant: "destructive",
        });
        return;
    }

    const validColumns = columns.filter(
        (col) => !["actions", "status"].includes(col.key)
    );
    const headers = validColumns.map((col) => t(col.label));

    const rows: any[][] = data.map((item) =>
        validColumns.map((col) => {
            const value = (item as any)[col.key];
            if (Array.isArray(value)) {
                return value
                    .map(
                        (v) =>
                            (v as any).label ||
                            (v as any).name ||
                            JSON.stringify(v)
                    )
                    .join(", ");
            }
            if (typeof value === "object" && value !== null) {
                const obj = value as { label?: string; name?: string };
                return obj.label || obj.name || JSON.stringify(obj);
            }
            return value ?? "";
        })
    );

    if (type === "csv") {
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${fileName}.csv`);
    }

    if (type === "excel") {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Data");

        sheet.addRow(headers);
        rows.forEach((r) => sheet.addRow(r));

        // Style headers
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "DCE6F1" },
            };
            cell.alignment = { horizontal: "center" };
        });

        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = {
                    horizontal: isRTLText(cell.value?.toString() || "")
                        ? "right"
                        : "left",
                };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    }

    if (type === "pdf") {
        const docDefinition: TDocumentDefinitions = {
            pageSize: "A4",
            pageOrientation: "landscape",
            defaultStyle: {
                font: "Janna",
                fontSize: 10,
                alignment: "left", // default, per cell override below
            },
            content: [
                {
                    text: t(fileName.replace(/_/g, " ")),
                    style: "header",
                    alignment: "center",
                    margin: [0, 0, 0, 10],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: Array(headers.length).fill("*"),
                        body: [
                            // Headers
                            headers.map((h) => ({
                                text: h,
                                bold: true,
                                alignment: "center",
                            })),
                            // Data rows
                            ...rows.map((row) =>
                                row.map((cell) => ({
                                    text: cell,
                                    alignment: isRTLText(cell?.toString() || "")
                                        ? "right"
                                        : "left",
                                }))
                            ),
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex: number) =>
                            rowIndex === 0 ? "#DCE6F1" : null,
                    },
                },
            ],
            styles: {
                header: { fontSize: 16, bold: true },
            },
        };

        pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
    }

    toast({
        title: "Notification",
        description: `Exported ${data.length} records to ${fileName}.${type}`,
        variant: "success",
    });
}
