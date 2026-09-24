import { useEffect } from "react";


type BoarderProps = {
    rows: object[];
    columns: string[];
};
export default function Border({ columns, rows }: BoarderProps) {

    useEffect(() => {
        console.log(rows)
    })
    return (
        <div className="">
            <table className="w-full">
                <thead>
                    <tr>
                        {
                            columns.map((cols, index) => {
                                return (
                                    <th key={`col_${index}`} className="text-center">
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
                            <tr key={`row_${index}`}>
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