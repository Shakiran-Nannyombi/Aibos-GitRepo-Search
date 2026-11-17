import PropTypes from 'prop-types';

const EXAMPLES = ['react table', 'cli language:rust', 'state machine language:typescript', 'llm stars:>5000'];

export function EmptyState({ type, message, onExample }) {
    const isStart = type === 'no-search';

    return (
        <div className="py-16 sm:py-20 max-w-xl">
            <h2 className="text-2xl font-bold">
                {isStart ? 'What are you looking for?' : 'No repositories match'}
            </h2>
            <p className="mt-2 text-muted leading-relaxed">
                {message ||
                    (isStart
                        ? 'Search with keywords, or add GitHub qualifiers such as language: and stars: to narrow it down.'
                        : 'Try fewer or broader keywords, or remove a filter.')}
            </p>

            {onExample && (
                <div className="mt-6">
                    <p className="text-sm text-muted mb-2">{isStart ? 'Try one of these:' : 'Or try:'}</p>
                    <ul className="flex flex-wrap gap-2">
                        {EXAMPLES.map((q) => (
                            <li key={q}>
                                <button
                                    onClick={() => onExample(q)}
                                    className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-surface font-mono text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                                >
                                    {q}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

EmptyState.propTypes = {
    type: PropTypes.oneOf(['no-search', 'no-results']).isRequired,
    message: PropTypes.string,
    onExample: PropTypes.func,
};
