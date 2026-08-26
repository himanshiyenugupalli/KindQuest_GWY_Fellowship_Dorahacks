import type { Cause } from "@/types";
import type {
  ActivityPreference,
  DiscoveredSkill,
  VolunteeringMode,
} from "@/lib/adventure-progress";

export type Trait =
  | "Hands-on activities"
  | "Helping people learn"
  | "Caring for animals"
  | "Working outdoors"
  | "Organising people"
  | "Remote & digital work"
  | "Creative making"
  | "Being around others";

export interface Destination {
  id: string;
  name: string;
  emoji: string;
  /** Map position in percent of the board. */
  x: number;
  y: number;
  /** Requires this many completed destinations before it opens. */
  unlockAfter: number;
  bonus?: boolean;
  tint: "primary" | "coral" | "sky" | "lilac" | "sunbeam";
  intro: string;
  prompt: string;
  helper: string;
  /** The draggable pieces the player places. */
  pieceEmoji: string;
  pieceLabel: string;
  /** Empty slot look, and what it becomes once filled. */
  slotEmoji: string;
  filledEmoji: string;
  slots: number;
  scene: string[];
  observation: string;
  interactionId: string;
  interactionLabel: string;
  causes: Cause[];
  traits: Trait[];
  activityPreferences: ActivityPreference[];
  skills: DiscoveredSkill[];
  volunteeringMode?: VolunteeringMode[];
  reward: number;
}

export const destinations: Destination[] = [
  {
    id: "forest",
    name: "Green Forest",
    emoji: "🌳",
    x: 18,
    y: 24,
    unlockAfter: 0,
    tint: "primary",
    intro: "The forest could use a little help.",
    prompt: "Plant the seedlings in the empty patches",
    helper: "Drag a seedling onto a patch — or tap one, then tap a patch.",
    pieceEmoji: "🌱",
    pieceLabel: "Seedling",
    slotEmoji: "🕳️",
    filledEmoji: "🌳",
    slots: 3,
    scene: ["🌲", "🌿", "🦋", "🌲"],
    observation: "Looks like you enjoy making a difference outdoors.",
    interactionId: "planted_seedlings",
    interactionLabel: "Planted seedlings",
    causes: ["Environment"],
    traits: ["Hands-on activities", "Working outdoors"],
    activityPreferences: ["Hands-on", "Outdoor"],
    skills: ["Teamwork"],
    volunteeringMode: ["in-person"],
    reward: 10,
  },
  {
    id: "learning",
    name: "Learning Lane",
    emoji: "📚",
    x: 44,
    y: 12,
    unlockAfter: 0,
    tint: "sky",
    intro: "A student is looking for something to read.",
    prompt: "Fill the bookshelf",
    helper: "Drag the books onto the empty shelf spaces.",
    pieceEmoji: "📗",
    pieceLabel: "Book",
    slotEmoji: "▫️",
    filledEmoji: "📗",
    slots: 3,
    scene: ["🧑‍🎓", "🪑", "🖍️", "🧒"],
    observation: "You seem to enjoy helping people learn.",
    interactionId: "organized_reading_shelf",
    interactionLabel: "Organized books for learners",
    causes: ["Education", "Children"],
    traits: ["Helping people learn", "Being around others"],
    activityPreferences: ["Teaching", "People-focused"],
    skills: ["Teaching", "Communication"],
    reward: 10,
  },
  {
    id: "shelter",
    name: "Animal Shelter",
    emoji: "🐶",
    x: 74,
    y: 26,
    unlockAfter: 0,
    tint: "coral",
    intro: "This pup needs a little help.",
    prompt: "Get the pups ready for a walk",
    helper: "Drag a leash to each waiting pup.",
    pieceEmoji: "🦮",
    pieceLabel: "Leash",
    slotEmoji: "🐕",
    filledEmoji: "🐩",
    slots: 3,
    scene: ["🏠", "🥣", "🧶", "🐈"],
    observation: "Looks like animals might be your thing.",
    interactionId: "walked_dogs",
    interactionLabel: "Prepared pups for a walk",
    causes: ["Animals"],
    traits: ["Caring for animals", "Hands-on activities"],
    activityPreferences: ["Hands-on", "People-focused"],
    skills: ["Care", "Teamwork"],
    volunteeringMode: ["in-person"],
    reward: 10,
  },
  {
    id: "community",
    name: "Community Square",
    emoji: "🤝",
    x: 28,
    y: 60,
    unlockAfter: 1,
    tint: "sunbeam",
    intro: "The community is getting together.",
    prompt: "Set up the event",
    helper: "Place the tables and boxes where they belong.",
    pieceEmoji: "📦",
    pieceLabel: "Supplies",
    slotEmoji: "⬜",
    filledEmoji: "🍎",
    slots: 4,
    scene: ["🪑", "🎨", "🎪", "🧑‍🤝‍🧑"],
    observation: "You clearly like bringing people together.",
    interactionId: "organized_food_table",
    interactionLabel: "Set up community supplies",
    causes: ["Community"],
    traits: ["Organising people", "Being around others"],
    activityPreferences: ["Community-based", "People-focused"],
    skills: ["Organization", "Planning", "Teamwork"],
    volunteeringMode: ["in-person"],
    reward: 10,
  },
  {
    id: "digital",
    name: "Digital Hub",
    emoji: "💻",
    x: 62,
    y: 62,
    unlockAfter: 1,
    tint: "lilac",
    intro: "Someone needs a little help online.",
    prompt: "Tidy up the shared drive",
    helper: "Drag each file into an empty folder.",
    pieceEmoji: "📄",
    pieceLabel: "File",
    slotEmoji: "📂",
    filledEmoji: "🗂️",
    slots: 3,
    scene: ["💻", "🖱️", "☕", "🔌"],
    observation: "You're comfortable helping from anywhere.",
    interactionId: "organized_digital_files",
    interactionLabel: "Sorted digital files",
    causes: ["Technology"],
    traits: ["Remote & digital work"],
    activityPreferences: ["Remote", "Problem-solving", "Quiet independent"],
    skills: ["Technology", "Problem Solving"],
    volunteeringMode: ["remote"],
    reward: 10,
  },
  {
    id: "creative",
    name: "Creative Corner",
    emoji: "🎨",
    x: 86,
    y: 52,
    unlockAfter: 2,
    tint: "coral",
    intro: "A blank wall is waiting for some colour.",
    prompt: "Decorate the community wall",
    helper: "Place posters and art on the empty wall panels.",
    pieceEmoji: "🖼️",
    pieceLabel: "Artwork",
    slotEmoji: "⬛",
    filledEmoji: "🌻",
    slots: 4,
    scene: ["🪜", "🖌️", "🎭", "🪴"],
    observation: "Making things by hand seems to light you up.",
    interactionId: "decorated_community_wall",
    interactionLabel: "Decorated a community wall",
    causes: ["Arts & Culture"],
    traits: ["Creative making", "Hands-on activities"],
    activityPreferences: ["Creative", "Hands-on"],
    skills: ["Creativity", "Design", "Teamwork"],
    reward: 10,
  },
  {
    id: "garden",
    name: "Community Garden",
    emoji: "✨",
    x: 48,
    y: 86,
    unlockAfter: 3,
    bonus: true,
    tint: "primary",
    intro: "A hidden garden, discovered by explorers only.",
    prompt: "Bring the garden back to life",
    helper: "Drag flowers into the beds.",
    pieceEmoji: "🌻",
    pieceLabel: "Flower",
    slotEmoji: "🟫",
    filledEmoji: "🌷",
    slots: 4,
    scene: ["🚿", "🐝", "🧺", "🌳"],
    observation: "You go the extra step for shared spaces.",
    interactionId: "restored_community_garden",
    interactionLabel: "Restored a community garden",
    causes: ["Community", "Environment"],
    traits: ["Hands-on activities", "Working outdoors", "Being around others"],
    activityPreferences: ["Hands-on", "Outdoor", "Community-based"],
    skills: ["Care", "Teamwork"],
    volunteeringMode: ["in-person"],
    reward: 15,
  },
];

