import { Chapter } from './chapter1Data';

export const CHAPTER_2_DATA: Chapter = {
  id: 2,
  title: "Breathing & Relaxation",
  level: "Beginner",
  duration_weeks: "2-3",
  description:
    "Learn breathing techniques, reduce physical tension, and coordinate breath with speech for smoother communication",
  learning_objectives: [
    "Master diaphragmatic breathing for speech",
    "Reduce physical tension through progressive muscle relaxation",
    "Coordinate breathing with speech initiation",
    "Control speech rate through strategic pausing",
    "Build a daily relaxation practice",
  ],
  prerequisite_chapter: 1,
  exercises: [
    {
      id: "ex_2_1",
      title: "Diaphragmatic Breathing for Speech",
      category: "breathing_technique",
      duration_minutes: 20,
      difficulty: "beginner",
      therapy_approach: "fluency_shaping",
      frequency: "Daily for 2 weeks",
      description:
        "Learn to breathe from your diaphragm — the foundation of relaxed, fluent speech",
      instructions: [
        "Find a quiet, comfortable space where you won't be interrupted",
        "Read through the 'Why This Matters' section to understand the science",
        "Follow the animated breathing circle for 5 complete cycles",
        "Work through the technique steps at your own pace",
        "Practice this breathing pattern daily for at least 5 minutes",
      ],
      content: {
        why_it_matters:
          "Most people who stutter breathe shallowly from their chest, especially when anxious. Diaphragmatic breathing activates the parasympathetic nervous system — your body's natural calming response. When your body is calm, your vocal cords relax, airflow becomes steady, and speech flows more naturally.",
        research:
          "Studies show that diaphragmatic breathing reduces cortisol levels by up to 30% and significantly decreases speech-related anxiety (Kassel et al., 2017).",
        technique_steps: [
          {
            step: 1,
            name: "Find Your Diaphragm",
            details: [
              "Place one hand on your chest and one on your belly",
              "Breathe normally and notice which hand moves more",
              "If your chest hand moves more, you're chest-breathing",
              "Goal: your belly hand should rise and fall with each breath",
            ],
          },
          {
            step: 2,
            name: "The Breathing Cycle",
            details: [
              "Inhale slowly through your nose for 4 counts",
              "Hold gently for 2 counts — don't clamp your throat",
              "Exhale through your mouth for 6 counts, like fogging a mirror",
              "The exhale is longer than the inhale — this triggers relaxation",
            ],
          },
          {
            step: 3,
            name: "Connect to Speech",
            details: [
              "After a full exhale, begin speaking on the next natural exhale",
              "Start with single words: 'Hello', 'Yes', 'One'",
              "Gradually try short phrases: 'Good morning', 'Thank you'",
              "Notice how speech feels easier when you're relaxed",
            ],
          },
          {
            step: 4,
            name: "Daily Practice Checklist",
            checklist: [
              "Morning: 5 breathing cycles before getting up",
              "Midday: 3 cycles before lunch or a meeting",
              "Evening: 5 cycles before bed",
              "Before speaking situations: 3 quick cycles",
            ],
          },
        ],
        troubleshooting: [
          {
            problem: "I feel dizzy when I breathe deeply",
            solution:
              "You're likely over-breathing. Slow down, make the breaths gentler. The exhale should be relaxed, not forced. If dizziness persists, breathe normally for a minute then try again.",
          },
          {
            problem: "My shoulders keep rising when I inhale",
            solution:
              "Try lying down with a book on your belly. Focus on making the book rise. Once you feel it there, try the same movement sitting up.",
          },
          {
            problem: "I can't make the exhale last 6 counts",
            solution:
              "Start with whatever is comfortable — even 3 counts. Gradually extend by one count each week. The ratio matters more than the exact numbers.",
          },
        ],
      },
      expected_outcomes: [
        "Ability to breathe diaphragmatically on demand",
        "Reduced speech-related physical tension",
        "A calming pre-speech routine",
        "Foundation for all future breathing exercises",
      ],
      safety_notes: [
        "Stop if you feel dizzy or lightheaded",
        "Don't force deep breaths — keep it gentle",
        "This is not hyperventilation — breathe slowly",
      ],
      progress_tracking: {
        completion_criteria: "5 complete breathing cycles with the guide",
        user_can_rate: true,
        rating_type: "comfort_with_breathing",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_2_2",
      title: "Progressive Muscle Relaxation for Speech",
      category: "tension_reduction",
      duration_minutes: 25,
      difficulty: "beginner",
      therapy_approach: "PMR",
      frequency: "3 times per week",
      description:
        "Systematically tense and relax muscle groups to release the physical tension that contributes to stuttering",
      instructions: [
        "Find a quiet space where you can sit or lie comfortably",
        "Read the 'Why PMR Helps' section first",
        "Explore the body map to understand each muscle group",
        "Start a guided session — full (15 min) or speech-focused (5 min)",
        "Complete 3 sessions over this week",
      ],
      content: {
        why_pmr_helps:
          "Physical tension is both a cause and effect of stuttering. Your jaw tightens, your throat constricts, your chest locks — and speech becomes harder. PMR teaches you to recognize and release tension systematically, giving you conscious control over the muscles involved in speech.",
        research:
          "Jacobson's Progressive Muscle Relaxation has been used in stuttering therapy since the 1970s. Studies show it reduces stuttering frequency by 20-40% when practiced regularly (Craig & Calver, 1991).",
        full_body_sequence: [
          { step: 1, muscle_group: "Right Foot", instruction: "Curl your toes tightly, feel the arch of your foot tense", speech_critical: false },
          { step: 2, muscle_group: "Left Foot", instruction: "Same as right foot — curl toes, tense the arch", speech_critical: false },
          { step: 3, muscle_group: "Right Calf", instruction: "Point your toes toward your shin, feel the calf stretch and tense", speech_critical: false },
          { step: 4, muscle_group: "Left Calf", instruction: "Mirror the right calf movement", speech_critical: false },
          { step: 5, muscle_group: "Thighs", instruction: "Press your knees together and squeeze your thigh muscles", speech_critical: false },
          { step: 6, muscle_group: "Stomach", instruction: "Tighten your abs as if bracing for a punch", speech_critical: false },
          { step: 7, muscle_group: "Chest", instruction: "Take a deep breath and hold it, feeling your chest expand and tighten", speech_critical: false },
          { step: 8, muscle_group: "Right Hand & Arm", instruction: "Make a tight fist and flex your entire arm", speech_critical: false },
          { step: 9, muscle_group: "Left Hand & Arm", instruction: "Same as right — tight fist, full arm flex", speech_critical: false },
          { step: 10, muscle_group: "Shoulders", instruction: "Shrug your shoulders up toward your ears as high as possible", speech_critical: true, note: "Shoulder tension directly restricts airflow for speech" },
          { step: 11, muscle_group: "Neck", instruction: "Gently press your head back against the chair or floor", speech_critical: true, note: "A tense neck restricts the larynx and vocal cord movement" },
          { step: 12, muscle_group: "Jaw", instruction: "Clench your jaw tightly, press your teeth together", speech_critical: true, note: "Jaw tension is the #1 physical contributor to speech blocks" },
          { step: 13, muscle_group: "Lips", instruction: "Press your lips together firmly, then purse them as tight as possible", speech_critical: true, note: "Lip tension causes blocks on bilabial sounds (b, p, m)" },
          { step: 14, muscle_group: "Tongue", instruction: "Press your tongue hard against the roof of your mouth", speech_critical: true, note: "Tongue tension affects articulation of nearly every sound" },
          { step: 15, muscle_group: "Throat", instruction: "Swallow hard and hold the tension in your throat", speech_critical: true, note: "Laryngeal tension is the core of most speech blocks" },
          { step: 16, muscle_group: "Face (Forehead)", instruction: "Raise your eyebrows as high as possible, wrinkling your forehead", speech_critical: false },
          { step: 17, muscle_group: "Eyes", instruction: "Squeeze your eyes shut tightly", speech_critical: false },
        ],
        speech_focused_mini_pmr: {
          duration: "5 minutes",
          steps: [
            { step: 1, muscle_group: "Shoulders", instruction: "Shrug up to ears, hold, release", speech_critical: true },
            { step: 2, muscle_group: "Neck", instruction: "Press head back gently, hold, release", speech_critical: true },
            { step: 3, muscle_group: "Jaw", instruction: "Clench teeth, hold, release — let jaw hang slightly open", speech_critical: true },
            { step: 4, muscle_group: "Lips", instruction: "Press lips tight, hold, release — lips should feel soft", speech_critical: true },
            { step: 5, muscle_group: "Tongue", instruction: "Press tongue to roof of mouth, hold, release — let it rest low", speech_critical: true },
            { step: 6, muscle_group: "Throat", instruction: "Swallow and hold tension, release — feel the throat open", speech_critical: true },
          ],
        },
      },
      expected_outcomes: [
        "Ability to identify and release tension in speech muscles",
        "Reduced baseline physical tension",
        "Quick relaxation technique for pre-speech situations",
        "Better awareness of where you hold tension",
      ],
      safety_notes: [
        "Never tense to the point of pain — moderate effort only",
        "Skip any muscle group that has an injury",
        "If you feel cramping, release immediately and massage the area",
      ],
      progress_tracking: {
        completion_criteria: "Completed 3 guided sessions",
        user_can_rate: true,
        rating_type: "tension_awareness",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_2_3",
      title: "Breath-Speech Coordination",
      category: "breath_speech_coordination",
      duration_minutes: 20,
      difficulty: "intermediate",
      therapy_approach: "fluency_shaping",
      frequency: "Daily for 1 week per level",
      description:
        "Learn to start speaking on a gentle exhale — the key technique for preventing speech blocks",
      instructions: [
        "Read the Problem/Solution cards to understand the concept",
        "Study the 4-step passive exhale pattern",
        "Start with Level 1 — single syllable words",
        "Record yourself saying each word and listen back",
        "Progress through levels as each one feels comfortable",
      ],
      content: {
        the_problem: [
          "Holding breath before speaking",
          "Starting speech with throat tension",
          "Speaking while inhaling (reverse breathing)",
          "Running out of air mid-sentence",
        ],
        the_solution:
          "The passive exhale technique: breathe in naturally, let the exhale begin on its own, then gently initiate speech on that outgoing airstream. No forcing, no pushing.",
        basic_pattern: [
          { step: 1, label: "Inhale" },
          { step: 2, label: "Passive Exhale" },
          { step: 3, label: "Initiate Speech" },
          { step: 4, label: "Continue" },
        ],
        progressive_levels: [
          {
            level: 1,
            name: "Single Syllable Words",
            days: "Days 1-3",
            instructions: [
              "Take a relaxed breath",
              "Let the exhale start naturally",
              "Say the word on the exhale",
              "Record and listen — does it sound relaxed?",
            ],
            practice_words: [
              "Hi", "Yes", "No", "Go", "See", "Two",
              "Blue", "Tree", "Smile", "Calm",
              "Green", "Light", "Peace", "Rest",
            ],
          },
          {
            level: 2,
            name: "Two-Syllable Words",
            days: "Days 4-6",
            instructions: [
              "Same breathing pattern as Level 1",
              "Focus on smooth airflow through both syllables",
              "Don't pause between syllables",
              "If you feel tension, go back to breathing first",
            ],
            practice_words: [
              "Hello", "Happy", "Water", "Garden",
              "Music", "People", "Better", "Monday",
              "Simple", "Easy", "Purple", "Window",
            ],
          },
          {
            level: 3,
            name: "Consonant Groups",
            days: "Days 7-10",
            instructions: [
              "Different consonants need different airflow",
              "Fricatives (f, s, sh) — continuous airflow",
              "Nasals (m, n) — air through nose",
              "Liquids (l, r) — tongue stays relaxed",
            ],
            consonant_groups: {
              fricatives: ["Fish", "Sunday", "Shower", "Fresh", "Seven", "Shine"],
              nasals: ["Monday", "Nothing", "Mountain", "Never", "Morning", "Name"],
              liquids: ["Listen", "River", "Lemon", "Rainbow", "Lovely", "Ready"],
            },
          },
          {
            level: 4,
            name: "Short Phrases",
            days: "Days 11-14",
            instructions: [
              "Now apply the passive exhale to connected speech",
              "Take a breath before each phrase",
              "Speak the entire phrase on one exhale",
              "Keep your pace slow and deliberate",
            ],
            practice_phrases: [
              "Good morning, how are you?",
              "I'd like a coffee please",
              "My name is...",
              "Thank you very much",
              "Can I ask you something?",
              "I'll be there at five",
              "Nice to meet you",
              "Let me think about that",
            ],
          },
        ],
        common_mistakes: [
          {
            mistake: "Gasping before speaking",
            correction:
              "Take a normal breath, not a big gulp of air. You only need enough air for a short phrase.",
          },
          {
            mistake: "Forcing the exhale",
            correction:
              "The exhale should be passive — like a sigh. If you're pushing air, you're adding tension.",
          },
          {
            mistake: "Speaking too quickly after the exhale",
            correction:
              "Let the exhale establish itself for a beat before adding voice. There's no rush.",
          },
          {
            mistake: "Forgetting to breathe between phrases",
            correction:
              "Pauses between phrases are natural and necessary. Use them to take a fresh breath.",
          },
        ],
      },
      expected_outcomes: [
        "Natural breath-speech coordination",
        "Fewer speech blocks caused by tension",
        "Confidence in starting sentences smoothly",
        "Ability to self-correct when you notice reverse breathing",
      ],
      safety_notes: [
        "Don't hyperventilate — normal breaths only",
        "Take breaks if you feel frustrated",
        "Progress at your own pace — there's no deadline",
      ],
      progress_tracking: {
        completion_criteria: "All 4 levels completed",
        user_can_rate: true,
        rating_type: "speech_smoothness",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
    {
      id: "ex_2_4",
      title: "Rate Control & Strategic Pausing",
      category: "rate_control",
      duration_minutes: 20,
      difficulty: "intermediate",
      therapy_approach: "fluency_shaping",
      frequency: "Daily for 2 weeks",
      description:
        "Learn to use pauses as a powerful tool for smoother, more confident speech",
      instructions: [
        "Read why pausing helps and where pauses naturally occur",
        "Study the 3 pausing patterns with visual examples",
        "Work through Phase 1: reading with deliberate pauses",
        "Progress to Phase 2: shortening pauses to natural length",
        "Phase 3: practice pausing in spontaneous conversation",
      ],
      content: {
        why_pausing_helps:
          "Pausing is not a sign of weakness — it's a sign of confident communication. Every great speaker uses strategic pauses. For people who stutter, pauses provide a moment to breathe, reset tension, and initiate the next phrase smoothly.",
        where_to_pause: [
          "After commas and periods",
          "Between clauses and ideas",
          "Before important words",
          "When changing topics",
        ],
        pausing_patterns: [
          {
            name: "Punctuation Pausing",
            description: "Pause at every comma and period — the most natural pattern",
            example: "I went to the store, / and I bought some milk. / Then I came home.",
          },
          {
            name: "Phrase Grouping",
            description: "Group 3-5 words into phrases with pauses between them",
            example: "The weather today / is really nice / so I think / we should go outside.",
          },
          {
            name: "Emphasis Pausing",
            description: "Pause before key words to add weight and give yourself time",
            example: "What I really want to say / is that this / [pause] matters to me.",
          },
        ],
        progressive_plan: [
          {
            phase: 1,
            name: "Reading with Deliberate Pauses",
            instructions: [
              "Read the passage below out loud",
              "Pause for 2-3 seconds at every / mark",
              "Take a breath during each pause",
              "Focus on starting each new phrase smoothly",
            ],
            example:
              "Speaking is a skill / that everyone can improve. / When you take your time, / your words carry more weight. / Pausing gives you control / over your message / and your delivery. / There is no rush / to finish a sentence. / The listener is patient, / and your words are worth waiting for.",
          },
          {
            phase: 2,
            name: "Shortening Pause Duration",
            instructions: [
              "Read the same passage again",
              "This time, shorten your pauses gradually",
              "Start at 2-3 seconds, then 1-2, then under 1 second",
              "The pause should feel natural, not forced",
            ],
            pause_progression: [
              { label: "Start", duration: "2-3 sec" },
              { label: "Middle", duration: "1-2 sec" },
              { label: "Goal", duration: "0.5-1 sec" },
            ],
          },
          {
            phase: 3,
            name: "Conversational Pausing",
            instructions: [
              "Practice pausing in spontaneous speech",
              "Record yourself talking about each topic below",
              "Listen back — do your pauses sound natural?",
              "Mark each topic done when it feels comfortable",
            ],
            conversation_topics: [
              "What I did this weekend",
              "My favorite meal to cook",
              "A place I'd love to visit",
              "Something I learned recently",
              "A movie or show I enjoyed",
            ],
          },
        ],
        pausing_plus_breathing: {
          full_sequence: [
            "Take a relaxed diaphragmatic breath",
            "Begin speaking on the passive exhale",
            "Speak one phrase (3-5 words)",
            "Pause — take a quick breath",
            "Continue with the next phrase",
            "Repeat: phrase → pause → breathe → phrase",
          ],
          integration:
            "This combines everything from Chapter 2: breathing from Exercise 1, relaxation from Exercise 2, breath-speech coordination from Exercise 3, and pausing from this exercise. Practice them together.",
        },
      },
      expected_outcomes: [
        "Natural, confident pausing in conversation",
        "Reduced speech rate without sounding unnatural",
        "Better breath management during connected speech",
        "Integration of all Chapter 2 techniques",
      ],
      safety_notes: [
        "Pausing is not avoidance — it's a technique",
        "Don't overthink pauses — they should feel natural over time",
        "If pausing feels forced, take a break and try again later",
      ],
      progress_tracking: {
        completion_criteria: "All 3 phases completed",
        user_can_rate: true,
        rating_type: "pausing_naturalness",
        rating_scale: "1-5",
        notes_enabled: true,
      },
    },
  ],
};
