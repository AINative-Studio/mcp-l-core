/**
 * MCP-L Schema Validator
 * 
 * Utility for validating MCP-L messages against the schema
 * Follows Semantic Seed Coding Standards
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const yaml = require('yaml');

/**
 * MCP-L Schema Validator class
 */
class MCPLValidator {
  /**
   * Create a new validator instance
   * @param {string} schemaPath - Path to the schema file (json or yaml)
   */
  constructor(schemaPath) {
    // Configure Ajv with allowUnionTypes for more flexible schemas
    // and removeAdditional to ignore custom properties like version
    this.ajv = new Ajv({ 
      allErrors: true, 
      strict: false,  // Disable strict mode to allow custom keywords
      allowUnionTypes: true
    });
    this.schemaPath = schemaPath || path.join(__dirname, './mcp-l-schema.json');
    this.schema = this.loadSchema(this.schemaPath);
    this.validate = this.ajv.compile(this.schema);
  }

  /**
   * Load schema from file
   * @param {string} schemaPath - Path to schema file
   * @returns {Object} The loaded schema
   */
  loadSchema(schemaPath) {
    // Check file extension first before reading
    if (!schemaPath.endsWith('.json') && !schemaPath.endsWith('.yaml') && !schemaPath.endsWith('.yml')) {
      throw new Error('Unsupported schema format. Use .json, .yaml, or .yml');
    }
    
    try {
      const content = fs.readFileSync(schemaPath, 'utf8');
      
      if (schemaPath.endsWith('.json')) {
        return JSON.parse(content);
      } else {
        return yaml.parse(content);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Schema file not found: ${schemaPath}`);
      }
      throw error;
    }
  }

  /**
   * Validate a message against the MCP-L schema
   * @param {Object} message - The message to validate
   * @returns {boolean} Whether the message is valid
   */
  validateMessage(message) {
    return this.validate(message);
  }

  /**
   * Get validation errors from the last validation
   * @returns {Array} List of validation errors
   */
  getErrors() {
    return this.validate.errors || [];
  }

  /**
   * Get formatted error messages from the last validation
   * @returns {string[]} Array of formatted error messages
   */
  getErrorMessages() {
    if (!this.validate.errors) return [];
    
    return this.validate.errors.map(error => {
      const path = error.instancePath || '/';
      return `${path}: ${error.message}`;
    });
  }

  /**
   * Get the current schema version
   * @returns {string} The schema version
   */
  getSchemaVersion() {
    return this.schema.version;
  }
}

module.exports = MCPLValidator;
