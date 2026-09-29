"use client"

import { useState } from "react";


type TextInputBtnProps ={
    title: string
    urlText: string
    urlStr: string
    onUrlChange: (value: string) => void
    onAdd: () => void
    onRemove: () => void
}

export default function TextinputBtn({title, onAdd, onRemove, onUrlChange, urlStr, urlText} : TextInputBtnProps) {

    return (
        <div className="w-full space-y-2">
      <div>
        <span className="font-bold">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={
            urlStr !== ''
              ? '삽입된 링크가 있습니다.'
              : urlText
          }
          readOnly={urlStr !== ''}
          className={
            urlStr === ''
              ? 'w-full border border-gray-300 rounded-xl p-2'
              : 'w-full border border-gray-300 rounded-xl p-2 bg-gray-100 text-gray-300'
          }
          onChange={(e) => {
            onUrlChange(e.target.value)
          }}
        />

        <div className="w-15 text-center bg-[#17A48A] text-white rounded-xl p-2 font-semibold">
          <button onClick={onAdd}>
            삽입
          </button>
        </div>
      </div>

      {urlStr && (
        <div className="relative">
          <div className="border border-gray-300 bg-gray-100 p-2 rounded-xl">
            {urlStr}
          </div>

          <div className="absolute top-2 right-5">
            <button onClick={onRemove}>
              x
            </button>
          </div>
        </div>
      )}
    </div>
    )

}