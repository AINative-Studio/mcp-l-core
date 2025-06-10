/**
 * Tests for the Sentiment Analysis Middleware
 * Following BDD-style test format per Semantic Seed Coding Standards
 */
const SentimentAnalyzer = require('../../lib/middleware/sentiment/analyzer');

describe('Sentiment Analysis Middleware', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new SentimentAnalyzer();
  });

  describe('Basic sentiment detection', () => {
    it('should detect positive sentiment', () => {
      const message = {
        content: "I'm really happy with this product, it works great!",
        behavior_tags: {}
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBe('positive');
      expect(result.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
    });

    it('should detect negative sentiment', () => {
      const message = {
        content: "This is terrible, I'm very disappointed and frustrated.",
        behavior_tags: {}
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBe('negative');
      expect(result.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
    });

    it('should detect neutral sentiment', () => {
      const message = {
        content: "Here is the information you requested about the product.",
        behavior_tags: {}
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBe('neutral');
      expect(result.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
    });

    it('should detect frustration', () => {
      const message = {
        content: "I've told you multiple times already and it still doesn't work!",
        behavior_tags: {}
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBe('frustration');
      expect(result.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
    });

    it('should detect excitement', () => {
      const message = {
        content: "Wow! This is amazing! I can't believe how well it works!",
        behavior_tags: {}
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBe('excitement');
      expect(result.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Edge cases and special conditions', () => {
    it('should handle null or undefined content', () => {
      const analyzer = new SentimentAnalyzer();
      
      const message1 = { content: null, behavior_tags: {} };
      const result1 = analyzer.analyze(message1);
      expect(result1.behavior_tags.sentiment.detected).toBe('neutral');
      expect(result1.behavior_tags.sentiment.confidence).toBe(1.0);
      
      const message2 = { behavior_tags: {} }; // missing content
      const result2 = analyzer.analyze(message2);
      expect(result2.behavior_tags.sentiment.detected).toBe('neutral');
    });
    
    it('should handle non-string content', () => {
      const analyzer = new SentimentAnalyzer();
      
      const message = { content: 123, behavior_tags: {} };
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment.detected).toBe('neutral');
    });
    
    it('should handle empty string content', () => {
      const analyzer = new SentimentAnalyzer();
      
      const message = { content: '', behavior_tags: {} };
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment.detected).toBe('neutral');
    });

    it('should correctly count exclamation marks for excitement detection', () => {
      const analyzer = new SentimentAnalyzer();
      
      // Test with multiple exclamation marks
      const message = { content: 'This is great!! So happy!!!', behavior_tags: {} };
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment.detected).toBe('excitement');
    });

    it('should detect frustration from specific patterns', () => {
      const analyzer = new SentimentAnalyzer();
      
      const message1 = { content: 'I already told you this doesn\'t work', behavior_tags: {} };
      const result1 = analyzer.analyze(message1);
      expect(result1.behavior_tags.sentiment.detected).toBe('frustration');
      
      const message2 = { content: 'This still doesn\'t work properly', behavior_tags: {} };
      const result2 = analyzer.analyze(message2);
      expect(result2.behavior_tags.sentiment.detected).toBe('frustration');
    });
    
    it('should normalize score based on word count', () => {
      const analyzer = new SentimentAnalyzer();
      
      // Short message with strong sentiment
      const shortMessage = { content: 'Fantastic!', behavior_tags: {} };
      const shortResult = analyzer.analyze(shortMessage);
      
      // Longer message with same sentiment words but diluted by neutral words
      const longMessage = { 
        content: 'This product has some fantastic features but there are also many aspects that could be considered just standard and not particularly remarkable in any way.', 
        behavior_tags: {} 
      };
      const longResult = analyzer.analyze(longMessage);
      
      // Short message should have higher confidence due to normalization
      expect(shortResult.behavior_tags.sentiment.confidence)
        .toBeGreaterThan(longResult.behavior_tags.sentiment.confidence);
    });
    
    it('should handle the special case where wordCount is 0', () => {
      const analyzer = new SentimentAnalyzer();
      
      // Create a message with no actual words, just symbols
      const message = { content: '!!!---???...', behavior_tags: {} };
      const result = analyzer.analyze(message);
      
      // Should not throw an error and should return a sentiment
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.sentiment.detected).toBeDefined();
    });
  });

  describe('Middleware integration', () => {
    it('should preserve existing behavior tags', () => {
      const message = {
        content: "I'm happy with the product.",
        behavior_tags: {
          mirror_intent: { detected: true },
          follow_up_required: { detected: false }
        }
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toBeDefined();
      expect(result.behavior_tags.mirror_intent).toEqual({ detected: true });
      expect(result.behavior_tags.follow_up_required).toEqual({ detected: false });
    });

    it('should not overwrite existing sentiment data', () => {
      const message = {
        content: "I'm happy with the product.",
        behavior_tags: {
          sentiment: { detected: 'custom_sentiment', confidence: 0.95 }
        }
      };
      
      const result = analyzer.analyze(message);
      expect(result.behavior_tags.sentiment).toEqual({ detected: 'custom_sentiment', confidence: 0.95 });
    });
  });

  describe('Configuration options', () => {
    it('should use custom confidence thresholds', () => {
      const analyzer = new SentimentAnalyzer({ confidenceThreshold: 0.9 });
      
      // This would normally be detected as positive with default threshold
      const message = { content: 'This is somewhat good', behavior_tags: {} };
      const result = analyzer.analyze(message);
      
      // With high threshold, should fall back to neutral
      expect(result.behavior_tags.sentiment.detected).toBe('neutral');
    });

    it('should support custom sentiment dictionary', () => {
      // Add custom terms to the dictionary
      const analyzer = new SentimentAnalyzer({ 
        customDictionary: { 
          'specialized_term': 1.8,
          'domain_specific_negative': -1.7
        }
      });
      
      // Test custom positive term detection
      const message1 = { content: 'This contains a specialized_term that should be highly positive', behavior_tags: {} };
      const result1 = analyzer.analyze(message1);
      expect(result1.behavior_tags.sentiment.detected).toBe('positive');
      expect(result1.behavior_tags.sentiment.confidence).toBeGreaterThan(0.8);
      
      // Test custom negative term detection
      const message2 = { content: 'This contains a domain_specific_negative term', behavior_tags: {} };
      const result2 = analyzer.analyze(message2);
      expect(result2.behavior_tags.sentiment.detected).toBe('negative');
      expect(result2.behavior_tags.sentiment.confidence).toBeGreaterThan(0.8);
    });
    
    it('should correctly cap confidence at 0.98', () => {
      const analyzer = new SentimentAnalyzer();
      
      // Create a message with extremely strong sentiment
      const message = { 
        content: 'This is absolutely amazing fantastic spectacular wonderful incredible brilliant awesome excellent!!!', 
        behavior_tags: {} 
      };
      const result = analyzer.analyze(message);
      
      // Confidence should be capped at 0.98
      expect(result.behavior_tags.sentiment.confidence).toBeLessThanOrEqual(0.98);
      expect(result.behavior_tags.sentiment.detected).toBe('excitement');
    });
  });
});
