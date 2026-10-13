import { useParams, Link, useSearchParams, useNavigate } from "react-router";
import { ChevronLeft, User, MapPin, Briefcase, Lock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getExchangeState, setExchangeState, subscribeToExchangeState } from "../lib/exchangeState";

// Centralized profile data matching Discover screen data
const profileData: Record<string, any> = {
  "11": {
    name: "Mila",
    parallelId: "11",
    match: 97,
    universeDistance: 2,
    location: "Copenhagen",
    occupation: "UX Director",
    summary: "Leading a design team at a sustainable tech company. Finally found a role that aligns my values with my career. Living in Copenhagen has been transformative - the work-life balance here is everything I needed.",
  },
  "266": {
    name: "Míla",
    parallelId: "266",
    match: 82,
    universeDistance: 45,
    location: "Buenos Aires",
    occupation: "Photographer",
    summary: "Left product design to travel and document disappearing architecture. Currently based in Buenos Aires working on a photo book about brutalist buildings in South America. The nomadic life suits me better than I expected.",
  },
  "501": {
    name: "Mila",
    parallelId: "501",
    match: 74,
    universeDistance: 112,
    location: "Portland",
    occupation: "Teacher",
    summary: "Found my calling in education after years in corporate design. Teaching middle school art has been the most fulfilling work I've ever done. The kids inspire me every day.",
  },
  "612": {
    name: "Mila",
    parallelId: "612",
    match: 69,
    universeDistance: 89,
    location: "Lyon",
    occupation: "Chef",
    summary: "Pivoted from design to culinary arts. Running a small bistro in Lyon where I combine visual aesthetics with food. Every dish is an opportunity to create something beautiful.",
  },
  "887": {
    name: "Sylvie",
    parallelId: "887",
    match: 58,
    universeDistance: 203,
    location: "New Orleans",
    occupation: "Musician",
    summary: "Chose music over everything else. Playing jazz guitar in the French Quarter feels like living in a different timeline. No regrets about the unconventional path.",
  },
  "944": {
    name: "Robbie",
    parallelId: "944",
    match: 53,
    universeDistance: 287,
    location: "Seattle",
    occupation: "Engineer",
    summary: "Transitioned early in my career and went deep into software engineering. Working on climate tech now. Life took unexpected turns but I'm exactly where I need to be.",
  },
  "723": {
    name: "Mila",
    parallelId: "723",
    match: 76,
    universeDistance: 67,
    location: "Dublin",
    occupation: "Writer",
    summary: "Left design to pursue writing full-time. Working on my second novel while freelancing for various publications. The creative freedom is worth the financial uncertainty.",
  },
  "334": {
    name: "Meela",
    parallelId: "334",
    match: 81,
    universeDistance: 52,
    location: "Amsterdam",
    occupation: "Designer",
    summary: "Stayed in design but shifted focus to brand identity and visual systems. Based in Amsterdam working with sustainable fashion brands. Design can change the world.",
  },
  "167": {
    name: "Mila",
    parallelId: "167",
    match: 90,
    universeDistance: 12,
    location: "Tokyo",
    occupation: "Product Manager",
    summary: "Working at a startup in Shibuya, combining my love for design with Japanese aesthetics. The work-life balance here is challenging but the creative environment is inspiring.",
  },
  "892": {
    name: "Mila",
    parallelId: "892",
    match: 65,
    universeDistance: 156,
    location: "Santa Fe",
    occupation: "Therapist",
    summary: "Went back to school for psychology. Now practicing as a therapist specializing in creative burnout. Helping others avoid the mistakes I made.",
  },
  "445": {
    name: "Robbie",
    parallelId: "445",
    match: 59,
    universeDistance: 198,
    location: "Berlin",
    occupation: "Artist",
    summary: "Sculpture and installation art. Transitioned and found my voice through physical creation. Berlin's art scene has been incredibly welcoming.",
  },
  "678": {
    name: "Mila",
    parallelId: "678",
    match: 72,
    universeDistance: 78,
    location: "Singapore",
    occupation: "Consultant",
    summary: "Leveraging design thinking in management consulting. Travel constantly but the global perspective is invaluable. Considering settling down soon.",
  },
  "201": {
    name: "Míla",
    parallelId: "201",
    match: 85,
    universeDistance: 34,
    location: "Lisbon",
    occupation: "Architect",
    summary: "Design transformed into architecture. Working on sustainable housing projects in Lisbon. Finally combining aesthetics with social impact.",
  },
  "956": {
    name: "Sylvie",
    parallelId: "956",
    match: 52,
    universeDistance: 312,
    location: "Cambridge",
    occupation: "Scientist",
    summary: "Chose science over art. Researching neuroscience at MIT. The path diverged completely but the curiosity remains the same.",
  },
  "128": {
    name: "Mila",
    parallelId: "128",
    match: 94,
    universeDistance: 7,
    location: "Los Angeles",
    occupation: "Creative Director",
    summary: "Leading creative at an entertainment studio. The work is demanding but creatively fulfilling. LA has been surprisingly good for my mental health.",
  },
  "789": {
    name: "Mila",
    parallelId: "789",
    match: 68,
    universeDistance: 124,
    location: "Boston",
    occupation: "Lawyer",
    summary: "Took a completely different path into law. Specializing in intellectual property for creative industries. Still connected to design, just differently.",
  },
  "432": {
    name: "Meela",
    parallelId: "432",
    match: 77,
    universeDistance: 61,
    location: "Toronto",
    occupation: "Marketing Lead",
    summary: "Pivoted from design to marketing strategy. Leading campaigns for tech companies. The storytelling aspect scratches the same creative itch.",
  },
  "665": {
    name: "Mila",
    parallelId: "665",
    match: 70,
    universeDistance: 98,
    location: "Austin",
    occupation: "Entrepreneur",
    summary: "Started my own design tool company. The startup life is chaotic but I'm building something meaningful. Austin's tech scene has been supportive.",
  },
  "84": {
    name: "Mila",
    parallelId: "84",
    match: 92,
    universeDistance: 8,
    location: "Barcelona",
    occupation: "Painter",
    summary: "After leaving my corporate design job in 2023, I moved to Barcelona to pursue painting full-time. I spend my mornings at local cafes sketching, afternoons in my studio, and evenings exploring the Gothic Quarter. Life feels more aligned now, though sometimes I wonder about the stability I left behind.",
  },
  "156": {
    name: "Mila",
    parallelId: "156",
    match: 88,
    universeDistance: 15,
    location: "Tokyo",
    occupation: "Product Designer",
    summary: "Working at a startup in Shibuya, combining my love for design with Japanese aesthetics. The work-life balance here is challenging but the creative environment is inspiring. Planning to take a sabbatical next year to travel through Southeast Asia.",
  },
  "47": {
    name: "Mila",
    parallelId: "47",
    match: 79,
    universeDistance: 31,
    location: "Porto",
    occupation: "Illustrator",
    summary: "Left software design to pursue illustration full-time. Working out of a small studio in Porto, mostly book covers and editorial work. Finished reading a lot lately — it feeds the work.",
  },
  "18": {
    name: "Mila",
    parallelId: "18",
    match: 86,
    universeDistance: 18,
    location: "Melbourne",
    occupation: "UX Designer",
    summary: "Working remotely for a tech company while exploring Australia. The time zone is tough but the lifestyle is incredible. Trying to figure out if I should stay here permanently or return to the States.",
  },
};

