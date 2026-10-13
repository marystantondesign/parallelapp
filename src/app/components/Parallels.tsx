import { Link } from "react-router";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { getExchangeState, subscribeToExchangeState } from "../lib/exchangeState";

const conversations = [
  {
    id: "84",
    name: "Mila",
    parallelId: "84",
    match: 92,
    lastMessage: "Did you end up leaving the design job?",
    time: "2h ago",
    unread: 0,
  },
  {
    id: "18",
    name: "Meela",
    parallelId: "18",
    match: 86,
    lastMessage: "I moved to Lisbon last year.",
    time: "3h ago",
    unread: 3,
  },
  {
    id: "156",
    name: "Mila",
    parallelId: "156",
    match: 88,
    lastMessage: "I'm thinking about moving to Japan next year",
    time: "5h ago",
    unread: 0,
  },
  {
    id: "402",
    name: "Robbie",
    parallelId: "402",
    match: 61,
    lastMessage: "You would not believe the path I took.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "203",
    name: "Mila",
    parallelId: "203",
    match: 95,
    lastMessage: "How do you deal with the existential dread?",
    time: "1d ago",
    unread: 1,
  },
  {
    id: "47",
    name: "Mila",
    parallelId: "47",
    match: 79,
    lastMessage: "Just finished reading that book you recommended",
    time: "2d ago",
    unread: 0,
  },
  {
    id: "312",
    name: "Mila",
    parallelId: "312",
    match: 91,
    lastMessage: "What made you choose software over music?",
    time: "2d ago",
    unread: 0,
  },
  {
    id: "521",
    name: "Míla",
    parallelId: "521",
    match: 73,
    lastMessage: "The festival here is incredible this time of year",
    time: "3d ago",
    unread: 2,
  },
  {
    id: "108",
    name: "Mila",
    parallelId: "108",
    match: 89,
    lastMessage: "I can't believe we both have the same tattoo",
    time: "3d ago",
    unread: 0,
  },
  {
    id: "634",
    name: "Sylvie",
    parallelId: "634",
    match: 58,
    lastMessage: "It's strange how different our lives turned out",
    time: "4d ago",
    unread: 0,
  },
  {
    id: "279",
    name: "Mila",
    parallelId: "279",
    match: 84,
    lastMessage: "Did you stay in touch with Alex?",
    time: "5d ago",
    unread: 0,
  },
  {
    id: "445",
    name: "Mila",
    parallelId: "445",
    match: 77,
    lastMessage: "The therapy really helped me",
    time: "5d ago",
    unread: 0,
  },
  {
    id: "756",
    name: "Meela",
    parallelId: "756",
    match: 66,
    lastMessage: "I wish I had made different choices back then",
    time: "6d ago",
    unread: 0,
  },
  {
    id: "189",
    name: "Mila",
    parallelId: "189",
    match: 93,
    lastMessage: "Your artwork is beautiful",
    time: "1w ago",
    unread: 0,
  },
  {
    id: "823",
    name: "Robbie",
    parallelId: "823",
    match: 54,
    lastMessage: "Yeah, transitioning was the best decision I ever made",
    time: "1w ago",
    unread: 5,
  },
  {
    id: "366",
    name: "Mila",
    parallelId: "366",
    match: 81,
    lastMessage: "Coffee next time you're in Berlin?",
    time: "1w ago",
    unread: 0,
  },
  {
    id: "672",
    name: "Mila",
    parallelId: "672",
    match: 71,
    lastMessage: "I'm getting married in June!",
    time: "2w ago",
    unread: 0,
  },
  {
    id: "901",
    name: "Míla",
    parallelId: "901",
    match: 69,
    lastMessage: "The mountains here remind me of home",
    time: "2w ago",
    unread: 0,
  },
  {
    id: "234",
    name: "Mila",
    parallelId: "234",
    match: 87,
    lastMessage: "I finally quit that toxic job",
    time: "2w ago",
    unread: 0,
  },
  {
    id: "558",
    name: "Sylvie",
    parallelId: "558",
    match: 62,
    lastMessage: "Still playing guitar every day",
    time: "3w ago",
    unread: 0,
  },
  {
    id: "129",
    name: "Mila",
    parallelId: "129",
    match: 96,
    lastMessage: "This feels like talking to myself but better",
    time: "3w ago",
    unread: 1,
  },
  {
    id: "745",
    name: "Robbie",
    parallelId: "745",
    match: 50,
    lastMessage: "Life took me in a completely different direction",
    time: "3w ago",
    unread: 0,
  },
];

// Returns whether a given parallel ID has an active (non-declined) exchange state
function useExchangeRing(parallelId: string): boolean {
  const [, tick] = useState(0);

  useEffect(() => {
    const unsub = subscribeToExchangeState(() => tick(n => n + 1));
    return unsub;
  }, []);

  // #84 always has a pending request sent
  if (parallelId === "84") return true;
  // #18 has exchange available (offer exists)
  if (parallelId === "18") return true;
  // #47 has an incoming request from them
  if (parallelId === "47") return true;
  // #156 depends on shared state
  if (parallelId === "156") {
    const state = getExchangeState("156");
    return state === "incoming" || state === "accepted";
  }
  return false;
}

function ConvRow({ conv }: { conv: typeof conversations[number] }) {
  const hasRing = useExchangeRing(conv.parallelId);
  return (
    <Link
      to={`/chat/${conv.id}`}
      className="flex items-start gap-3 px-4 py-3 hover:bg-t-surface-subtle active:bg-t-surface-subtle"
    >
      <div className="relative w-12 h-12 flex-shrink-0 mt-1">
        {hasRing && (
          <span className="absolute inset-0 rounded-full ring-2 ring-t-link z-10 pointer-events-none" />
        )}
        <div className="w-full h-full rounded-full bg-t-thumbnail-bg flex items-center justify-center">
          <User className="w-6 h-6 text-t-text-tertiary" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <div><span className="text-t-text-primary">{conv.name}</span><span className="text-t-text-muted text-sm ml-1">— Twin #{conv.parallelId}</span></div>
          <span className="text-xs text-t-text-muted flex-shrink-0">{conv.time}</span>
        </div>
        <div className="text-sm text-t-text-tertiary mb-1">{conv.match}% match</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-t-text-muted truncate flex-1">{conv.lastMessage}</div>
          {conv.unread > 0 && (
            <div className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-t-unread-bg text-t-unread-text text-xs flex items-center justify-center">
              {conv.unread}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function Parallels() {
  return (
    <div className="divide-y divide-t-border-subtle">
      {conversations.map((conv) => (
        <ConvRow key={conv.id} conv={conv} />
      ))}
    </div>
  );
}