/**
 * MCP-L JavaScript Client Library
 * Following Semantic Seed Coding Standards with TDD approach
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

/**
 * MessageBuilder class for creating MCP-L protocol messages
 */
class MessageBuilder {
  /**
   * Initialize a new MCP-L message builder
   */
  constructor() {
    this.message = { behavior_tags: {} };
  }

  /**
   * Add sentiment analysis data to the message
   * @param {string} sentiment - Detected sentiment (e.g., 'frustrated', 'excited', 'neutral')
   * @param {number} [confidence] - Optional confidence score (0.0 to 1.0)
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addSentiment(sentiment, confidence) {
    const sentimentData = { detected: sentiment };
    if (confidence !== undefined) {
      sentimentData.confidence = confidence;
    }
    
    this.message.behavior_tags.sentiment = sentimentData;
    return this;
  }

  /**
   * Add mirroring of user intent to confirm understanding
   * @param {string} mirroredText - A rephrasing of the user's intent
   * @param {number} [confidence] - Optional confidence score (0.0 to 1.0)
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addMirrorIntent(mirroredText, confidence) {
    const mirrorData = { mirrored_text: mirroredText };
    if (confidence !== undefined) {
      mirrorData.confidence = confidence;
    }
    
    this.message.behavior_tags.mirror_intent = mirrorData;
    return this;
  }

  /**
   * Add clarification requirements before execution
   * @param {boolean} required - Whether clarification is required
   * @param {string} [clarificationPrompt] - Optional prompt to ask for clarification
   * @param {string[]} [options] - Optional list of clarification options
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addClarifyBeforeExecute(required, clarificationPrompt, options) {
    const clarifyData = { required };
    if (clarificationPrompt !== undefined) {
      clarifyData.clarification_prompt = clarificationPrompt;
    }
    if (options !== undefined) {
      clarifyData.options = options;
    }
    
    this.message.behavior_tags.clarify_before_execute = clarifyData;
    return this;
  }

  /**
   * Add follow-up requirements after execution
   * @param {boolean} required - Whether follow-up is required
   * @param {string[]} [followUpItems] - Optional list of follow-up items or questions
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addFollowUpRequired(required, followUpItems) {
    const followUpData = { required };
    if (followUpItems !== undefined) {
      followUpData.follow_up_items = followUpItems;
    }
    
    this.message.behavior_tags.follow_up_required = followUpData;
    return this;
  }

  /**
   * Add suggested tone for agent responses
   * @param {string} tone - Suggested tone (e.g., 'empathetic', 'technical')
   * @param {string} [explanation] - Optional explanation for the suggested tone
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addSuggestedTone(tone, explanation) {
    const toneData = { tone };
    if (explanation !== undefined) {
      toneData.explanation = explanation;
    }
    
    this.message.behavior_tags.suggested_tone = toneData;
    return this;
  }

  /**
   * Add agent feedback about the interaction
   * @param {string} [contextUpdate] - Optional context updates for future interactions
   * @param {Object} [userPreferences] - Optional learned user preferences
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addAgentFeedback(contextUpdate, userPreferences) {
    // Always create the object to match test expectations
    this.message.behavior_tags.agent_feedback = {};
    
    if (contextUpdate !== undefined) {
      this.message.behavior_tags.agent_feedback.context_update = contextUpdate;
    }
    if (userPreferences !== undefined) {
      this.message.behavior_tags.agent_feedback.user_preferences = userPreferences;
    }
    
    return this;
  }

  /**
   * Add Semantic Seed Coding Standards compliance information
   * @param {string} [storyType] - Optional story type ('feature', 'bug', 'chore')
   * @param {string} [tddPhase] - Optional TDD phase ('red', 'green', 'refactor')
   * @param {string} [workflowStep] - Optional workflow step
   * @returns {MessageBuilder} - Self reference for method chaining
   */
  addSSCSCompliance(storyType, tddPhase, workflowStep) {
    // Always create the object to match test expectations
    this.message.sscs_compliance = {};
    
    if (storyType !== undefined) {
      this.message.sscs_compliance.story_type = storyType;
    }
    if (tddPhase !== undefined) {
      this.message.sscs_compliance.tdd_phase = tddPhase;
    }
    if (workflowStep !== undefined) {
      this.message.sscs_compliance.workflow_step = workflowStep;
    }
    
    return this;
  }

  /**
   * Build and return the complete MCP-L message
   * @returns {Object} - The constructed MCP-L message
   */
  build() {
    return { ...this.message };
  }
}

/**
 * Validator class for validating MCP-L messages
 */
class Validator {
  /**
   * Initialize a new MCP-L validator
   * @param {string} [schemaPath] - Optional path to custom schema
   */
  constructor(schemaPath) {
    this.ajv = new Ajv({ 
      allErrors: true, 
      strict: false,  // Disable strict mode to allow custom keywords
      allowUnionTypes: true
    });
    this.errors = null;
    
    // Load the schema
    try {
      const resolvedPath = schemaPath || path.resolve(__dirname, '../../schema/mcp-l-schema.json');
      this.schema = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      this.validateFn = this.ajv.compile(this.schema);
    } catch (error) {
      throw new Error(`Failed to load MCP-L schema: ${error.message}`);
    }
  }

  /**
   * Validate a message against the MCP-L schema
   * @param {Object} message - The message to validate
   * @returns {boolean} - Whether the message is valid
   */
  validate(message) {
    const isValid = this.validateFn(message);
    this.errors = this.validateFn.errors;
    return isValid;
  }

  /**
   * Get formatted error messages from the last validation
   * @returns {string[]} - Array of formatted error messages
   */
  getErrorMessages() {
    if (!this.errors) return [];
    
    return this.errors.map(error => {
      // Format the path to match the expected format in tests
      // e.g. convert '/behavior_tags/sentiment/detected' to 'sentiment.detected'
      const path = error.instancePath || '/';
      const formattedPath = path.replace(/^\/behavior_tags\/([^\/]+)\/(\w+)/, '$1.$2');
      return `${formattedPath}: ${error.message}`;
    });
  }

  /**
   * Get the current schema version
   * @returns {string} - The schema version
   */
  getSchemaVersion() {
    return this.schema.version;
  }
}

module.exports = {
  MessageBuilder,
  Validator
};
