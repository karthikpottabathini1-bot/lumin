export interface Question {
  id: string;
  question: string;
  field: string;
}

export function generateFollowUps(request: string): Question[] {
  const lower = request.toLowerCase();

  const questions: Question[] = [];

  // Always ask these
  questions.push({
    id: 'q_purpose',
    question: "Great idea! Can you describe what problem this solves for you?",
    field: 'purpose',
  });

  if (lower.includes('dark') || lower.includes('theme') || lower.includes('color') || lower.includes('light') || lower.includes('mode')) {
    questions.push({
      id: 'q_theme_elements',
      question: "Which specific parts should change? (e.g., background, text, buttons, all of it?)",
      field: 'theme_elements',
    });
  }

  if (lower.includes('export') || lower.includes('csv') || lower.includes('download') || lower.includes('backup')) {
    questions.push({
      id: 'q_export_format',
      question: "What format should the export be in? CSV, JSON, or PDF?",
      field: 'export_format',
    });
  }

  if (lower.includes('streak') || lower.includes('badge') || lower.includes('achievement') || lower.includes('reward')) {
    questions.push({
      id: 'q_streak_type',
      question: "What kind of achievement system are you thinking? Streak milestones, level badges, or something else?",
      field: 'streak_type',
    });
  }

  if (lower.includes('widget') || lower.includes('ios') || lower.includes('android') || lower.includes('mobile') || lower.includes('app')) {
    questions.push({
      id: 'q_platform',
      question: "Which platform? iOS widget, Android widget, or both?",
      field: 'platform',
    });
  }

  if (lower.includes('onboard') || lower.includes('tutorial') || lower.includes('guide') || lower.includes('help') || lower.includes('walkthrough')) {
    questions.push({
      id: 'q_onboarding_type',
      question: "What kind of onboarding would help? Interactive walkthrough, video tutorial, or tooltips?",
      field: 'onboarding_type',
    });
  }

  if (lower.includes('chart') || lower.includes('graph') || lower.includes('analytics') || lower.includes('stat') || lower.includes('report') || lower.includes('insight')) {
    questions.push({
      id: 'q_chart_type',
      question: "What metrics matter most? Daily streaks, weekly trends, habit completion rates, or all of the above?",
      field: 'chart_type',
    });
  }

  if (lower.includes('notification') || lower.includes('remind') || lower.includes('alert') || lower.includes('push') || lower.includes('notify')) {
    questions.push({
      id: 'q_notification_time',
      question: "When would you like reminders? Morning, evening, custom time, or all of them?",
      field: 'notification_time',
    });
  }

  if (lower.includes('share') || lower.includes('social') || lower.includes('friend') || lower.includes('community') || lower.includes('collab')) {
    questions.push({
      id: 'q_share_type',
      question: "What kind of sharing? Share streaks, compete with friends, or community challenges?",
      field: 'share_type',
    });
  }

  // Generic follow-up if nothing specific matched
  if (questions.length <= 1) {
    questions.push({
      id: 'q_details',
      question: "Can you tell me more about how you'd like this to work? Any specific examples?",
      field: 'details',
    });
  }

  return questions;
}