export const deeperDestinations: Destination[] = [
  {
    id: "local-event",
    name: "Local Event Path",
    emoji: "🏘️",
    x: 20,
    y: 24,
    unlockAfter: 0,
    tint: "sunbeam",
    intro: "A neighbourhood team needs help this weekend.",
    prompt: "Set the welcome kits at the event tables",
    helper: "Drag each kit into a highlighted event spot.",
    pieceEmoji: "🎟️",
    pieceLabel: "Welcome kit",
    slotEmoji: "🪑",
    filledEmoji: "🏘️",
    slots: 3,
    scene: ["🎪", "🧑‍🤝‍🧑", "📣", "🪑"],
    observation: "You seem open to showing up in person with a team.",
    interactionId: "supported_local_event",
    interactionLabel: "Helped at a local event",
    causes: ["Community"],
    traits: ["Being around others", "Organising people"],
    activityPreferences: ["Community-based", "People-focused", "Hands-on"],
    skills: ["Organization", "Teamwork", "Communication"],
    volunteeringMode: ["in-person"],
    reward: 10,
  },
  {
    id: "remote-desk",
    name: "Remote Help Desk",
    emoji: "💻",
    x: 48,
    y: 20,
    unlockAfter: 0,
    tint: "lilac",
    intro: "A nonprofit has a few online tasks that need careful attention.",
    prompt: "Sort the remote task cards into the shared workspace",
    helper: "Drag each task card onto an open workspace slot.",
    pieceEmoji: "🧾",
    pieceLabel: "Task card",
    slotEmoji: "💻",
    filledEmoji: "✅",
    slots: 3,
    scene: ["💻", "☕", "🗂️", "🌐"],
    observation: "Remote, focused volunteering could fit your rhythm.",
    interactionId: "completed_remote_tasks",
    interactionLabel: "Completed remote support tasks",
    causes: ["Technology"],
    traits: ["Remote & digital work"],
    activityPreferences: ["Remote", "Quiet independent", "Problem-solving"],
    skills: ["Technology", "Problem Solving", "Writing"],
    volunteeringMode: ["remote"],
    reward: 10,
  },
  {
    id: "lesson-lab",
    name: "Lesson Lab",
    emoji: "📚",
    x: 76,
    y: 28,
    unlockAfter: 0,
    tint: "sky",
    intro: "A mentor is preparing a short lesson for first-time learners.",
    prompt: "Place lesson cards in the learning board",
    helper: "Drag each lesson card to an open board space.",
    pieceEmoji: "📝",
    pieceLabel: "Lesson card",
    slotEmoji: "📋",
    filledEmoji: "📚",
    slots: 3,
    scene: ["🧑‍🏫", "📘", "🖍️", "💬"],
    observation: "Teaching and communication strengths are showing up.",
    interactionId: "organized_lesson",
    interactionLabel: "Organized a lesson",
    causes: ["Education", "Children"],
    traits: ["Helping people learn", "Being around others"],
    activityPreferences: ["Teaching", "People-focused"],
    skills: ["Teaching", "Communication", "Planning"],
    reward: 10,
  },
  {
    id: "campaign-studio",
    name: "Campaign Studio",
    emoji: "🎨",
    x: 30,
    y: 68,
    unlockAfter: 0,
    tint: "coral",
    intro: "A campaign poster needs a final creative touch.",
    prompt: "Arrange the campaign pieces on the poster",
    helper: "Drag each design piece into a poster panel.",
    pieceEmoji: "✍️",
    pieceLabel: "Campaign piece",
    slotEmoji: "🖼️",
    filledEmoji: "🎨",
    slots: 4,
    scene: ["🖌️", "📣", "🌻", "🧩"],
    observation: "Creative communication looks like one of your strengths.",
    interactionId: "designed_campaign_poster",
    interactionLabel: "Designed a campaign poster",
    causes: ["Arts & Culture", "Community"],
    traits: ["Creative making"],
    activityPreferences: ["Creative", "Problem-solving"],
    skills: ["Creativity", "Design", "Writing", "Communication"],
    reward: 10,
  },
  {
    id: "supply-sort",
    name: "Supply Sort",
    emoji: "📦",
    x: 68,
    y: 70,
    unlockAfter: 0,
    tint: "primary",
    intro: "A relief team needs supplies organized before volunteers arrive.",
    prompt: "Sort the supply crates into the right spaces",
    helper: "Drag each crate into an empty staging area.",
    pieceEmoji: "📦",
    pieceLabel: "Crate",
    slotEmoji: "⬜",
    filledEmoji: "🧺",
    slots: 4,
    scene: ["🚚", "🧺", "📋", "🤝"],
    observation: "Planning and organization are becoming part of your profile.",
    interactionId: "organized_supplies",
    interactionLabel: "Organized supplies",
    causes: ["Humanitarian Work", "Community"],
    traits: ["Organising people", "Hands-on activities"],
    activityPreferences: ["Hands-on", "Community-based", "Problem-solving"],
    skills: ["Organization", "Planning", "Teamwork"],
    volunteeringMode: ["in-person"],
    reward: 10,
  },
];

export const allAdventureDestinations = [...destinations, ...deeperDestinations];

export const paths: [string, string][] = [
  ["start", "forest"],
  ["forest", "learning"],
  ["learning", "shelter"],
  ["forest", "community"],
  ["community", "digital"],
  ["shelter", "creative"],
  ["digital", "creative"],
  ["community", "garden"],
  ["digital", "garden"],
];

export const START = { id: "start", x: 8, y: 48 };

export const nodePosition = (id: string) => {
  if (id === START.id) return { x: START.x, y: START.y };
  const d = destinations.find((n) => n.id === id);
  return { x: d?.x ?? 50, y: d?.y ?? 50 };
};

export const tintClass: Record<Destination["tint"], string> = {
  primary: "bg-primary-soft text-accent-foreground",
  coral: "bg-coral/40 text-coral-foreground",
  sky: "bg-sky/40 text-sky-foreground",
  lilac: "bg-lilac/40 text-lilac-foreground",
  sunbeam: "bg-sunbeam/50 text-sunbeam-foreground",
};

/** Minimum destinations before the results screen becomes available. */
export const MIN_DESTINATIONS = 4;
