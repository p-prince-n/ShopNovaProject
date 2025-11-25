
import nlp from "compromise";

export function parseUserQuery(message, categories = [], cities = [], weatherTypes = []) {
  let filters = {};
  const doc = nlp(message);


  const budgetMatch = message.match(/(?:₹|rs\.?|under)\s?(\d+)/i);
  if (budgetMatch) filters.price = { $lte: parseInt(budgetMatch[1]) };


  const categoryMatch = categories.find(c =>
    message.toLowerCase().includes(c.name.toLowerCase())
  );
  if (categoryMatch) filters.categories = categoryMatch._id;


  const cityMatch = cities.find(c => message.toLowerCase().includes(c.toLowerCase()));
  if (cityMatch) filters.famousInCities = cityMatch;


  const weatherMatch = weatherTypes.find(w => message.toLowerCase().includes(w.toLowerCase()));
  if (weatherMatch) filters.weatherTags = weatherMatch;


  const keywords = doc.nouns().out("array").concat(doc.verbs().out("array"));
  if (keywords.length) {
    filters.$or = [
      { name: new RegExp(keywords.join("|"), "i") },
      { description: new RegExp(keywords.join("|"), "i") }
    ];
  }

  return filters;
}
