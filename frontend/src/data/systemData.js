import personalData from './personaldata.json';

export const PERSONAL_DATA = personalData;

export const SYSTEM_DATA = {
  version: personalData.system.version,
  osName: personalData.system.osName,
  subtitle: personalData.system.subtitle,
  developer: personalData.developer.name,
  developerDetails: personalData.developer,
  user: personalData.user.name,
  personality: personalData.user.personality,
  personalityTitle: personalData.user.personalityTitle,
  
  bootSequenceLines: personalData.bootSequence,
  
  profile: {
    name: personalData.user.name,
    nickname: personalData.user.nickname,
    handle: personalData.user.handle,
    role: personalData.user.role,
    personality: `${personalData.user.personality} — ${personalData.user.personalityTitle}`,
    traits: personalData.user.traits,
    strengthProtocols: personalData.user.strengthProtocols,
    interests: personalData.user.interests,
    academic: personalData.user.academic,
    systemNotes: personalData.user.systemNotes
  },

  memories: personalData.memories,
  story: personalData.quotes.story,
  quotes: personalData.quotes,
  systemConfig: personalData.system
};