export function ParallelProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = searchParams.get("new") === "true";
  const profile = profileData[id || "84"] || profileData["84"];

  const [exchangeExpanded, setExchangeExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [, forceUpdate] = useState({});
  const [reflections, setReflections] = useState<any[]>([]);

  // Load reflections for this parallel
  useEffect(() => {
    const allReflections = JSON.parse(localStorage.getItem('exchangeReflections') || '{}');
    const parallelReflections = allReflections[id || ''] || [];
    // Sort by date, most recent first
    setReflections(parallelReflections.sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [id]);

  // Hardcoded exchange states for specific parallels
  // Parallel #18: Always "available" (fresh state, no request sent)
  // Parallel #84: Always "pending" (request already sent)
  // Parallel #156: Check shared state
  const getExchangeStatus = () => {
    if (id === "18") return null; // Available, no request sent
    if (id === "84") return "pending"; // Request sent
    if (id === "47") return "incoming"; // They sent a request to us
    if (id === "156") {
      const exchangeState = getExchangeState("156");
      if (exchangeState === "accepted") return "accepted";
      if (exchangeState === "declined") return "declined";
      return "incoming";
    }
    return null;
  };

  const exchangeStatus = getExchangeStatus();
  const exchangeAvailable = id === "18" || id === "84" || id === "47" || id === "156";

  // Subscribe to state changes
  useEffect(() => {
    if (id === "156") {
      const unsubscribe = subscribeToExchangeState(() => {
        forceUpdate({});
      });
      return unsubscribe;
    }
  }, [id]);

  const handleSendRequest = () => {
    // For demo purposes, this only works on #18
    // #84 already has request sent
    setShowModal(false);
    setExchangeExpanded(false);
  };

  const handleAcceptExchange = () => {
    setExchangeState(id || "156", "accepted");
    forceUpdate({});
  };

  const handleDeclineExchange = () => {
    setExchangeState(id || "156", "declined");
    forceUpdate({});
  };

  const handleInitiateExchange = () => {
    // Show the in-app modal
    setShowInitiateModal(true);
  };

  const handleStartExchange = () => {
    // Navigate to exchange synchronization screen
    setShowInitiateModal(false);
    navigate(`/exchange-sync/${id}`);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="app-subheader justify-between">
        <Link to={isNew ? "/discover" : `/chat/${id}`} className="app-subheader-back">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-lg text-t-text-primary">Profile</h2>
        <div className="w-8" />
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-t-thumbnail-bg flex items-center justify-center">
            <User className="w-12 h-12 text-t-text-tertiary" />
          </div>
        </div>

        {/* Name and ID */}
        <div className="text-center mb-2">
          <h3 className="text-xl text-t-text-primary">{profile.name} — Twin #{profile.parallelId}</h3>
        </div>

        {/* Match Percentage */}
        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {profile.match}% match
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-t-text-muted flex-shrink-0 mt-0.5" />
            <div>
              <div className="app-caption">Location</div>
              <div className="text-t-text-primary">{profile.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-t-text-muted flex-shrink-0 mt-0.5" />
            <div>
              <div className="app-caption">Occupation</div>
              <div className="text-t-text-primary">{profile.occupation}</div>
            </div>
          </div>
        </div>

        {/* Life Summary */}
        <div className="mb-6">
          <h4 className="app-caption mb-2">Life Summary</h4>
          <p className="app-body">{profile.summary}</p>
        </div>

        {/* Parallel Exchange Section */}
        {exchangeAvailable && (
          <div className="mb-6">
            <h4 className="app-caption mb-2">Parallel Exchange</h4>

            {/* Exchange Status Card */}
            {exchangeStatus === "pending" && (
              <div className="bg-purple-950 border border-purple-700/50 rounded-xl px-5 py-4 mb-4">
                <p className="text-white font-semibold mb-2">Exchange Request Sent</p>
                <p className="text-sm text-purple-200/60 mb-1">Duration: 15 minutes</p>
                <p className="text-sm text-purple-200/60">
                  Waiting for {profile.name} — Twin #{id} to respond.
                </p>
              </div>
            )}

            {exchangeStatus === "accepted" && (
              <div className="bg-purple-950 border-2 border-purple-600/50 rounded-xl px-5 py-4 mb-4">
                <p className="text-white font-semibold mb-4">Exchange Request Accepted</p>
                <p className="text-sm text-purple-200/60 mb-2">
                  Best practice is to coordinate with this parallel before beginning the exchange.
                </p>
                <p className="text-sm text-purple-200/60 mb-4">
                  When the exchange begins, {profile.name} — Twin #{id} will have one minute to activate the exchange on their side.
                </p>
                <button
                  onClick={handleInitiateExchange}
                  className="w-full py-3.5 bg-white/15 border border-white/30 text-white rounded-xl text-sm font-medium active:bg-white/25"
                >
                  Initiate Exchange Now
                </button>
              </div>
            )}

            {exchangeStatus === "declined" && (
              <div className="bg-purple-950 border border-purple-700/50 rounded-xl px-5 py-4 mb-4">
                <p className="text-white font-semibold mb-2">Exchange Request Declined on March 10</p>
                <p className="text-sm text-purple-200/60 mb-4">
                  {profile.name} — Twin #{id} will not send another exchange request automatically. If you change your mind in the future, you can request an exchange from this profile.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3.5 bg-white/15 border border-white/30 text-white rounded-xl text-sm font-medium active:bg-white/25"
                >
                  Request Exchange
                </button>
              </div>
            )}

            {exchangeStatus === "incoming" && (
              <div className="bg-purple-950 border border-purple-600/60 rounded-xl px-5 py-4 mb-4">
                <p className="text-white font-semibold mb-2">Incoming Exchange Request</p>
                <p className="text-sm text-purple-200/60 mb-4">Duration: 15 minutes</p>

                <div className="flex gap-2">
                  <button
                    onClick={handleDeclineExchange}
                    className="flex-1 py-3.5 bg-white/8 text-white border border-white/15 rounded-xl text-sm font-medium active:bg-white/15"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptExchange}
                    className="flex-1 py-3.5 bg-white/18 text-white border border-white/35 rounded-xl text-sm font-medium active:bg-white/25"
                  >
                    Accept Exchange
                  </button>
                </div>
              </div>
            )}

            {!exchangeStatus && (
              <div
                onClick={() => setExchangeExpanded(!exchangeExpanded)}
                className="bg-purple-950 border border-purple-700/50 rounded-xl p-4 cursor-pointer mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Parallel Exchange</span>
                    <span className="text-xs bg-purple-800/60 text-purple-200/80 px-2 py-0.5 rounded-full border border-purple-600/30">
                      Beta
                    </span>
                  </div>
                  {exchangeExpanded ? (
                    <ChevronUp className="w-4 h-4 text-purple-300/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-300/50" />
                  )}
                </div>

                {exchangeExpanded && (
                  <div className="mt-4 space-y-4 text-left" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                      <p className="text-sm text-purple-200/60 leading-relaxed">
                        You and this parallel have built enough resonance to apply for a temporary exchange experience.
                      </p>
                      <p className="text-sm text-purple-200/60 leading-relaxed">
                        A parallel exchange allows two highly compatible versions of yourself to temporarily experience each other's lives.
                      </p>
                      <p className="text-sm text-purple-200/60 leading-relaxed">
                        Initial exchanges are limited to short durations while compatibility is tested.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-400 font-medium">15 minutes</span>
                        <span className="text-purple-300/50">— available</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Lock className="w-4 h-4 text-purple-500/50" />
                        <span className="text-purple-400/40">1 hour</span>
                        <span className="text-purple-400/40">— locked</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Lock className="w-4 h-4 text-purple-500/50" />
                        <span className="text-purple-400/40">24 hours</span>
                        <span className="text-purple-400/40">— locked</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                      }}
                      className="w-full py-3.5 bg-white/15 border border-white/30 text-white rounded-xl text-sm font-medium active:bg-white/25"
                    >
                      Apply for Exchange
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Exchange Reflections Section */}
        <div className="mb-6">
          <h4 className="app-caption mb-2">Exchange Reflections</h4>

          {reflections.length === 0 ? (
            <div className="bg-t-surface-subtle border border-t-border-subtle rounded-lg px-5 py-6 text-center">
              <p className="text-t-text-tertiary text-sm mb-2">No exchange reflections yet.</p>
              <p className="app-caption leading-relaxed">
                Your experiences with this parallel will appear here after completing a Parallel Exchange.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reflections.map((reflection) => {
                const date = new Date(reflection.date);
                const month = date.toLocaleDateString('en-US', { month: 'long' });
                const day = date.getDate();
                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                const preview = reflection.notes ? reflection.notes.substring(0, 60) + (reflection.notes.length > 60 ? '...' : '') : '';

                return (
                  <button
                    key={reflection.id}
                    onClick={() => navigate(`/profile/${id}/reflection/${reflection.id}`)}
                    className="w-full bg-t-surface-elevated border border-t-border-subtle rounded-lg px-4 py-3 text-left hover:bg-t-surface-subtle active:bg-t-surface-subtle transition-colors"
                  >
                    <p className="text-t-text-primary font-medium text-sm mb-1">Exchange Reflection</p>
                    <p className="text-t-text-tertiary text-xs mb-1">{month} {day} — {time}</p>
                    <p className="app-caption mb-2">{reflection.duration} minute exchange</p>

                    {reflection.hasAudio && (
                      <p className="text-t-text-secondary text-xs mb-1">Audio Reflection</p>
                    )}

                    {preview && (
                      <p className="text-t-text-tertiary text-xs italic">"{preview}"</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Sticky Start Chat Button */}
      {isNew && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-4 pointer-events-none">
          <Link
            to={`/chat/${id}`}
            className="app-btn-primary block text-center pointer-events-auto shadow-lg"
          >
            Start Chat
          </Link>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-purple-950 border border-purple-700/50 rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <h3 className="text-lg text-white font-semibold mb-4">Parallel Exchange Request</h3>
              <p className="text-sm text-purple-200/60 leading-relaxed mb-6">
                You are requesting a temporary exchange with this parallel. Initial exchanges last 15 minutes. Both parallels must approve the request before an exchange can occur.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-white/8 text-white border border-white/15 rounded-xl text-sm font-medium active:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  className="flex-1 py-3.5 bg-white/18 text-white border border-white/35 rounded-xl text-sm font-medium active:bg-white/25"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Initiate Exchange Modal */}
      {showInitiateModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setShowInitiateModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-purple-950 border border-purple-700/50 rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <h3 className="text-lg text-white font-semibold mb-4">Initiate Exchange Now?</h3>
              <div className="text-sm text-purple-200/60 leading-relaxed mb-6 space-y-3">
                <p>
                  If you begin the exchange, {profile.name} — Twin #{id} will have one minute to activate the exchange on their side.
                </p>
                <p>
                  If they accept, you will temporarily swap places for 15 minutes. Make sure you are seated or lying down safely before proceeding.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInitiateModal(false)}
                  className="flex-1 py-3.5 bg-white/8 text-white border border-white/15 rounded-xl text-sm font-medium active:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartExchange}
                  className="flex-1 py-3.5 bg-white/18 text-white border border-white/35 rounded-xl text-sm font-medium active:bg-white/25"
                >
                  Start Exchange
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
