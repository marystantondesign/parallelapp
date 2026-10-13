import { useParams, Link } from "react-router";
import { ChevronLeft, Send, Mic, Plus, MoreVertical, User, Video, ArrowUp, Lock, ChevronUp, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { getExchangeState, setExchangeState, subscribeToExchangeState } from "../lib/exchangeState";

const mockMessages = [
  { id: 1, text: "Hey, nice to meet you.", sent: false, time: "Mar 1, 9:15 AM", receipt: "Read" },
  { id: 2, text: "Hi! Yeah, this is strange but kind of amazing.", sent: true, time: "9:17 AM", receipt: "Read" },
  { id: 3, text: "Right? I still can't believe this is real.", sent: false, time: "9:18 AM", receipt: "Read" },
  { id: 4, text: "Where are you living these days?", sent: false, time: "9:20 AM", receipt: "Read" },
  { id: 5, text: "Barcelona. You?", sent: true, time: "9:21 AM", receipt: "Read" },
  { id: 6, text: "Still in New York. I almost moved there once.", sent: false, time: "9:23 AM", receipt: "Read" },
  { id: 7, text: "Really? What stopped you?", sent: true, time: "9:25 AM", receipt: "Read" },
  { id: 8, text: "Got offered a senior role here. The money was too good to pass up.", sent: false, time: "9:27 AM", receipt: "Read" },
  { id: 9, text: "I get that. I took the opposite path - less money, more freedom.", sent: true, time: "9:30 AM", receipt: "Read" },
  { id: 10, text: "Do you ever regret it?", sent: false, time: "9:32 AM", receipt: "Read" },
  { id: 11, text: "Sometimes. Especially when I see my bank account 😅", sent: true, time: "9:33 AM", receipt: "Read" },
  { id: 12, text: "But honestly, I'm happier now than I've ever been.", sent: true, time: "9:34 AM", receipt: "Read" },
  { id: 13, text: "That's what matters.", sent: false, time: "9:35 AM", receipt: "Read" },
  { id: 14, text: "Are you still doing design work?", sent: false, time: "9:36 AM", receipt: "Read" },
  { id: 15, text: "Yeah, freelance mostly. It pays the bills.", sent: true, time: "9:38 AM", receipt: "Read" },
  { id: 16, text: "Same here, though I'm thinking about going full-time again.", sent: false, time: "10:15 AM", receipt: "Read" },
  { id: 17, text: "The stability would be nice.", sent: false, time: "10:16 AM", receipt: "Read" },
  { id: 18, text: "Pretty good! Just thinking about some life decisions", sent: true, time: "10:34 AM", receipt: "Seen 2m ago" },
  { id: 19, text: "Did you end up leaving the design job?", sent: false, time: "10:35 AM", receipt: "Delivered" },
  { id: 20, text: "Not yet, but I'm seriously considering it", sent: true, time: "10:36 AM", receipt: "Delivered" },
];

// List of existing conversation IDs from the message center
const existingConversationIds = [
  "84", "18", "156", "402", "203", "47", "312", "521", "108", "634",
  "279", "445", "756", "189", "823", "366", "672", "901", "234", "558",
  "129", "745"
];

const parallelData: Record<string, { name: string; match: number }> = {
  "84": { name: "Mila", match: 92 },
  "18": { name: "Mila", match: 86 },
  "156": { name: "Mila", match: 88 },
  "402": { name: "Robbie", match: 61 },
  "47": { name: "Mila", match: 79 },
  "11": { name: "Mila", match: 97 },
  "266": { name: "Míla", match: 82 },
  "501": { name: "Mila", match: 74 },
  "612": { name: "Mila", match: 69 },
  "887": { name: "Sylvie", match: 58 },
  "944": { name: "Robbie", match: 53 },
  "723": { name: "Mila", match: 76 },
  "334": { name: "Meela", match: 81 },
  "167": { name: "Mila", match: 90 },
  "892": { name: "Mila", match: 65 },
  "445": { name: "Robbie", match: 59 },
  "678": { name: "Mila", match: 72 },
  "201": { name: "Míla", match: 85 },
  "956": { name: "Sylvie", match: 52 },
  "128": { name: "Mila", match: 94 },
  "789": { name: "Mila", match: 68 },
  "432": { name: "Meela", match: 77 },
  "665": { name: "Mila", match: 70 },
};

export function ParallelChat() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeExpanded, setExchangeExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState<"pending" | "accepted" | null>(null);
  const [incomingStatus, setIncomingStatus] = useState<"pending" | "accepted" | "declined" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const parallel = parallelData[id || "84"] || { name: "Mila", match: 92 };
  const isExistingConversation = existingConversationIds.includes(id || "");
  
  // Initialize messages based on whether it's an existing conversation
  useEffect(() => {
    let initialMessages = [];
    
    if (isExistingConversation) {
      initialMessages = [...mockMessages];
      
      // Parallel #18: Always show as "exchange-available" (fresh state) — pinned at end
      if (id === "18") {
        const exchangeCard = {
          id: Date.now() + 999,
          type: "exchange-available",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        initialMessages.push(exchangeCard);
      }

      // Parallel #84: Always show as "exchange-request" pending state — pinned at end
      if (id === "84") {
        const exchangeCard = {
          id: Date.now() + 999,
          type: "exchange-request",
          status: "pending",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        initialMessages.push(exchangeCard);
        setRequestSent(true);
        setExchangeStatus("pending");
      }
      
      // Parallel #47: Always show incoming exchange request
      if (id === "47") {
        const exchangeCard = {
          id: Date.now() + 999,
          type: "exchange-incoming",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        initialMessages.push(exchangeCard);
      }

      // Parallel #156: Check shared state for exchange state
      if (id === "156") {
        const exchangeState = getExchangeState("156");
        
        if (exchangeState === "accepted") {
          const exchangeCard = {
            id: Date.now() + 999,
            type: "exchange-accepted",
            status: "accepted",
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          };
          initialMessages.push(exchangeCard);
        } else if (exchangeState === "declined") {
          const exchangeCard = {
            id: Date.now() + 999,
            type: "exchange-accepted",
            status: "declined",
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          };
          initialMessages.push(exchangeCard);
        } else {
          // Default: incoming request state
          const exchangeCard = {
            id: Date.now() + 999,
            type: "exchange-incoming",
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          };
          initialMessages.push(exchangeCard);
        }
      }
    }
    
    setChatMessages(initialMessages);
    // Jump to bottom instantly after messages are set — no animation
    setTimeout(() => {
      const c = messagesContainerRef.current;
      if (c) c.scrollTop = c.scrollHeight;
    }, 0);
  }, [id, isExistingConversation]);
  
  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user's message
    const newMessage = {
      id: Date.now(),
      text: message,
      sent: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      receipt: "Delivered",
    };
    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setTimeout(scrollToBottom, 50);

    // Update receipt to "Read" after a short delay
    setTimeout(() => {
      setChatMessages(prev =>
        prev.map(msg => msg.id === newMessage.id ? { ...msg, receipt: "Read " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) } : msg)
      );
    }, 1000);

    // Show typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(scrollToBottom, 50);
    }, 1500);

    // Show reply after typing
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: Date.now() + 1,
        text: "That's really interesting! I've been thinking about similar things lately.",
        sent: false,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        receipt: "Delivered",
      };
      setChatMessages(prev => [...prev, replyMessage]);
      setTimeout(scrollToBottom, 50);
    }, 3500);
  };

  const handleSendRequest = () => {
    // Save exchange request status to localStorage
    const exchangeRequests = JSON.parse(localStorage.getItem("exchangeRequests") || "{}");
    exchangeRequests[id || "84"] = {
      parallelId: id || "84",
      name: parallel.name,
      match: parallel.match,
      timestamp: Date.now(),
    };
    localStorage.setItem("exchangeRequests", JSON.stringify(exchangeRequests));
    
    setRequestSent(true);
    setExchangeStatus("pending");
    setShowModal(false);
    setExchangeExpanded(false);

    // Update the exchange-available card to exchange-request in the timeline
    setChatMessages(prev => 
      prev.map(msg => 
        msg.type === "exchange-available" 
          ? { ...msg, type: "exchange-request", status: "pending" }
          : msg
      )
    );

    // Simulate response after 8 seconds (for demo purposes)
    // In production, this would be based on actual user response
    setTimeout(() => {
      setExchangeStatus("accepted");
      // Update the system message in the timeline
      setChatMessages(prev => 
        prev.map(msg => 
          msg.type === "exchange-request" ? { ...msg, status: "accepted" } : msg
        )
      );
    }, 8000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    // Add voice memo as a message
    const audioMessage = {
      id: Date.now(),
      text: `Voice Memo (${recordingTime}s)`,
      sent: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      receipt: "Delivered",
      isAudio: true,
    };
    setChatMessages([...chatMessages, audioMessage]);
    setIsRecording(false);
    setRecordingTime(0);
    setTimeout(scrollToBottom, 50);

    setTimeout(() => {
      setChatMessages(prev =>
        prev.map(msg => msg.id === audioMessage.id ? { ...msg, receipt: "Read " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) } : msg)
      );
    }, 1000);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(scrollToBottom, 50);
    }, 1500);

    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: Date.now() + 1,
        text: "That's really interesting! I've been thinking about similar things lately.",
        sent: false,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        receipt: "Delivered",
      };
      setChatMessages(prev => [...prev, replyMessage]);
      setTimeout(scrollToBottom, 50);
    }, 3500);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header - iOS Messages style */}
      <div className="app-subheader">
        <Link to="/twins" className="app-subheader-back">
          <ChevronLeft className="w-6 h-6 text-t-link" />
        </Link>

        {/* Center: Avatar and Name (tappable) */}
        <Link to={`/profile/${id}`} className="flex flex-col items-center flex-1 mx-4">
          <div className="w-8 h-8 rounded-full bg-t-avatar-bg flex items-center justify-center mb-1">
            <User className="w-4 h-4 text-t-avatar-text" />
          </div>
          <div className="text-sm text-t-text-primary">{parallel.name} — Twin #{id}</div>
          <div className="text-xs text-t-text-muted">{parallel.match}% match</div>
        </Link>

        {/* Video Call Icon */}
        <button className="p-1 -mr-1 text-t-link active:text-blue-600">
          <Video className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {/* Empty State */}
        {chatMessages.length === 0 && !isTyping && (
          <div className="flex items-center justify-center h-full">
            <p className="text-t-text-placeholder text-sm">Start a conversation with this parallel.</p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id}>
            {/* Regular Chat Message */}
            {!msg.type && (
              <div className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[75%]">
                  <div className={`${msg.sent ? "bg-t-bubble-sent-bg text-t-bubble-sent-text" : "bg-t-bubble-received-bg text-t-bubble-received-text"} rounded-2xl px-4 py-2`}>
                    <div className="text-sm">{msg.text}</div>
                  </div>
                  <div className={`text-xs mt-1 px-2 ${msg.sent ? "text-right text-t-text-muted" : "text-left text-t-text-muted"}`}>
                    {msg.receipt}
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Request System Card */}
            {msg.type === "exchange-request" && (
              <div className="my-6 flex justify-center">
                <div className={`max-w-[85%] rounded-lg px-5 py-4 text-center ${
                  msg.status === "accepted"
                    ? "bg-t-surface-subtle border-2 border-t-border-medium"
                    : msg.status === "declined"
                    ? "bg-t-surface-subtle border border-t-border-subtle opacity-70"
                    : "bg-t-surface-subtle border border-t-border-medium"
                }`}>
                  {msg.status === "pending" && (
                    <>
                      <p className="text-t-text-primary font-semibold mb-2">Parallel Exchange Request Sent</p>
                      <p className="text-sm text-t-text-secondary mb-1">Duration: 15 minutes</p>
                      <p className="text-sm text-t-text-tertiary">
                        Waiting for {parallel.name} — Twin #{id} to respond.
                      </p>
                    </>
                  )}

                  {msg.status === "accepted" && (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-t-text-primary font-semibold">Exchange Accepted</p>
                      </div>
                      <p className="text-sm text-t-text-secondary mb-1">15 minute exchange scheduled.</p>
                      <p className="text-sm text-t-text-tertiary">
                        Preparing synchronization between parallels.
                      </p>
                    </>
                  )}

                  {msg.status === "declined" && (
                    <>
                      <p className="text-t-text-primary font-semibold mb-2">Parallel Exchange Request Declined</p>
                      <p className="text-sm text-t-text-tertiary">
                        You declined {parallel.name} — Twin #{id}'s exchange request.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Exchange Available Card - Expandable */}
            {msg.type === "exchange-available" && (
              <div className="my-4">
                <div
                  onClick={() => setExchangeExpanded(!exchangeExpanded)}
                  className="w-full bg-t-surface-subtle border border-t-border-subtle rounded-lg p-4 active:bg-t-surface-subtle cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-t-text-primary font-bold">Parallel Exchange</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Beta
                    </span>
                    {exchangeExpanded ? (
                      <ChevronUp className="w-4 h-4 text-t-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-t-text-muted" />
                    )}
                  </div>

                  {exchangeExpanded && (
                    <div className="mt-4 space-y-4 text-left" onClick={(e) => e.stopPropagation()}>
                      {/* Description */}
                      <div className="space-y-3">
                        <p className="text-t-text-secondary text-sm leading-relaxed">
                          You and this parallel have built enough resonance to apply for a temporary exchange experience.
                        </p>
                        <p className="text-t-text-secondary text-sm leading-relaxed">
                          A parallel exchange allows two highly compatible versions of yourself to temporarily experience each other's lives.
                        </p>
                        <p className="text-t-text-secondary text-sm leading-relaxed">
                          Initial exchanges are limited to short durations while compatibility is tested.
                        </p>
                      </div>

                      {/* Exchange Levels */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-green-600 font-medium">15 minutes</span>
                          <span className="text-t-text-muted">— available</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Lock className="w-4 h-4 text-t-text-placeholder" />
                          <span className="text-t-text-placeholder">1 hour</span>
                          <span className="text-t-text-placeholder">— locked</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Lock className="w-4 h-4 text-t-text-placeholder" />
                          <span className="text-t-text-placeholder">24 hours</span>
                          <span className="text-t-text-placeholder">— locked</span>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowModal(true);
                        }}
                        className="w-full bg-t-btn-bg text-t-btn-text text-center py-3 rounded-lg active:opacity-80 font-medium"
                      >
                        Apply for Exchange
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Incoming Exchange Request Card */}
            {msg.type === "exchange-incoming" && (
              <div className="my-6 flex justify-center">
                <div className="max-w-[85%] bg-t-surface-subtle border border-t-border-medium rounded-lg px-5 py-4 text-center">
                  <p className="text-t-text-primary font-semibold mb-2">Parallel Exchange Request</p>
                  <p className="text-sm text-t-text-secondary mb-1">
                    {parallel.name} — Twin #{id} has requested a temporary exchange with you.
                  </p>
                  <p className="text-sm text-t-text-secondary mb-4">Duration: 15 minutes</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // Save declined state to shared state for sync with profile
                        setExchangeState("156", "declined");
                        setChatMessages(prev =>
                          prev.map(m =>
                            m.type === "exchange-incoming"
                              ? { ...m, type: "exchange-accepted", status: "declined" }
                              : m
                          )
                        );
                      }}
                      className="flex-1 bg-t-btn-secondary-bg text-t-btn-secondary-text py-2.5 rounded-lg active:bg-t-border-subtle font-medium text-sm"
                    >
                      Decline Exchange
                    </button>
                    <button
                      onClick={() => {
                        // Save accepted state to shared state for sync with profile
                        setExchangeState("156", "accepted");
                        setChatMessages(prev =>
                          prev.map(m =>
                            m.type === "exchange-incoming"
                              ? { ...m, type: "exchange-accepted", status: "accepted" }
                              : m
                          )
                        );
                      }}
                      className="flex-1 bg-t-btn-bg text-t-btn-text py-2.5 rounded-lg active:opacity-80 font-medium text-sm"
                    >
                      Accept Exchange
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Exchange Accepted Card */}
            {msg.type === "exchange-accepted" && (
              <div className="my-6 flex justify-center">
                <div className={`max-w-[85%] rounded-lg px-5 py-4 text-center ${
                  msg.status === "accepted"
                    ? "bg-t-surface-subtle border-2 border-t-border-medium"
                    : "bg-t-surface-subtle border border-t-border-subtle opacity-70"
                }`}>
                  {msg.status === "accepted" && (
                    <>
                      <p className="text-t-text-primary font-semibold mb-2">Exchange Request Accepted</p>
                      <p className="text-sm text-t-text-secondary mb-2">
                        You and {parallel.name} — Twin #{id} have agreed to a 15 minute exchange.
                      </p>
                      <p className="text-sm text-t-text-secondary">
                        To begin the exchange, open {parallel.name} — Twin #{id}'s profile and initiate the exchange when both of you are ready.
                      </p>
                    </>
                  )}

                  {msg.status === "declined" && (
                    <>
                      <p className="text-t-text-primary font-semibold mb-2">Parallel Exchange Request Declined</p>
                      <p className="text-sm text-t-text-tertiary">
                        You declined {parallel.name} — Twin #{id}'s exchange request.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-t-bubble-received-bg rounded-2xl px-4 py-3 flex gap-1">
              <div className="w-2 h-2 bg-t-text-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-t-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-t-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - iOS style */}
      <div className="bg-t-surface border-t border-t-border-subtle sticky bottom-0 mx-[0px] mt-[0px] mb-[6px] px-[10px] py-[8px]">
        {isRecording ? (
          /* Recording Interface */
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 bg-t-input-bg rounded-full px-4 py-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-t-text-secondary">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={handleStopRecording}
              className="p-2 bg-t-btn-bg text-t-btn-text rounded-full active:opacity-80"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Normal Input */
          <div className="flex items-end gap-2">
            <button className="p-2 text-t-text-muted active:text-t-text-primary flex-none mb-0.5">
              <Plus className="w-6 h-6" />
            </button>
            <div className="flex-1 bg-t-input-bg rounded-[20px] flex items-end px-[10px] py-[8px]">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyPress={handleKeyPress}
                placeholder="Text Message"
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm text-t-text-primary placeholder:text-t-text-placeholder resize-none overflow-hidden leading-5"
                style={{ maxHeight: "120px", overflowY: "auto" }}
              />
            </div>
            {message.trim() ? (
              <button
                onClick={handleSendMessage}
                className="p-2 bg-t-btn-bg text-t-btn-text rounded-full active:opacity-80 flex-none mb-0.5"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="p-2 text-t-text-muted active:text-t-text-primary flex-none mb-0.5"
              >
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-t-surface-elevated rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg text-t-text-primary font-medium mb-4">Parallel Exchange Request</h3>

              {/* Description */}
              <p className="text-t-text-secondary leading-relaxed mb-6">
                You are requesting a temporary exchange with this parallel. Initial exchanges last 15 minutes. Both parallels must approve the request before an exchange can occur.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-t-btn-secondary-bg text-t-btn-secondary-text py-3 rounded-lg active:bg-t-border-subtle font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  className="flex-1 bg-t-btn-bg text-t-btn-text py-3 rounded-lg active:opacity-80 font-medium"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}