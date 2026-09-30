"use client"

import type { MouseEvent, ReactNode } from "react"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    ariaLabel: string
    children: ReactNode
    width?: number
}

export default function Modal({ isOpen, onClose, ariaLabel, children, width }: ModalProps) {
    if (!isOpen) return null

    const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={closeOnBackdrop}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                className="w-full max-w-lg rounded-xl bg-white shadow-xl"
                style={width ? { width, maxWidth: "100%" } : undefined}
            >
                {children}
            </section>
        </div>
    )
}
