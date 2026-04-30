// Chapter 1 Mock Data - Will be replaced by API call
export interface Exercise {
  id: string;
  title: string;
  category:
    | "education"
    | "self_awareness"
    | "cognitive_behavioral"
    | "self_advocacy";
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  therapy_approach: string;
  frequency: string;
  description: string;
  instructions: string[];
  content: Record<string, unknown>;
  expected_outcomes: string[];
  safety_notes: string[];
  progress_tracking: {
    completion_criteria: string;
    user_can_rate: boolean;
    rating_type: string;
    rating_scale: string;
    notes_enabled: boolean;
  };
}

export interface Chapter {
  id: number;
  title: string;
  level: string;
  duration_weeks: string;
  description: string;
  learning_objectives: string[];
  prerequisite_chapter: number | null;
  exercises: Exercise[];
}

export const CHAPTER_1_DATA: Chapter = {
  id: 1,
  title: "Foundation & Awareness",
  level: "Beginner",
  duration_weeks: "2-3",
  description:
    "Understanding stuttering, building self-awareness, and establishing a foundation for therapy",
  learning_objectives: [
    "Understand what stuttering is and its various types",
    "Develop awareness of personal stuttering patterns",
    "Learn to identify moments of stuttering",
    "Build confidence and reduce initial anxiety",
    "Understand the therapy journey ahead",
  ],
  prerequisite_chapter: null,
  exercises: [
    {
      id: "ex_1_1",
      title: "What is Stuttering? Understanding Your Speech",
      category: "education",
      duration_minutes: 15,
      difficulty: "beginner",
      therapy_approach: "psychoeducation",
      frequency: "Complete once, review as needed",
      description:
        "Learn about stuttering, its types, and that you're not alone in this journey",
      instructions: [
        "Read through the educational content about stuttering types",
        "Look in a mirror and speak for 30 seconds - observe without judgment",
        "Write down 3 things you learned about stuttering",
        "Reflect: How does this knowledge make you feel? Does it change your perspective?",
      ],
      content: {
        what_is_stuttering:
          "Stuttering (also called stammering) is a speech fluency disorder that affects the natural flow and rhythm of speech. It is characterized by repetitions, prolongations, or blocks.",
        types_of_stuttering: [
          {
            type: "Repetitions",
            description: "Repeating sounds, syllables, or whole words",
            examples: ["b-b-b-ball", "to-to-today", "I-I-I want"],
          },
          {
            type: "Prolongations",
            description:
              "Stretching or extending sounds beyond their normal duration",
            examples: ["Ssssssnake", "Mmmmmmy name", "Fffffriend"],
          },
          {
            type: "Blocks",
            description:
              "Inability to produce sound; feeling stuck or experiencing airflow stoppage",
            examples: [
              "Silent pause before word",
              "Visible tension without sound",
              "Feeling of throat closure",
            ],
          },
        ],
        statistics: {
          adults_who_stutter: "1%",
          children_who_stutter: "5-8%",
          children_who_recover: "80%",
          continue_into_adulthood: "20-25%",
        },
        famous_people_who_stutter: [
          "Joe Biden - President of the United States",
          "Emily Blunt - Award-winning actress",
          "Ed Sheeran - Grammy-winning singer",
          "Samuel L. Jackson - Actor",
          "James Earl Jones - Actor (voice of Darth Vader)",
        ],
      },
      expected_outcomes: [
        "Better understanding of what stuttering is",
        "Reduced self-blame and feelings of shame",
        "Knowledge that stuttering is neurological, not your fault",
        "Foundation for therapeutic work ahead",
      ],
      safety_notes: [
        "This is purely educational - no physical exercises yet",
        "Take breaks if you feel emotionally overwhelmed",
        "Journal your feelings if that's helpful to you",
      ],
      progress_tracking: {
        completion_criteria: "Completed reading and reflection",
        user_can_rate: true,
        rating_type: "understanding",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_1_2",
      title: "Stuttering Awareness - Identifying Your Patterns",
      category: "self_awareness",
      duration_minutes: 20,
      difficulty: "beginner",
      therapy_approach: "identification",
      frequency: "3 times over one week",
      description:
        "Learn to recognize when and how you stutter without judgment",
      instructions: [
        "Record yourself reading a short passage (2-3 minutes)",
        "Listen back and count: How many repetitions? Prolongations? Blocks?",
        "Note which sounds or words are difficult",
        "Write down any physical tension you notice (jaw, throat, chest)",
        "Complete this 3 times over one week",
      ],
      content: {
        why_awareness:
          "Awareness is the first step in managing stuttering. You can't change what you don't notice.",
        what_to_observe: [
          {
            category: "Core Stuttering Behaviors",
            items: [
              "Repetitions: How many? Which sounds/words?",
              "Prolongations: How long? Which sounds?",
              "Blocks: How many? Where in the word?",
            ],
          },
          {
            category: "Physical Tension",
            items: [
              "Jaw: Clenched? Tight? Where specifically?",
              "Tongue: Pushing? Retracted? Tense?",
              "Lips: Pressed together? Trembling?",
              "Throat/Neck: Tight? Strained?",
            ],
          },
          {
            category: "Emotional Reactions",
            items: [
              "Frustration",
              "Anxiety or fear",
              "Embarrassment",
              "Anger",
              "Resignation",
            ],
          },
        ],
      },
      expected_outcomes: [
        "Increased awareness of your personal stuttering patterns",
        "Ability to identify different types of stuttering moments",
        "Recognition of where physical tension occurs",
        "Non-judgmental observation skills",
      ],
      safety_notes: [
        "Observe without self-criticism - this is data gathering only",
        "If listening to yourself is emotionally difficult, start with just 30 seconds",
        "Focus on facts, not feelings of shame",
      ],
      progress_tracking: {
        completion_criteria: "Completed 3 recordings and tracking",
        user_can_rate: true,
        rating_type: "comfort_with_awareness",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_1_3",
      title: "Building Confidence - Reframing Negative Thoughts",
      category: "cognitive_behavioral",
      duration_minutes: 15,
      difficulty: "beginner",
      therapy_approach: "CBT",
      frequency: "Daily for 1 week",
      description:
        "Replace negative, unhelpful thoughts about stuttering with balanced, compassionate self-talk",
      instructions: [
        "Write down 3 negative thoughts you have about your stuttering",
        "For each negative thought, write a more balanced alternative",
        "Practice saying the balanced thoughts out loud",
        "When you catch yourself in negative self-talk, pause and reframe",
        "Practice daily for one week",
      ],
      content: {
        why_self_talk_matters:
          "The way you think about your stuttering directly affects how you feel, how you behave, physical tension, and stuttering severity.",
        the_cycle:
          "Negative thought → Anxiety/shame → Physical tension → More stuttering → Reinforces negative thought",
        common_reframes: [
          {
            negative: "I'm a terrible speaker",
            balanced:
              "Speaking is challenging for me, but I have valuable things to say",
          },
          {
            negative: "People think I'm stupid when I stutter",
            balanced:
              "My speech doesn't reflect my intelligence or capabilities",
          },
          {
            negative: "I'll never get better at this",
            balanced: "Progress takes time, and I'm learning helpful skills",
          },
          {
            negative: "Nobody wants to listen to me stutter",
            balanced:
              "Patient people appreciate what I have to say, not just how I say it",
          },
        ],
        cognitive_distortions: [
          {
            name: "All-or-Nothing Thinking",
            example: "If I stutter even once, the whole conversation is ruined",
          },
          {
            name: "Catastrophizing",
            example: "This stutter will make everyone think I'm incompetent",
          },
          {
            name: "Mind Reading",
            example: "I know they're thinking I'm weird",
          },
        ],
      },
      expected_outcomes: [
        "Reduced frequency of negative self-talk",
        "More balanced perspective on stuttering",
        "Improved self-compassion",
        "Better emotional regulation",
      ],
      safety_notes: [
        "Be patient with yourself - changing thought patterns takes time",
        "If overwhelmed, work with one thought at a time",
        "If you notice persistent symptoms, seek professional support",
      ],
      progress_tracking: {
        completion_criteria: "Daily practice for 7 days",
        user_can_rate: true,
        rating_type: "self_compassion_improvement",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_1_4",
      title: "Educating Others - Self-Disclosure Practice",
      category: "self_advocacy",
      duration_minutes: 15,
      difficulty: "beginner",
      therapy_approach: "desensitization",
      frequency: "Prepare once, use as needed",
      description:
        "Prepare simple, confident ways to talk about your stuttering with others",
      instructions: [
        "Write your own disclosure statements (brief, phone, professional)",
        "Practice saying each version 5 times out loud",
        "Record yourself saying them - check your tone for confidence",
        "Optional: Start by disclosing to safe people, then progress to others",
      ],
      content: {
        why_disclosure_helps:
          "Research shows that informative self-disclosure reduces your own anxiety, helps listeners respond appropriately, and puts you in control.",
        types_of_disclosure: [
          {
            type: "Brief Informative",
            examples: [
              "I stutter, so you might notice I repeat sounds sometimes",
              "I have a stutter - it may take me a moment to get my words out",
            ],
          },
          {
            type: "Educational",
            examples: [
              "I have a neurological condition called stuttering that affects my speech fluency",
              "Stuttering runs in my family - it's how my brain processes speech",
            ],
          },
          {
            type: "Situational",
            examples: [
              "Before presentation: You'll notice I stutter - it doesn't affect my knowledge",
              "On phone: I stutter, so if there's a pause, I haven't hung up",
            ],
          },
        ],
        dos_and_donts: {
          do: [
            "Use a matter-of-fact tone",
            "Make eye contact",
            "Be brief and move on",
            "Sound confident and comfortable",
          ],
          dont: [
            "Apologize for stuttering",
            "Make excuses ('I'm just nervous')",
            "Over-explain",
            "Sound ashamed or embarrassed",
          ],
        },
      },
      expected_outcomes: [
        "Prepared, confident disclosure statements",
        "Reduced anxiety about stuttering in social situations",
        "Better listener responses",
        "Increased sense of control",
      ],
      safety_notes: [
        "You are NEVER required to disclose - it's a personal choice",
        "Disclosure is a tool, not an obligation",
        "Start with safe people and situations",
      ],
      progress_tracking: {
        completion_criteria:
          "Prepared disclosure statements and practiced them",
        user_can_rate: true,
        rating_type: "confidence_with_disclosure",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
  ],
};
