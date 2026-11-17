import { useState } from 'react';

// Profile picture with a lettered fallback when the URL is missing or fails to load.
export function Avatar({ src, name, className = '' }) {
    const [failedSrc, setFailedSrc] = useState(null);
    const initial = (name || '?').charAt(0).toUpperCase();

    if (!src || failedSrc === src) {
        return (
            <span
                aria-hidden="true"
                className={`grid place-items-center shrink-0 bg-accent/15 text-accent font-bold select-none ${className}`}
            >
                {initial}
            </span>
        );
    }

    return (
        <img
            src={src}
            alt=""
            loading="lazy"
            onError={() => setFailedSrc(src)}
            className={`shrink-0 object-cover bg-border ${className}`}
        />
    );
}
