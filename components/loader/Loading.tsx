import React from "react"

export default function Loading() {
    return (
        <div className="banter-loader z-[9999] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
        </div>
    )
}
