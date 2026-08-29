import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NotebookPen, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inkwell — Private Notes for Every Idea" },
      {
        name: "description",
        content:
          "Inkwell is a private notes app. Sign up, write freely, and keep every note locked to your own account.",
      },
      { property: "og:title", content: "Inkwell — Private Notes for Every Idea" },
      {
        property: "og:description",
        content: "Sign up and keep every note private to your account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 font-display text-lg font-semibold">
          <NotebookPen className="size-5 text-primary" />
          Inkwell
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {signedIn ? (
            <Button asChild size="sm">
              <Link to="/notes">My notes</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="size-3.5" /> Private by design
        </span>
        <h1 className="mt-6 text-5xl leading-tight font-semibold sm:text-6xl">
          A quiet place for
          <span className="text-primary"> your notes</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Write, edit and revisit your thoughts. Every note stays permanently tied to your account —
          nobody else can read it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to={signedIn ? "/notes" : "/auth"}>
              {signedIn ? "Open my notes" : "Get started free"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/auth" search={{}}>
              I already have an account
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "Yours only",
              body: "Row-level security locks notes to your account.",
            },
            {
              icon: NotebookPen,
              title: "Fast writing",
              body: "Create, edit and delete in a single view.",
            },
            {
              icon: Sparkles,
              title: "Always saved",
              body: "Notes persist with your account forever.",
            },
          ].map((f) => (
            <div key={f.title} className="paper-card p-5">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
