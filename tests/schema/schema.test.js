/**
 * MCP-L Schema Tests
 * Following Semantic Seed Coding Standards with BDD-style testing
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const yaml = require('yaml');

describe('MCP-L Schema', () => {
  let schema;
  let ajv;
  
  beforeAll(() => {
    // Load the schema
    const schemaPath = path.join(__dirname, '../../schema/mcp-l-schema.json');
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    // Set up validator
    ajv = new Ajv({ strict: false, allowUnionTypes: true });
  });

  describe('schema structure', () => {
    it('should have the correct schema ID', () => {
      expect(schema.$id).toBe('https://ainative.studio/schemas/mcp-l/schema.json');
    });
    
    it('should have the correct version', () => {
      expect(schema.version).toBe('0.1.0');
    });
    
    it('should define behavior tags', () => {
      expect(schema.properties.behavior_tags).toBeDefined();
    });
    
    it('should define sentiment analysis properties', () => {
      expect(schema.properties.behavior_tags.properties.sentiment).toBeDefined();
    });
    
    it('should define mirror intent properties', () => {
      expect(schema.properties.behavior_tags.properties.mirror_intent).toBeDefined();
    });
    
    it('should define clarify before execute properties', () => {
      expect(schema.properties.behavior_tags.properties.clarify_before_execute).toBeDefined();
    });
    
    it('should define follow-up required properties', () => {
      expect(schema.properties.behavior_tags.properties.follow_up_required).toBeDefined();
    });
    
    it('should define suggested tone response properties', () => {
      expect(schema.properties.behavior_tags.properties.suggested_tone).toBeDefined();
    });
  });

  describe('schema validation', () => {
    it('should validate a valid MCP-L message', () => {
      const validMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'frustrated',
            confidence: 0.8
          },
          mirror_intent: {
            mirrored_text: "I understand you want to implement a new feature without breaking existing functionality.",
            confidence: 0.9
          },
          clarify_before_execute: {
            required: true,
            clarification_prompt: "Would you like me to modify all files or just the main module?"
          },
          follow_up_required: {
            required: true,
            follow_up_items: ["Confirm test coverage", "Update documentation"]
          },
          suggested_tone: {
            tone: "empathetic",
            explanation: "User seems frustrated with the current implementation."
          }
        }
      };
      
      const validate = ajv.compile(schema);
      const valid = validate(validMessage);
      
      expect(valid).toBe(true);
    });
    
    it('should reject an invalid MCP-L message with wrong sentiment value', () => {
      const invalidMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'not_a_valid_sentiment', // Invalid sentiment
            confidence: 0.8
          }
        }
      };
      
      const validate = ajv.compile(schema);
      const valid = validate(invalidMessage);
      
      expect(valid).toBe(false);
    });
  });

  describe('YAML conversion', () => {
    it('should convert between YAML and JSON formats', () => {
      const yamlPath = path.join(__dirname, '../../schema/mcp-l-schema.yaml');
      const yamlSchema = yaml.parse(fs.readFileSync(yamlPath, 'utf8'));
      
      expect(yamlSchema.version).toBe(schema.version);
      expect(yamlSchema.$id).toBe(schema.$id);
    });
  });
});
