/**
 * Integration tests for the MCP-L middleware components
 * Following BDD-style test format per Semantic Seed Coding Standards
 */
const MessageBuilder = require('../../lib/javascript/mcpl-client').MessageBuilder;
const SentimentAnalyzer = require('../../lib/middleware/sentiment/analyzer');

describe('Middleware Integration', () => {
  describe('Sentiment Analysis with MessageBuilder', () => {
    let messageBuilder;
    let sentimentAnalyzer;

    beforeEach(() => {
      messageBuilder = new MessageBuilder();
      sentimentAnalyzer = new SentimentAnalyzer();
    });

    it('should process message builder output correctly', () => {
      // Create a message with MessageBuilder
      messageBuilder.message.content = 'I really like this product, it works great!';
      const message = messageBuilder
        .addMirrorIntent('I like this product')
        .addFollowUpRequired(false)
        .build();

      // Process with sentiment analyzer
      const processedMessage = sentimentAnalyzer.analyze(message);

      // Verify sentiment was added correctly
      expect(processedMessage.behavior_tags.sentiment).toBeDefined();
      expect(processedMessage.behavior_tags.sentiment.detected).toBe('positive');
      
      // Verify original behavior tags are preserved
      expect(processedMessage.behavior_tags.mirror_intent.mirrored_text).toBe('I like this product');
      expect(processedMessage.behavior_tags.follow_up_required.required).toBe(false);
    });

    it('should not overwrite explicit sentiment', () => {
      // Create a message with explicit sentiment via MessageBuilder
      messageBuilder.message.content = 'This is awful!';
      const message = messageBuilder
        .addSentiment('surprise', 0.85)
        .build();

      // Process with sentiment analyzer
      const processedMessage = sentimentAnalyzer.analyze(message);

      // Verify original sentiment is preserved
      expect(processedMessage.behavior_tags.sentiment.detected).toBe('surprise');
      expect(processedMessage.behavior_tags.sentiment.confidence).toBe(0.85);
    });

    it('should detect frustration in complex messages', () => {
      // Create a more complex message with multiple sentiment indicators
      messageBuilder.message.content = "I've told you multiple times that this doesn't work correctly! Please fix it already.";
      const message = messageBuilder
        .addClarifyBeforeExecute(true)
        .build();

      // Process with sentiment analyzer
      const processedMessage = sentimentAnalyzer.analyze(message);

      // Verify frustration sentiment was detected
      expect(processedMessage.behavior_tags.sentiment).toBeDefined();
      expect(processedMessage.behavior_tags.sentiment.detected).toBe('frustration');
      expect(processedMessage.behavior_tags.sentiment.confidence).toBeGreaterThan(0.7);
      
      // Verify original behavior tags are preserved
      expect(processedMessage.behavior_tags.clarify_before_execute.required).toBe(true);
    });

    it('should work with multiple middleware processors in sequence', () => {
      // Create a basic message
      messageBuilder.message.content = 'Can you please help me with this issue?';
      const message = messageBuilder
        .build();

      // First middleware - add sentiment
      const withSentiment = sentimentAnalyzer.analyze(message);
      expect(withSentiment.behavior_tags.sentiment).toBeDefined();
      
      // Mock second middleware - adds a follow-up tag
      const mockFollowUpMiddleware = {
        process: (msg) => {
          const result = JSON.parse(JSON.stringify(msg));
          if (!result.behavior_tags) {
            result.behavior_tags = {};
          }
          result.behavior_tags.follow_up_required = { detected: true };
          return result;
        }
      };
      
      // Apply second middleware
      const finalMessage = mockFollowUpMiddleware.process(withSentiment);
      
      // Verify both middleware effects are present
      expect(finalMessage.behavior_tags.sentiment).toBeDefined();
      expect(finalMessage.behavior_tags.follow_up_required).toBeDefined();
      expect(finalMessage.behavior_tags.follow_up_required.detected).toBe(true);
    });
  });
});
