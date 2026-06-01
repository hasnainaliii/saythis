const avatars = [
  require("../assets/images/avatar/Preview-1.png"),
  require("../assets/images/avatar/Preview-2.png"),
  require("../assets/images/avatar/Preview-3.png"),
  require("../assets/images/avatar/Preview-4.png"),
  require("../assets/images/avatar/Preview-5.png"),
  require("../assets/images/avatar/Preview-6.png"),
  require("../assets/images/avatar/Preview-7.png"),
  require("../assets/images/avatar/Preview-8.png"),
  require("../assets/images/avatar/Preview.png"),
];

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getDefaultAvatar = (identifier?: string) => {
  if (!identifier) {
    return avatars[0];
  }
  const index = hashString(identifier) % avatars.length;
  return avatars[index];
};
