export const getPastRandomDate = (): string => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const twoYearsAgo = currentYear - 2;
  const randomYear = Math.floor(Math.random() * 2) + twoYearsAgo;
  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 28) + 1;
  const randomDate = new Date(randomYear, randomMonth, randomDay);
  return randomDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}