import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { NotebookPen, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { listNotes, createNote, getMyProfile } from "@/lib/notes.functions";

export const Route = createFileRoute("/_authenticated/notes/")({
  head: () => ({
    meta: [
      { title: "My Notes — Inkwell" },
      { name: "description", content: "Create, read, edit and delete your private notes." },
      { property: "og:title", content: "My Notes — Inkwell" },
      { property: "og:description", content: "Your private notebook on Inkwell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchNotes = useServerFn(listNotes);
  const fetchProfile = useServerFn(getMyProfile);
  const addNote = useServerFn(createNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const notes = useQuery({ queryKey: ["notes"], queryFn: () => fetchNotes() });
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  const create = useMutation({
    mutationFn: (vars: { title: string; content: string }) => addNote({ data: vars }),
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <NotebookPen className="size-4 text-primary" /> Inkwell
          </span>
          <h1 className="mt-1 text-3xl font-semibold">
            {profile.data?.name ? `${profile.data.name}'s notes` : "My notes"}
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <form
        className="paper-card mt-8 space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() && !content.trim()) {
            toast.error("Write something first");
            return;
          }
          create.mutate({ title: title.trim() || "Untitled", content });
        }}
      >
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 px-0 font-display text-lg shadow-none focus-visible:ring-0"
        />
        <Textarea
          placeholder="Start writing…"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none border-0 px-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={create.isPending}>
            <Plus className="size-4" /> {create.isPending ? "Saving…" : "Add note"}
          </Button>
        </div>
      </form>

      <section className="mt-8 space-y-3">
        {notes.isLoading && (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        )}

        {notes.data?.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No notes yet. Your first one is waiting above.
          </p>
        )}

        {notes.data?.map((note) => (
          <Link
            key={note.id}
            to="/notes/$noteId"
            params={{ noteId: note.id }}
            className="paper-card block p-5 transition-colors hover:border-primary/50"
          >
            <h2 className="font-display text-lg font-semibold">{note.title || "Untitled"}</h2>
            {note.content && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Updated {new Date(note.updated_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
