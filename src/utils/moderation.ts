import {
  RegExpMatcher,
  TextCensor,
  CensorContext,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const asteriskStrategy = (ctx: CensorContext) => "*".repeat(ctx.matchLength);
const censor = new TextCensor().setStrategy(asteriskStrategy);

/**
 * Checks if the input text contains any "profanities"
 */
export function hasProfanity(text: string): boolean {
  return matcher.hasMatch(text);
}

/**
 * Return all instances of offensive words found in text
 */
export function getProfanityMatches(text: string) {
  const matches = matcher.getAllMatches(text);
  return matches.map((match) => {
    const { phraseMetadata, startIndex, endIndex } =
      englishDataset.getPayloadWithPhraseMetadata(match);
    return {
      word: phraseMetadata!.originalWord,
      startIndex,
      endIndex,
    };
  });
}

/**
 * Censors offensive words in text by replacing them with asterisks
 */
export function censorProfanity(text: string): string {
  const matches = matcher.getAllMatches(text);
  return censor.applyTo(text, matches);
}
