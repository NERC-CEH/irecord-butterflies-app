function getFormattedDuration(duration: number): string {
  const seconds = new Date(duration).getSeconds();
  const minutes = new Date(duration).getMinutes();
  const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`;
  const formattedMinutes = minutes > 9 ? minutes : `0${minutes}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default getFormattedDuration;
