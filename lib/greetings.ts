/**
 * Time-based greeting utility
 * Returns appropriate greeting based on current time
 */

export interface GreetingInfo {
  greeting: string;
  emoji: string;
  timeOfDay: 'pagi' | 'siang' | 'sore' | 'malam';
}

export function getTimeBasedGreeting(): GreetingInfo {
  const now = new Date();
  const hour = now.getHours();

  // 05:00 - 10:59 = Pagi (Morning)
  if (hour >= 5 && hour < 11) {
    return {
      greeting: 'Selamat pagi',
      emoji: '🌅',
      timeOfDay: 'pagi',
    };
  }

  // 11:00 - 14:59 = Siang (Afternoon)
  if (hour >= 11 && hour < 15) {
    return {
      greeting: 'Selamat siang',
      emoji: '☀️',
      timeOfDay: 'siang',
    };
  }

  // 15:00 - 18:59 = Sore (Late Afternoon)
  if (hour >= 15 && hour < 19) {
    return {
      greeting: 'Selamat sore',
      emoji: '🌇',
      timeOfDay: 'sore',
    };
  }

  // 19:00 - 04:59 = Malam (Evening/Night)
  return {
    greeting: 'Selamat malam',
    emoji: '🌙',
    timeOfDay: 'malam',
  };
}

/**
 * Format user greeting with name and time-based greeting
 * @param userName - User's name
 * @returns Formatted greeting string
 */
export function getUserGreeting(userName?: string): string {
  const { greeting } = getTimeBasedGreeting();
  const displayName = userName || 'Pengguna';
  return `${greeting}, ${displayName}`;
}

/**
 * Get greeting message with emoji
 * @param userName - User's name
 * @returns Object with greeting, userName, and emoji
 */
export function getFullGreeting(userName?: string): {
  greeting: string;
  userName: string;
  emoji: string;
} {
  const { greeting, emoji } = getTimeBasedGreeting();
  const displayName = userName || 'Pengguna';
  
  return {
    greeting,
    userName: displayName,
    emoji,
  };
}
