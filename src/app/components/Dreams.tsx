import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const defaultDreams = [
  {
    id: "1",
    title: "The Blue River",
    date: "March 4",
    thumbnail: "water river blue",
    description: "I was standing on the edge of a vast blue river...",
  },
  {
    id: "2",
    title: "Garden of Glass",
    date: "March 1",
    thumbnail: "glass garden reflection",
    description: "Walking through a garden where all the plants...",
  },
  {
    id: "3",
    title: "The Forgotten Library",
    date: "February 28",
    thumbnail: "library books ancient",
    description: "Rows upon rows of books in a forgotten place...",
  },
  {
    id: "4",
    title: "Endless Staircase",
    date: "February 25",
    thumbnail: "spiral staircase infinity",
    description: "Climbing stairs that never seemed to end...",
  },
  {
    id: "5",
    title: "Mirror City",
    date: "February 22",
    thumbnail: "city reflection mirror",
    description: "A city made entirely of mirrors and reflections...",
  },
  {
    id: "6",
    title: "The White Room",
    date: "February 19",
    thumbnail: "white minimal room",
    description: "Everything was white, peaceful, and quiet...",
  },
];

export function Dreams() {
  const [dreams, setDreams] = useState(defaultDreams);

  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem("dreams") || "[]");
    if (savedDreams.length > 0) {
      const formattedDreams = savedDreams.map((dream: any) => ({
        id: dream.id,
        title: dream.title,
        date: formatDate(dream.date),
        thumbnail: "dream abstract surreal",
        description: dream.description,
      }));
      setDreams([...formattedDreams, ...defaultDreams]);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month.substring(0, 3)} ${day}`;
  };

  return (
    <div>
      {/* New Dream Button */}
      <div className="px-4 py-3 bg-t-surface-elevated border-b border-t-border-subtle">
        <Link
          to="/dreams/new"
          className="app-btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Dream</span>
        </Link>
      </div>

      {/* Dreams List */}
      <div className="divide-y divide-t-border-subtle">
        {dreams.map((dream) => (
          <Link
            key={dream.id}
            to={`/dreams/${dream.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-t-surface-subtle active:bg-t-surface-subtle"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-t-thumbnail-bg rounded-lg flex-shrink-0 overflow-hidden">
              <ImageWithFallback
                src={`https://source.unsplash.com/100x100/?${dream.thumbnail}`}
                alt={dream.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-t-text-primary mb-1">{dream.title}</h3>
              <p className="text-sm text-t-text-muted">{dream.date}</p>
              {dream.description && (
                <p className="text-sm text-t-text-tertiary line-clamp-1 mt-1">
                  {dream.description.substring(0, 60)}...
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
