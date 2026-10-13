import { Link } from "react-router";
import { User, Search } from "lucide-react";
import { useState, useMemo, type FormEvent } from "react";

const newParallels = [
  { id: "11", name: "Mila", parallelId: "11", match: 97, universeDistance: 2, job: "UX Director", keywords: "design leadership sustainable tech" },
  { id: "266", name: "Míla", parallelId: "266", match: 82, universeDistance: 45, job: "Photographer", keywords: "photography architecture travel art" },
  { id: "501", name: "Mila", parallelId: "501", match: 74, universeDistance: 112, job: "Teacher", keywords: "education teaching children" },
  { id: "612", name: "Mila", parallelId: "612", match: 69, universeDistance: 89, job: "Chef", keywords: "cooking culinary food restaurant" },
  { id: "887", name: "Sylvie", parallelId: "887", match: 58, universeDistance: 203, job: "Musician", keywords: "music performance guitar jazz" },
  { id: "944", name: "Robbie", parallelId: "944", match: 53, universeDistance: 287, job: "Engineer", keywords: "software development coding tech" },
  { id: "723", name: "Mila", parallelId: "723", match: 76, universeDistance: 67, job: "Writer", keywords: "writing journalism stories content" },
  { id: "334", name: "Meela", parallelId: "334", match: 81, universeDistance: 52, job: "Designer", keywords: "design graphic visual branding" },
  { id: "167", name: "Mila", parallelId: "167", match: 90, universeDistance: 12, job: "Product Manager", keywords: "product management tech strategy" },
  { id: "892", name: "Mila", parallelId: "892", match: 65, universeDistance: 156, job: "Therapist", keywords: "therapy psychology mental health" },
  { id: "445", name: "Robbie", parallelId: "445", match: 59, universeDistance: 198, job: "Artist", keywords: "art painting sculpture creative" },
  { id: "678", name: "Mila", parallelId: "678", match: 72, universeDistance: 78, job: "Consultant", keywords: "consulting business strategy" },
  { id: "201", name: "Míla", parallelId: "201", match: 85, universeDistance: 34, job: "Architect", keywords: "architecture design buildings" },
  { id: "956", name: "Sylvie", parallelId: "956", match: 52, universeDistance: 312, job: "Scientist", keywords: "research science biology lab" },
  { id: "128", name: "Mila", parallelId: "128", match: 94, universeDistance: 7, job: "Creative Director", keywords: "creative direction design advertising" },
  { id: "789", name: "Mila", parallelId: "789", match: 68, universeDistance: 124, job: "Lawyer", keywords: "law legal attorney justice" },
  { id: "432", name: "Meela", parallelId: "432", match: 77, universeDistance: 61, job: "Marketing Lead", keywords: "marketing strategy branding campaigns" },
  { id: "665", name: "Mila", parallelId: "665", match: 70, universeDistance: 98, job: "Entrepreneur", keywords: "startup business founder innovation" },
];

type SortOption = "strongest" | "weakest" | "closest" | "farthest";

export function Discover() {
  const [sortBy, setSortBy] = useState<SortOption>("strongest");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSortBy("strongest");
  };

  const filteredAndSortedParallels = useMemo(() => {
    // Filter by search query
    let filtered = newParallels;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = newParallels.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.job.toLowerCase().includes(query) ||
          p.keywords.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "strongest":
        sorted.sort((a, b) => b.match - a.match);
        break;
      case "weakest":
        sorted.sort((a, b) => a.match - b.match);
        break;
      case "closest":
        sorted.sort((a, b) => a.universeDistance - b.universeDistance);
        break;
      case "farthest":
        sorted.sort((a, b) => b.universeDistance - a.universeDistance);
        break;
    }

    return sorted;
  }, [sortBy, searchQuery]);

  const showDistance = sortBy === "closest" || sortBy === "farthest";

  return (
    <div className="px-4 py-4">
      {/* Search and Sort Controls */}
      <div className="mb-4 space-y-3">
        {/* Search Field */}
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-text-placeholder" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, job, or interests"
              className="app-input w-full pl-10"
            />
          </div>
        </form>

        {/* Sort Control and Clear Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-t-text-muted flex-shrink-0">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="flex-1 px-3 py-2 bg-t-surface-elevated text-t-text-primary border border-t-border-subtle rounded-lg text-sm focus:outline-none focus:border-t-border-medium"
          >
            <option value="strongest">Strongest Match</option>
            <option value="weakest">Weakest Match</option>
            <option value="closest">Closest Universe</option>
            <option value="farthest">Most Distant Universe</option>
          </select>
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-t-link active:text-t-link"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid Layout - 3 cards per row */}
      <div className="grid grid-cols-3 gap-3">
        {filteredAndSortedParallels.map((parallel) => (
          <Link
            key={parallel.id}
            to={`/profile/${parallel.id}?new=true`}
            className="flex flex-col items-center p-2 border border-t-border-subtle rounded-lg active:bg-t-surface-subtle"
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-t-thumbnail-bg flex items-center justify-center mb-1.5">
              <User className="w-7 h-7 text-t-text-tertiary" />
            </div>

            {/* Name */}
            <div className="text-sm text-t-text-primary text-center mb-0.5 truncate w-full">
              {parallel.name}
            </div>

            {/* Parallel ID */}
            <div className="app-caption mb-1">#{parallel.parallelId}</div>

            {/* Match Percentage */}
            <div className="text-xs bg-t-surface-subtle text-t-text-secondary px-2 py-0.5 rounded mb-1">
              {parallel.match}%
            </div>

            {/* Distance (conditional) */}
            {showDistance && (
              <div className="app-caption">
                {parallel.universeDistance} LY
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredAndSortedParallels.length === 0 && (
        <div className="text-center py-8 text-t-text-muted text-sm">
          No parallels found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
