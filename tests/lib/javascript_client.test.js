/**
 * MCP-L JavaScript Client Library Tests
 * Following Semantic Seed Coding Standards with BDD-style testing
 */

const MCPLClient = require('../../lib/javascript/mcpl-client');

describe('JavaScript Client Library', () => {
  
  describe('MessageBuilder', () => {
    let messageBuilder;
    
    beforeEach(() => {
      messageBuilder = new MCPLClient.MessageBuilder();
    });
    
    it('should initialize with empty behavior tags', () => {
      expect(messageBuilder.message).toEqual({ behavior_tags: {} });
    });
    
    it('should add sentiment analysis', () => {
      messageBuilder.addSentiment('frustrated', 0.9);
      
      expect(messageBuilder.message.behavior_tags.sentiment).toEqual({
        detected: 'frustrated',
        confidence: 0.9
      });
    });
    
    it('should add sentiment without confidence', () => {
      messageBuilder.addSentiment('neutral');
      
      expect(messageBuilder.message.behavior_tags.sentiment).toEqual({
        detected: 'neutral'
      });
      expect(messageBuilder.message.behavior_tags.sentiment.confidence).toBeUndefined();
    });
    
    it('should add mirror intent', () => {
      const mirrorText = "I understand you want to create a new feature";
      messageBuilder.addMirrorIntent(mirrorText, 0.85);
      
      expect(messageBuilder.message.behavior_tags.mirror_intent).toEqual({
        mirrored_text: mirrorText,
        confidence: 0.85
      });
    });
    
    it('should add mirror intent without confidence', () => {
      const mirrorText = "I understand you want to create a new feature";
      messageBuilder.addMirrorIntent(mirrorText);
      
      expect(messageBuilder.message.behavior_tags.mirror_intent).toEqual({
        mirrored_text: mirrorText
      });
      expect(messageBuilder.message.behavior_tags.mirror_intent.confidence).toBeUndefined();
    });
    
    it('should add clarify before execute with all options', () => {
      const prompt = "Do you want to proceed with this action?";
      messageBuilder.addClarifyBeforeExecute(true, prompt, ['Yes', 'No']);
      
      expect(messageBuilder.message.behavior_tags.clarify_before_execute).toEqual({
        required: true,
        clarification_prompt: prompt,
        options: ['Yes', 'No']
      });
    });
    
    it('should add clarify before execute with minimal options', () => {
      messageBuilder.addClarifyBeforeExecute(false);
      
      expect(messageBuilder.message.behavior_tags.clarify_before_execute).toEqual({
        required: false
      });
      expect(messageBuilder.message.behavior_tags.clarify_before_execute.clarification_prompt).toBeUndefined();
      expect(messageBuilder.message.behavior_tags.clarify_before_execute.options).toBeUndefined();
    });
    
    it('should add follow-up required with items', () => {
      const followUpItems = ['Check results', 'Update documentation'];
      messageBuilder.addFollowUpRequired(true, followUpItems);
      
      expect(messageBuilder.message.behavior_tags.follow_up_required).toEqual({
        required: true,
        follow_up_items: followUpItems
      });
    });
    
    it('should add follow-up required without items', () => {
      messageBuilder.addFollowUpRequired(false);
      
      expect(messageBuilder.message.behavior_tags.follow_up_required).toEqual({
        required: false
      });
      expect(messageBuilder.message.behavior_tags.follow_up_required.follow_up_items).toBeUndefined();
    });
    
    it('should add suggested tone with explanation', () => {
      messageBuilder.addSuggestedTone('empathetic', 'User seems frustrated');
      
      expect(messageBuilder.message.behavior_tags.suggested_tone).toEqual({
        tone: 'empathetic',
        explanation: 'User seems frustrated'
      });
    });
    
    it('should add suggested tone without explanation', () => {
      messageBuilder.addSuggestedTone('technical');
      
      expect(messageBuilder.message.behavior_tags.suggested_tone).toEqual({
        tone: 'technical'
      });
      expect(messageBuilder.message.behavior_tags.suggested_tone.explanation).toBeUndefined();
    });
    
    it('should add agent feedback with full data', () => {
      const contextUpdate = "User prefers detailed explanations";
      const userPreferences = { codeStyle: 'functional', verbosityLevel: 'high' };
      
      messageBuilder.addAgentFeedback(contextUpdate, userPreferences);
      
      expect(messageBuilder.message.behavior_tags.agent_feedback).toEqual({
        context_update: contextUpdate,
        user_preferences: userPreferences
      });
    });
    
    it('should add agent feedback with only context update', () => {
      const contextUpdate = "User prefers detailed explanations";
      
      messageBuilder.addAgentFeedback(contextUpdate);
      
      expect(messageBuilder.message.behavior_tags.agent_feedback).toEqual({
        context_update: contextUpdate
      });
      expect(messageBuilder.message.behavior_tags.agent_feedback.user_preferences).toBeUndefined();
    });
    
    it('should add agent feedback with only user preferences', () => {
      const userPreferences = { codeStyle: 'functional', verbosityLevel: 'high' };
      
      messageBuilder.addAgentFeedback(undefined, userPreferences);
      
      expect(messageBuilder.message.behavior_tags.agent_feedback).toEqual({
        user_preferences: userPreferences
      });
      expect(messageBuilder.message.behavior_tags.agent_feedback.context_update).toBeUndefined();
    });
    
    it('should add SSCS compliance information', () => {
      messageBuilder.addSSCSCompliance('feature', 'green', 'PR Review');
      
      expect(messageBuilder.message.sscs_compliance).toEqual({
        story_type: 'feature',
        tdd_phase: 'green',
        workflow_step: 'PR Review'
      });
    });
    
    it('should add partial SSCS compliance information', () => {
      messageBuilder.addSSCSCompliance('bug');
      
      expect(messageBuilder.message.sscs_compliance).toEqual({
        story_type: 'bug'
      });
      expect(messageBuilder.message.sscs_compliance.tdd_phase).toBeUndefined();
    });
    
    it('should handle undefined values in SSCS compliance', () => {
      messageBuilder.addSSCSCompliance(undefined, undefined, undefined);
      
      expect(messageBuilder.message.sscs_compliance).toEqual({});
    });
    
    it('should build a complete message with all tags', () => {
      messageBuilder
        .addSentiment('frustrated', 0.9)
        .addMirrorIntent('I understand you want to create a new feature', 0.85)
        .addClarifyBeforeExecute(true, 'Do you want to proceed?')
        .addFollowUpRequired(true, ['Check tests', 'Update docs'])
        .addSuggestedTone('empathetic', 'User seems frustrated')
        .addAgentFeedback('User prefers clear examples', { verbosity: 'high' })
        .addSSCSCompliance('feature', 'red', 'In Progress');
        
      const message = messageBuilder.build();
      
      expect(message).toHaveProperty('behavior_tags.sentiment');
      expect(message).toHaveProperty('behavior_tags.mirror_intent');
      expect(message).toHaveProperty('behavior_tags.clarify_before_execute');
      expect(message).toHaveProperty('behavior_tags.follow_up_required');
      expect(message).toHaveProperty('behavior_tags.suggested_tone');
      expect(message).toHaveProperty('behavior_tags.agent_feedback');
      expect(message).toHaveProperty('sscs_compliance');
      
      // Verify this is a new object (not a reference)
      expect(message).not.toBe(messageBuilder.message);
    });
  });
  
  describe('Validator', () => {
    let validator;
    let customValidator;
    
    beforeEach(() => {
      validator = new MCPLClient.Validator();
    });
    
    it('should validate a correct message', () => {
      const message = {
        behavior_tags: {
          sentiment: {
            detected: 'neutral',
            confidence: 0.7
          }
        }
      };
      
      expect(validator.validate(message)).toBe(true);
      expect(validator.errors).toBeNull();
    });
    
    it('should handle loading a custom schema path', () => {
      // Mock implementation that doesn't actually load a file
      jest.spyOn(require('fs'), 'readFileSync').mockImplementationOnce(() => {
        return JSON.stringify({
          "$schema": "http://json-schema.org/draft-07/schema#",
          "title": "Test Schema"
        });
      });
      
      // This should not throw an error
      const customValidator = new MCPLClient.Validator('./custom/path.json');
      expect(customValidator).toBeDefined();
    });
    
    it('should handle schema loading errors', () => {
      jest.spyOn(require('fs'), 'readFileSync').mockImplementationOnce(() => {
        throw new Error('File read error');
      });
      
      expect(() => new MCPLClient.Validator('./bad/path.json')).toThrow('Failed to load MCP-L schema');
    });
    
    it('should handle invalid JSON in schema file', () => {
      jest.spyOn(require('fs'), 'readFileSync').mockImplementationOnce(() => {
        return '{ invalid: json }';
      });
      
      expect(() => new MCPLClient.Validator('./invalid.json')).toThrow('Failed to load MCP-L schema');
    });
    
    it('should reject an invalid message', () => {
      const message = {
        behavior_tags: {
          sentiment: {
            detected: 'invalid_sentiment', // Invalid value
            confidence: 0.7
          }
        }
      };
      
      expect(validator.validate(message)).toBe(false);
      expect(validator.errors).not.toBeNull();
    });
    
    it('should provide helpful error messages', () => {
      const message = {
        behavior_tags: {
          sentiment: {
            detected: 'invalid_sentiment', // Invalid value
            confidence: 0.7
          }
        }
      };
      
      validator.validate(message);
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(errorMessages[0]).toContain('sentiment.detected');
    });
    
    it('should handle different error path structures', () => {
      // Mock the validator.errors to test various path formats
      validator.validate = jest.fn().mockReturnValue(false);
      validator.errors = [
        { instancePath: '/', message: 'Root level error' },
        { instancePath: '/non_standard_path', message: 'Non-standard path error' },
        { instancePath: '/behavior_tags/other/field', message: 'Other field error' }
      ];
      
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages.length).toBe(3);
      expect(errorMessages[0]).toBe('/: Root level error');
      expect(errorMessages[1]).toBe('/non_standard_path: Non-standard path error');
      expect(errorMessages[2]).toBe('other.field: Other field error');
    });
    
    it('should handle errors with sub-paths beyond two levels', () => {
      // Test cases where the regex path matcher handles multi-level paths
      validator.validate = jest.fn().mockReturnValue(false);
      validator.errors = [
        { instancePath: '/behavior_tags/sentiment/detected/sub_field', message: 'Deep nested error' },
        { instancePath: '/behavior_tags/mirror_intent/mirrored_text/0', message: 'Array index error' }
      ];
      
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages.length).toBe(2);
      // The regex extracts the second and third level of the path
      expect(errorMessages[0]).toBe('sentiment.detected/sub_field: Deep nested error');
      expect(errorMessages[1]).toBe('mirror_intent.mirrored_text/0: Array index error');
    });
    
    it('should properly format paths with non-standard behavior tag structures', () => {
      // Test for edge case regex branch coverage with paths that don't match the standard pattern
      validator.validate = jest.fn().mockReturnValue(false);
      validator.errors = [
        // Non-standard path that doesn't match the main regex pattern but still needs formatting
        { instancePath: '/behavior_tags/complex-tag-name', message: 'Invalid tag structure' },
        // Path with slashes that would confuse the regex without proper boundaries
        { instancePath: '/behavior_tags/tag/with/multiple/slashes', message: 'Multiple slashes' },
        // Path with numbers in tag names to test regex boundaries
        { instancePath: '/behavior_tags/tag123/prop456', message: 'Numeric components' }
      ];
      
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages.length).toBe(3);
      // These should test all branches of the regex replacement logic in line 205
      expect(errorMessages[0]).toBe('/behavior_tags/complex-tag-name: Invalid tag structure');
      expect(errorMessages[1]).toBe('tag.with/multiple/slashes: Multiple slashes');
      expect(errorMessages[2]).toBe('tag123.prop456: Numeric components');
    });
    
    // This test specifically targets the regex branch in line 205 for 100% coverage
    it('should handle special edge cases in error path formatting', () => {
      validator.validate = jest.fn().mockReturnValue(false);
      
      // Create test cases designed to hit all regex branches
      validator.errors = [
        // A path that matches precisely the target regex pattern with specific capture groups
        { instancePath: '/behavior_tags/special_tag/property', message: 'Pattern error' },
        // A path that should trigger the boundary conditions of the regex
        { instancePath: '/behavior_tagsX/not_matched', message: 'Non-matching path' },
        // A path with extra segments that should or shouldn't match
        { instancePath: '/behavior_tags/tag/prop/extra', message: 'Extra segments' }
      ];
      
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages.length).toBe(3);
      expect(errorMessages[0]).toBe('special_tag.property: Pattern error');
      expect(errorMessages[1]).toBe('/behavior_tagsX/not_matched: Non-matching path');
      expect(errorMessages[2]).toBe('tag.prop/extra: Extra segments');
    });
    
    it('should test all regex pattern branches in error formatting', () => {
      // Direct test for the regex pattern in line 205
      const getFormattedPath = path => {
        // Extracted the exact regex from the code for targeted testing
        return path.replace(/^\/behavior_tags\/([^\/]+)\/([\w]+)/, '$1.$2');
      };
      
      // Testing various edge cases to hit all regex branches
      expect(getFormattedPath('/behavior_tags/sentiment/detected')).toBe('sentiment.detected');
      expect(getFormattedPath('/behavior_tags/tag/')).toBe('/behavior_tags/tag/'); // No second capture group
      expect(getFormattedPath('/behavior_tags/tag123/prop_456')).toBe('tag123.prop_456'); // With numbers and underscore
      expect(getFormattedPath('/Behavior_tags/tag/prop')).toBe('/Behavior_tags/tag/prop'); // Case sensitive match
      
      // Create a direct mock of the validator's error formatting method
      const errorWithPath = path => ({
        instancePath: path, 
        message: 'Test error'
      });
      
      validator.errors = [
        errorWithPath('/behavior_tags/sentiment/detected'),
        errorWithPath('/behavior_tags/tag/'),
        errorWithPath('/behavior_tags/with-dash/prop'),
        errorWithPath('/behavior_tags//empty_segment')
      ];
      
      const messages = validator.getErrorMessages();
      expect(messages.length).toBe(4);
      expect(messages[0]).toBe('sentiment.detected: Test error');
      // The following cases test regex boundaries and character class handling
      expect(messages[1]).toBe('/behavior_tags/tag/: Test error'); // No second segment
      expect(messages[2]).toBe('with-dash.prop: Test error'); // With dash in name
      expect(messages[3]).toBe('/behavior_tags//empty_segment: Test error'); // Empty segment
    });
    
    it('should return empty array for error messages when no errors', () => {
      const message = {
        behavior_tags: {
          sentiment: {
            detected: 'neutral',
            confidence: 0.7
          }
        }
      };
      
      validator.validate(message);
      const errorMessages = validator.getErrorMessages();
      
      expect(errorMessages).toEqual([]);
    });
    
    it('should return schema version', () => {
      const version = validator.getSchemaVersion();
      expect(typeof version).toBe('string');
    });
  });
});
