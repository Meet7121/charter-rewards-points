export const getRewardPoints = async () => {
  const response = await fetch("https://mocki.io/v1/bf0ebf7c-abfb-4017-b140-0d01ed007bc4");
  const data = await response.json();
  console.log("data", data.rewards)
  return data.rewards;
};
