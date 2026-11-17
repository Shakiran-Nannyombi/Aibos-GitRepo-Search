import { ChevronLeft, ChevronRight } from 'lucide-react';

const base = 'min-w-10 h-10 px-3 rounded-[var(--radius-control)] border text-sm font-medium tabular-nums transition-colors disabled:opacity-40';
const idle = 'border-border bg-surface text-foreground hover:border-muted';

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }) {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center flex-wrap gap-1.5 pt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                aria-label="Previous page"
                className={`${base} ${idle} px-2`}
            >
                <ChevronLeft className="w-5 h-5 mx-auto" />
            </button>

            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className={`${base} ${idle}`}>
                        1
                    </button>
                    {startPage > 2 && <span className="px-1 text-muted">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={`${base} ${
                        page === currentPage ? 'bg-foreground text-background border-foreground' : idle
                    }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-1 text-muted">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className={`${base} ${idle}`}>
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                aria-label="Next page"
                className={`${base} ${idle} px-2`}
            >
                <ChevronRight className="w-5 h-5 mx-auto" />
            </button>
        </nav>
    );
}
