import type { Disorder, LikertValue, Question } from "./types";

/** 0–4 frequency scale (PHQ/GAD style) */
export const LIKERT_OPTIONS: { value: LikertValue; label: string }[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
  { value: 4, label: "Constantly / severely" },
];

export const DISORDERS: Disorder[] = [
  { id: "mdd", name: "Major Depressive Disorder", category: "Mood", shortDescription: "Persistent low mood, loss of interest, fatigue.", instrument: "PHQ-9 inspired", threshold: 6, maxScore: 12 },
  { id: "gad", name: "Generalized Anxiety Disorder", category: "Anxiety", shortDescription: "Excessive worry that's hard to control.", instrument: "GAD-7 inspired", threshold: 6, maxScore: 12 },
  { id: "panic", name: "Panic Disorder", category: "Anxiety", shortDescription: "Sudden panic attacks and fear of recurrence.", threshold: 5, maxScore: 12 },
  { id: "social_anxiety", name: "Social Anxiety Disorder", category: "Anxiety", shortDescription: "Intense fear of social scrutiny or embarrassment.", threshold: 5, maxScore: 12 },
  { id: "ptsd", name: "Post-Traumatic Stress Disorder", category: "Trauma", shortDescription: "Intrusive memories, avoidance, hyperarousal after trauma.", instrument: "PC-PTSD-5 inspired", threshold: 5, maxScore: 12 },
  { id: "ocd", name: "Obsessive-Compulsive Disorder", category: "Obsessive-Compulsive", shortDescription: "Unwanted thoughts and repetitive behaviors.", threshold: 5, maxScore: 12 },
  { id: "adhd", name: "ADHD", category: "Neurodevelopmental", shortDescription: "Inattention, hyperactivity, or impulsivity.", instrument: "ASRS inspired", threshold: 6, maxScore: 12 },
  { id: "bipolar", name: "Bipolar Disorder", category: "Mood", shortDescription: "Episodes of depression alternating with mania/hypomania.", instrument: "MDQ inspired", threshold: 5, maxScore: 12 },
  { id: "schizophrenia", name: "Schizophrenia Spectrum", category: "Psychosis", shortDescription: "Hallucinations, delusions, or disorganized thinking.", threshold: 5, maxScore: 12 },
  { id: "bpd", name: "Borderline Personality Disorder", category: "Personality", shortDescription: "Emotional instability, fear of abandonment, impulsivity.", instrument: "MSI-BPD inspired", threshold: 5, maxScore: 12 },
  { id: "anorexia", name: "Anorexia Nervosa", category: "Eating", shortDescription: "Restriction of intake and intense fear of weight gain.", threshold: 5, maxScore: 12 },
  { id: "bulimia", name: "Bulimia Nervosa", category: "Eating", shortDescription: "Binge eating with compensatory behaviors.", threshold: 5, maxScore: 12 },
  { id: "binge_eating", name: "Binge Eating Disorder", category: "Eating", shortDescription: "Recurrent binge episodes with distress.", threshold: 5, maxScore: 12 },
  { id: "aud", name: "Alcohol Use Disorder", category: "Substance", shortDescription: "Problematic alcohol use despite consequences.", instrument: "AUDIT-C inspired", threshold: 5, maxScore: 12 },
  { id: "sud", name: "Substance Use Disorder", category: "Substance", shortDescription: "Problematic use of drugs or medications.", threshold: 5, maxScore: 12 },
  { id: "insomnia", name: "Insomnia Disorder", category: "Sleep", shortDescription: "Difficulty falling or staying asleep.", instrument: "ISI inspired", threshold: 5, maxScore: 12 },
  { id: "asd", name: "Autism Spectrum Disorder", category: "Neurodevelopmental", shortDescription: "Social communication differences and restricted interests.", instrument: "AQ-10 inspired", threshold: 5, maxScore: 12 },
  { id: "specific_phobia", name: "Specific Phobia", category: "Anxiety", shortDescription: "Intense fear of a specific object or situation.", threshold: 5, maxScore: 12 },
  { id: "agoraphobia", name: "Agoraphobia", category: "Anxiety", shortDescription: "Fear of situations where escape might be difficult.", threshold: 5, maxScore: 12 },
  { id: "separation_anxiety", name: "Separation Anxiety", category: "Anxiety", shortDescription: "Excessive fear of separation from attachment figures.", threshold: 5, maxScore: 12 },
  { id: "hoarding", name: "Hoarding Disorder", category: "Obsessive-Compulsive", shortDescription: "Difficulty discarding possessions regardless of value.", threshold: 5, maxScore: 12 },
  { id: "bdd", name: "Body Dysmorphic Disorder", category: "Obsessive-Compulsive", shortDescription: "Preoccupation with perceived flaws in appearance.", threshold: 5, maxScore: 12 },
  { id: "trichotillomania", name: "Trichotillomania", category: "Impulse-Control", shortDescription: "Recurrent hair pulling causing hair loss.", threshold: 5, maxScore: 12 },
  { id: "excoriation", name: "Excoriation (Skin Picking)", category: "Impulse-Control", shortDescription: "Recurrent skin picking causing lesions.", threshold: 5, maxScore: 12 },
  { id: "ied", name: "Intermittent Explosive Disorder", category: "Impulse-Control", shortDescription: "Recurrent aggressive outbursts disproportionate to triggers.", threshold: 5, maxScore: 12 },
  { id: "adjustment", name: "Adjustment Disorder", category: "Stress", shortDescription: "Emotional or behavioral symptoms after a stressor.", threshold: 5, maxScore: 12 },
  { id: "somatic", name: "Somatic Symptom Disorder", category: "Somatic", shortDescription: "Distressing physical symptoms with excessive health focus.", threshold: 5, maxScore: 12 },
  { id: "illness_anxiety", name: "Illness Anxiety Disorder", category: "Somatic", shortDescription: "Preoccupation with having or acquiring a serious illness.", threshold: 5, maxScore: 12 },
  { id: "dissociative", name: "Dissociative Disorder", category: "Dissociative", shortDescription: "Feeling detached from self, body, or surroundings.", threshold: 5, maxScore: 12 },
  { id: "sad", name: "Seasonal Affective Disorder", category: "Mood", shortDescription: "Depressive episodes tied to seasons, often winter.", threshold: 5, maxScore: 12 },
  { id: "pmdd", name: "Premenstrual Dysphoric Disorder", category: "Mood", shortDescription: "Severe mood symptoms before menstruation.", threshold: 5, maxScore: 12 },
  { id: "avoidant_pd", name: "Avoidant Personality Disorder", category: "Personality", shortDescription: "Social inhibition, feelings of inadequacy, hypersensitivity.", threshold: 5, maxScore: 12 },
];

