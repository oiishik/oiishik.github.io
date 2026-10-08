import { profile } from "../config/profile";

export function SiteFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-line bg-header">
      <div className="flex w-full flex-col gap-2 px-5 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          {profile.role} · A portfolio by {profile.name}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a className="font-medium text-brand underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a
            className="font-medium text-brand underline-offset-2 hover:underline"
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
