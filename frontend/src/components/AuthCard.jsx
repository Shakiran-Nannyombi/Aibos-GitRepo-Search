import { GithubIcon } from './BrandIcons';

// Shared layout for the login and sign-up pages: GitHub first, email below.
export function AuthCard({ title, subtitle, githubLabel, onGithub, error, onSubmit, submitLabel, children, footer }) {
  return (
    <div className="max-w-sm mx-auto pt-8 sm:pt-12">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{title}</h1>
      <p className="mt-2 text-muted">{subtitle}</p>

      <button
        type="button"
        onClick={onGithub}
        className="mt-8 w-full inline-flex items-center justify-center gap-2.5 py-3 rounded-[var(--radius-control)] bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
      >
        <GithubIcon className="w-5 h-5" />
        {githubLabel}
      </button>

      <div className="my-6 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-border" />
        or use email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="text-sm text-danger border border-danger/30 bg-danger/10 rounded-[var(--radius-control)] px-3 py-2">
            {error}
          </p>
        )}
        {children}
        <button
          type="submit"
          className="w-full py-3 rounded-[var(--radius-control)] bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors"
        >
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">{footer}</p>
    </div>
  );
}

export function Field({ id, label, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <input
        id={id}
        name={id}
        required
        className="block w-full px-3 py-2.5 rounded-[var(--radius-control)] bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"
        {...inputProps}
      />
    </div>
  );
}