/** Primary screen (1 per disorder) + 2 deepening items each */
export const QUESTIONS: Question[] = [
  // Mood
  { id: "mdd_p1", text: "Little interest or pleasure in doing things?", disorders: ["mdd"] },
  { id: "mdd_d1", text: "Feeling down, depressed, or hopeless?", disorders: ["mdd"] },
  { id: "mdd_d2", text: "Trouble concentrating on things?", disorders: ["mdd"] },
  { id: "bipolar_p1", text: "Periods when you felt so good or hyper that others said you were not your normal self?", disorders: ["bipolar"] },
  { id: "bipolar_d1", text: "During those times, did you need much less sleep than usual?", disorders: ["bipolar"] },
  { id: "bipolar_d2", text: "Did you do things that caused trouble or were unusually risky?", disorders: ["bipolar"] },
  { id: "sad_p1", text: "Do you feel markedly worse during specific seasons (often fall/winter)?", disorders: ["sad"] },
  { id: "sad_d1", text: "Do you crave carbs or sleep much more during those seasons?", disorders: ["sad"] },
  { id: "sad_d2", text: "Do symptoms lift when the season changes?", disorders: ["sad"] },
  { id: "pmdd_p1", text: "In the week before your period, do you feel markedly irritable, sad, or anxious?", disorders: ["pmdd"] },
  { id: "pmdd_d1", text: "Do these premenstrual symptoms interfere with work, school, or relationships?", disorders: ["pmdd"] },
  { id: "pmdd_d2", text: "Do symptoms improve within a few days after your period starts?", disorders: ["pmdd"] },

  // Anxiety
  { id: "gad_p1", text: "Feeling nervous, anxious, or on edge?", disorders: ["gad"] },
  { id: "gad_d1", text: "Not being able to stop or control worrying?", disorders: ["gad"] },
  { id: "gad_d2", text: "Worrying too much about different things?", disorders: ["gad"] },
  { id: "panic_p1", text: "Sudden rushes of intense fear or panic?", disorders: ["panic"] },
  { id: "panic_d1", text: "Fear of panic attacks happening again?", disorders: ["panic"] },
  { id: "panic_d2", text: "Avoiding places because you might panic?", disorders: ["panic"] },
  { id: "social_p1", text: "Fear of embarrassment causing you to avoid social situations?", disorders: ["social_anxiety"] },
  { id: "social_d1", text: "Worry that others will notice you are anxious?", disorders: ["social_anxiety"] },
  { id: "social_d2", text: "Avoiding speaking up or meeting new people?", disorders: ["social_anxiety"] },
  { id: "specific_phobia_p1", text: "Intense fear of a specific thing (heights, animals, blood, flying, etc.)?", disorders: ["specific_phobia"] },
  { id: "specific_phobia_d1", text: "Does encountering it cause immediate anxiety or panic?", disorders: ["specific_phobia"] },
  { id: "specific_phobia_d2", text: "Do you go out of your way to avoid it?", disorders: ["specific_phobia"] },
  { id: "agoraphobia_p1", text: "Fear or avoidance of crowds, open spaces, public transport, or being alone outside?", disorders: ["agoraphobia"] },
  { id: "agoraphobia_d1", text: "Needing a companion to leave home?", disorders: ["agoraphobia"] },
  { id: "agoraphobia_d2", text: "Feeling trapped in situations where escape is hard?", disorders: ["agoraphobia"] },
  { id: "separation_p1", text: "Excessive distress when separated from people you are close to?", disorders: ["separation_anxiety"] },
  { id: "separation_d1", text: "Persistent worry that something bad will happen to them?", disorders: ["separation_anxiety"] },
  { id: "separation_d2", text: "Reluctance to sleep or go out alone because of separation fears?", disorders: ["separation_anxiety"] },

  // Trauma & OCD
  { id: "ptsd_p1", text: "Repeated disturbing memories, dreams, or flashbacks of a traumatic event?", disorders: ["ptsd"] },
  { id: "ptsd_d1", text: "Avoiding reminders of the trauma?", disorders: ["ptsd"] },
  { id: "ptsd_d2", text: "Feeling on guard, easily startled, or emotionally numb since the trauma?", disorders: ["ptsd"] },
  { id: "ocd_p1", text: "Unwanted thoughts, urges, or images that keep coming back?", disorders: ["ocd"] },
  { id: "ocd_d1", text: "Repetitive behaviors or mental acts you feel driven to perform?", disorders: ["ocd"] },
  { id: "ocd_d2", text: "Rituals aimed at reducing anxiety or preventing something bad?", disorders: ["ocd"] },
  { id: "hoarding_p1", text: "Difficulty throwing away possessions even when they seem worthless?", disorders: ["hoarding"] },
  { id: "hoarding_d1", text: "Distress when discarding items?", disorders: ["hoarding"] },
  { id: "hoarding_d2", text: "Clutter that interferes with using your living space?", disorders: ["hoarding"] },
  { id: "bdd_p1", text: "Preoccupation with one or more perceived flaws in your appearance?", disorders: ["bdd"] },
  { id: "bdd_d1", text: "Repetitive checking, grooming, or comparing because of appearance concerns?", disorders: ["bdd"] },
  { id: "bdd_d2", text: "Appearance concerns cause significant distress or avoidance?", disorders: ["bdd"] },

  // Neurodevelopmental
  { id: "adhd_p1", text: "Trouble wrapping up final details or staying organized?", disorders: ["adhd"] },
  { id: "adhd_d1", text: "Difficulty remembering appointments or obligations?", disorders: ["adhd"] },
  { id: "adhd_d2", text: "Fidgeting, restlessness, or difficulty staying seated when expected?", disorders: ["adhd"] },
  { id: "asd_p1", text: "Difficulty reading social cues or knowing what others are thinking?", disorders: ["asd"] },
  { id: "asd_d1", text: "Strong preference for routines or distress when they change?", disorders: ["asd"] },
  { id: "asd_d2", text: "Intense, narrow interests or sensory sensitivities?", disorders: ["asd"] },

  // Psychosis
  { id: "schizophrenia_p1", text: "Hearing or seeing things others do not, or feeling watched when alone?", disorders: ["schizophrenia"] },
  { id: "schizophrenia_d1", text: "Beliefs others find unusual (special powers, conspiracies, messages meant for you)?", disorders: ["schizophrenia"] },
  { id: "schizophrenia_d2", text: "Disorganized speech or behavior others find hard to follow?", disorders: ["schizophrenia"] },

  // Personality
  { id: "bpd_p1", text: "Intense fear of abandonment or frantic efforts to avoid it?", disorders: ["bpd"] },
  { id: "bpd_d1", text: "Unstable relationships swinging between idealization and devaluation?", disorders: ["bpd"] },
  { id: "bpd_d2", text: "Impulsive actions (spending, sex, substances, self-harm) when upset?", disorders: ["bpd"] },
  { id: "avoidant_pd_p1", text: "Avoiding work or social activities due to fear of criticism or rejection?", disorders: ["avoidant_pd"] },
  { id: "avoidant_pd_d1", text: "Feeling inadequate or unappealing in social situations?", disorders: ["avoidant_pd"] },
  { id: "avoidant_pd_d2", text: "Reluctance to take risks or try new things because you might be embarrassed?", disorders: ["avoidant_pd"] },

  // Eating
  { id: "anorexia_p1", text: "Restricting food intake due to fear of gaining weight?", disorders: ["anorexia"] },
  { id: "anorexia_d1", text: "Distorted body image — feeling overweight despite being underweight?", disorders: ["anorexia"] },
  { id: "anorexia_d2", text: "Intense exercise or other behaviors to control weight?", disorders: ["anorexia"] },
  { id: "bulimia_p1", text: "Episodes of eating large amounts with a sense of loss of control?", disorders: ["bulimia"] },
  { id: "bulimia_d1", text: "Compensating through vomiting, laxatives, fasting, or excessive exercise?", disorders: ["bulimia"] },
  { id: "bulimia_d2", text: "Self-worth overly tied to shape or weight?", disorders: ["bulimia"] },
  { id: "binge_p1", text: "Recurrent binge eating without regular compensatory behaviors?", disorders: ["binge_eating"] },
  { id: "binge_d1", text: "Eating much faster than normal until uncomfortably full?", disorders: ["binge_eating"] },
  { id: "binge_d2", text: "Eating alone due to embarrassment about how much you eat?", disorders: ["binge_eating"] },

  // Substance
  { id: "aud_p1", text: "How often do you have six or more drinks on one occasion?", disorders: ["aud"] },
  { id: "aud_d1", text: "Unable to stop drinking once you start?", disorders: ["aud"] },
  { id: "aud_d2", text: "Needing a drink in the morning or drinking to steady nerves?", disorders: ["aud"] },
  { id: "sud_p1", text: "Using drugs or medications in ways not prescribed or for longer than intended?", disorders: ["sud"] },
  { id: "sud_d1", text: "Craving or strong urges to use?", disorders: ["sud"] },
  { id: "sud_d2", text: "Continued use despite problems at work, school, or relationships?", disorders: ["sud"] },

  // Sleep
  { id: "insomnia_p1", text: "Difficulty falling asleep, staying asleep, or waking too early?", disorders: ["insomnia"] },
  { id: "insomnia_d1", text: "Sleep problems cause daytime fatigue or mood issues?", disorders: ["insomnia"] },
  { id: "insomnia_d2", text: "Worry or frustration about sleep that makes it worse?", disorders: ["insomnia"] },

  // Impulse control
  { id: "trich_p1", text: "Repeatedly pulling out hair from scalp, brows, or body?", disorders: ["trichotillomania"] },
  { id: "trich_d1", text: "Tension before pulling and relief or gratification afterward?", disorders: ["trichotillomania"] },
  { id: "trich_d2", text: "Noticeable hair loss or attempts to hide it?", disorders: ["trichotillomania"] },
  { id: "excor_p1", text: "Repeatedly picking at skin causing sores or scarring?", disorders: ["excoriation"] },
  { id: "excor_d1", text: "Urges to pick that are hard to resist?", disorders: ["excoriation"] },
  { id: "excor_d2", text: "Picking causes distress or you try to stop but cannot?", disorders: ["excoriation"] },
  { id: "ied_p1", text: "Sudden aggressive outbursts (verbal or physical) out of proportion to the situation?", disorders: ["ied"] },
  { id: "ied_d1", text: "Feeling relief or release during the outburst?", disorders: ["ied"] },
  { id: "ied_d2", text: "Regret afterward but difficulty preventing future outbursts?", disorders: ["ied"] },

  // Stress & somatic
  { id: "adjustment_p1", text: "Emotional or behavioral symptoms within 3 months of a major stressor (job loss, breakup, move)?", disorders: ["adjustment"] },
  { id: "adjustment_d1", text: "Symptoms are more intense than expected for the situation?", disorders: ["adjustment"] },
  { id: "adjustment_d2", text: "Significant trouble at work, school, or relationships because of it?", disorders: ["adjustment"] },
  { id: "somatic_p1", text: "Distressing physical symptoms (pain, fatigue, GI) with excessive health worry?", disorders: ["somatic"] },
  { id: "somatic_d1", text: "Devoting excessive time and energy to symptoms or health concerns?", disorders: ["somatic"] },
  { id: "somatic_d2", text: "Normal test results do not ease your concern?", disorders: ["somatic"] },
  { id: "illness_anxiety_p1", text: "Preoccupation with having or getting a serious illness?", disorders: ["illness_anxiety"] },
  { id: "illness_anxiety_d1", text: "High anxiety about health with little or no physical symptoms?", disorders: ["illness_anxiety"] },
  { id: "illness_anxiety_d2", text: "Excessive checking, researching symptoms, or seeking reassurance?", disorders: ["illness_anxiety"] },
  { id: "dissociative_p1", text: "Feeling detached from yourself, your body, or reality (as if in a dream)?", disorders: ["dissociative"] },
  { id: "dissociative_d1", text: "Gaps in memory for everyday events or personal information?", disorders: ["dissociative"] },
  { id: "dissociative_d2", text: "Feeling like an outside observer of your own thoughts or actions?", disorders: ["dissociative"] },
];

export function primaryQuestions(): Question[] {
  return QUESTIONS.filter((q) => q.id.endsWith("_p1"));
}

export function deepeningQuestions(disorderId: string): Question[] {
  return QUESTIONS.filter((q) => q.disorders.includes(disorderId) && !q.id.endsWith("_p1"));
}

export function disorderById(id: string): Disorder | undefined {
  return DISORDERS.find((d) => d.id === id);
}

export const CATEGORIES = [...new Set(DISORDERS.map((d) => d.category))];

export function disordersByCategory(category: string): Disorder[] {
  return DISORDERS.filter((d) => d.category === category);
}
