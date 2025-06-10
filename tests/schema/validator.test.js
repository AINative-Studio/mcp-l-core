/**
 * MCP-L Schema Validator Tests
 * Following Semantic Seed Coding Standards with BDD-style testing
 */

const path = require('path');
const fs = require('fs');
const yaml = require('yaml');
const MCPLValidator = require('../../schema/validator');

describe('MCPLValidator', () => {
  let validator;
  let schemaPath;
  
  beforeEach(() => {
    schemaPath = path.resolve(__dirname, '../../schema/mcp-l-schema.json');
    validator = new MCPLValidator(schemaPath);
  });
  
  describe('initialization', () => {
    it('should load the schema from a file path', () => {
      expect(validator.schema).toBeDefined();
      expect(validator.validate).toBeDefined();
    });
    
    it('should use the default schema path if none provided', () => {
      const defaultValidator = new MCPLValidator();
      expect(defaultValidator.schema).toBeDefined();
    });
    
    it('should handle YAML schema format', () => {
      const yamlSchemaPath = path.resolve(__dirname, '../../schema/mcp-l-schema.yaml');
      const yamlValidator = new MCPLValidator(yamlSchemaPath);
      expect(yamlValidator.schema).toBeDefined();
      expect(yamlValidator.schema).toEqual(validator.schema);
    });
    
    it('should handle YAML schema with .yml extension', () => {
      // Create a mock for readFileSync to simulate a .yml file
      jest.spyOn(fs, 'readFileSync').mockImplementationOnce((path, options) => {
        // Only mock for files ending with .yml
        if (path.endsWith('.yml')) {
          return 'version: "1.0"\ntitle: "Test Schema"';
        }
        // For all other files, call the original implementation
        return jest.requireActual('fs').readFileSync(path, options);
      });
      
      const ymlSchemaPath = path.resolve(__dirname, './test-schema.yml');
      const ymlValidator = new MCPLValidator(ymlSchemaPath);
      expect(ymlValidator.schema).toBeDefined();
      expect(ymlValidator.schema.version).toBe('1.0');
    });
    
    it('should throw error for unsupported file format', () => {
      const badPath = path.resolve(__dirname, '../dummy.txt');
      expect(() => new MCPLValidator(badPath)).toThrow(/Unsupported schema format/);
    });
    
    it('should throw error for non-existent file', () => {
      const nonExistentPath = path.resolve(__dirname, 'non-existent.json');
      expect(() => new MCPLValidator(nonExistentPath)).toThrow(/Schema file not found/);
    });
  });
  
  describe('message validation', () => {
    it('should validate a valid message', () => {
      const validMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'neutral',
            confidence: 0.8
          }
        }
      };
      
      const result = validator.validateMessage(validMessage);
      expect(result).toBe(true);
    });
    
    it('should reject invalid message with incorrect sentiment', () => {
      const invalidMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'invalid_value',
            confidence: 0.8
          }
        }
      };
      
      const result = validator.validateMessage(invalidMessage);
      expect(result).toBe(false);
    });
    
    it('should reject message with incorrect confidence value', () => {
      const invalidMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'neutral',
            confidence: 1.5 // Should be between 0 and 1
          }
        }
      };
      
      const result = validator.validateMessage(invalidMessage);
      expect(result).toBe(false);
    });
    
    it('should reject message with missing required property', () => {
      const invalidMessage = {
        behavior_tags: {
          clarify_before_execute: {
            // Missing required 'required' property
            clarification_prompt: "Do you want to continue?"
          }
        }
      };
      
      const result = validator.validateMessage(invalidMessage);
      expect(result).toBe(false);
    });
  });
  
  describe('error handling', () => {
    it('should return empty array when no errors', () => {
      const validMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'neutral',
            confidence: 0.8
          }
        }
      };
      
      validator.validateMessage(validMessage);
      expect(validator.getErrors()).toEqual([]);
    });
    
    it('should handle generic schema loading errors', () => {
      // Create a custom error without the ENOENT code to trigger the generic error path
      const genericError = new Error('Generic schema error');
      jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw genericError;
      });
      
      // This should throw the original error, not our custom message
      expect(() => new MCPLValidator('./generic-error.json')).toThrow('Generic schema error');
    });
    
    it('should provide validation errors for invalid message', () => {
      const invalidMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'invalid_value',
            confidence: 0.8
          }
        }
      };
      
      validator.validateMessage(invalidMessage);
      const errors = validator.getErrors();
      expect(errors).not.toEqual([]);
      expect(Array.isArray(errors)).toBe(true);
    });
    
    it('should provide formatted error messages', () => {
      const invalidMessage = {
        behavior_tags: {
          sentiment: {
            detected: 'invalid_value',
            confidence: 0.8
          }
        }
      };
      
      validator.validateMessage(invalidMessage);
      const messages = validator.getErrorMessages();
      
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toContain('detected');
      expect(messages[0]).toContain('allowed values');
    });
    
    it('should access validate.errors directly in getErrorMessages', () => {
      // Direct test for the getErrorMessages method in validator.js
      // Mock validate.errors to test the direct access
      validator.validate.errors = [
        { instancePath: '/test/path', message: 'Test error message' }
      ];
      
      const messages = validator.getErrorMessages();
      
      expect(messages.length).toBe(1);
      expect(messages[0]).toBe('/test/path: Test error message');
    });
    
    it('should handle null errors in getErrorMessages', () => {
      // Test the specific branch where validate.errors is null
      // This is different from the empty array test which just returns []  
      validator.validate.errors = null;
      
      const messages = validator.getErrorMessages();
      
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(0);
    });
    
    it('should handle missing instancePath in errors', () => {
      // Test case where instancePath is undefined
      validator.validate.errors = [
        { message: 'Error without path' }
      ];
      
      const messages = validator.getErrorMessages();
      
      expect(messages.length).toBe(1);
      expect(messages[0]).toBe('/: Error without path');
    });
  });
  
  describe('utility methods', () => {
    it('should return the schema version', () => {
      const version = validator.getSchemaVersion();
      expect(typeof version).toBe('string');
      expect(version).not.toBe('unknown');
    });
  });
});
