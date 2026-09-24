import { useEffect } from "react";


type BoarderProps = {
    rows: object[];
    rowStyle?: string;
    columns: string[];
};
export default function Border({ columns, rows, rowStyle }: BoarderProps) {

    return (
        <div className="">
            <table className="w-full">
                <thead className="text-gray-500 border-b border-gray-300 text-center">
                    <tr>
                        {
                            columns.map((cols, index) => {
                                return (
                                    <th key={`col_${index}`} className="font-normal py-2">
                                        {cols}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        return (
                            <tr key={`row_${index}`} className={rowStyle ? rowStyle : "h-12"}>
                                {/* 오브젝트의 키 갯수 만큼 테이블 td 생성 */}
                                {Object.values(row).map((value,idx) => {
                                    return (
                                        <td key={idx}>
                                            {value}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}