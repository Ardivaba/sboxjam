"use client";

import { useState } from "react";

export function TestRibbon() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 z-[100]" style={{ width: 0, height: 0 }}>
        <div
          className="absolute bg-white/[0.06] backdrop-blur-sm border-y border-white/[0.08] cursor-pointer pointer-events-auto"
          style={{
            width: 300,
            top: 42,
            left: -108,
            transform: "rotate(-45deg)",
            transformOrigin: "center",
            padding: "4px 0",
          }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onClick={() => setShow((v) => !v)}
        >
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-[0.15em] text-center">
            Test
          </p>
        </div>
      </div>

      {show && (
        <div className="fixed top-14 left-3 z-[100] max-w-[220px] text-xs text-text-muted bg-[rgba(10,16,24,0.95)] backdrop-blur-md border border-white/[0.08] rounded-md px-3 py-2.5 shadow-lg pointer-events-none">
          This is a test version. Not the actual game jam.
        </div>
      )}
    </>
  );
}
