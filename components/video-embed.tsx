/**
 * YouTube embed with no autoplay and an explicit aspect ratio, so it costs no
 * layout shift. Uses the privacy-friendly host, the site sets no cookies of its
 * own and should not invite any.
 */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="bg-ink relative aspect-video w-full overflow-hidden rounded-[--radius-card]">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
