

export default function LoginLayout({children} : {children : React.ReactNode}) {

    return (
        <div className="w-87 m-auto space-y-4">
            <div className="w-full flex items-center gap-4 justify-center">
                <div className="text-4xl font-bold bg-[#17A48A] text-white p-4 rounded-md shadow-2xl">
                    <div className="text-shadow-lg">
                        us
                    </div>
                </div>
                <div className="font-bold text-2xl">
                    US Alliance
                </div>
            </div>
            <div className="py-4">
                {children}
            </div>
        </div>
    )
}