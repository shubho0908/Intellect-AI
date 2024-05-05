const natural = require('natural');

// Function to calculate cosine similarity between two text prompts
export function calculateSemanticSimilarity(prompt1, prompt2) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  // Add the prompts to the TF-IDF instance
  tfidf.addDocument(prompt1);
  tfidf.addDocument(prompt2);

  // Get TF-IDF vectors for each prompt
  const vec1 = tfidf.listTerms(0).map(term => term.tfidf);
  const vec2 = tfidf.listTerms(1).map(term => term.tfidf);

  // Function to calculate cosine similarity between two vectors
  const cosineSimilarity = (vec1, vec2) => {
    if (vec1.length === 0 || vec2.length === 0) {
      return 0; // If either vector is empty, there's no similarity
    }

    const dotProduct = vec1.reduce((sum, val, index) => sum + val * (vec2[index] || 0), 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0; // If any magnitude is zero, return zero similarity
    }

    return (dotProduct / (magnitude1 * magnitude2)) * 100; // Return as a percentage
  };

  // Calculate the cosine similarity between the two vectors
  return cosineSimilarity(vec1, vec2);
}

// console.log(`The semantic similarity between the two prompts is: ${similarity.toFixed(2)}%`);
