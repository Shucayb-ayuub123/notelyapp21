import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getNote, updateNote, deleteNote } from "@/lib/notes.functions";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_authenticated/notes/$noteId")({
  head: () => ({
    meta: [
      { title: "Note — Inkwell" },
      { name: "description", content: "Read and edit one of your private Inkwell notes." },
      { property: "og:title", content: "Note — Inkwell" },
      { property: "og:description", content: "Read and edit one of your private notes." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoteDetail,
});

function NoteDetail() {
  const { noteId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchNote = useServerFn(getNote);
  const saveNote = useServerFn(updateNote);
  const removeNote = useServerFn(deleteNote);

  const note = useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => fetchNote({ data: { id: noteId } }),
    retry: false,
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (note.data && !hydrated) {
      setTitle(note.data.title);
      setContent(note.data.content);
      setHydrated(true);
    }
  }, [note.data, hydrated]);

  const save = useMutation({
    mutationFn: () =>
      saveNote({ data: { id: noteId, title: title.trim() || "Untitled", content } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const destroy = useMutation({
    mutationFn: () => removeNote({ data: { id: noteId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
      navigate({ to: "/notes", replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/notes">
            <ArrowLeft className="size-4" /> All notes
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      {note.isLoading && <Skeleton className="mt-6 h-64 w-full rounded-xl" />}

      {note.isError && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          This note doesn't exist or isn't yours.
        </p>
      )}

      {note.data && (
        <div className="paper-card mt-6 space-y-4 p-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="border-0 px-0 font-display text-2xl font-semibold shadow-none focus-visible:ring-0"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            rows={14}
            className="resize-none border-0 px-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Created {new Date(note.data.created_at).toLocaleString()}
            </p>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the note from your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => destroy.mutate()}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
                <Save className="size-4" /> {save.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
