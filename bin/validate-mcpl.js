#!/usr/bin/env node

/**
 * MCP-L Schema Validator CLI Tool
 * Following Semantic Seed Coding Standards
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Load the schema
const schemaPath = path.resolve(__dirname, '../schema/mcp-l-schema.json');
let schema;
try {
  schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
} catch (error) {
  console.error(`Error loading schema: ${error.message}`);
  process.exit(1);
}

// Set up validator
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Usage: validate-mcpl <path-to-json-file>');
  process.exit(1);
}

// Read and validate the input file
try {
  const inputPath = path.resolve(process.cwd(), args[0]);
  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  const valid = validate(inputData);
  
  if (valid) {
    console.log('\x1b[32m%s\x1b[0m', '✓ Message is valid MCP-L');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '✗ Message validation failed');
    console.log('\nErrors:');
    
    validate.errors.forEach((error, index) => {
      const path = error.instancePath || '/';
      console.log(`\n${index + 1}. ${path}: ${error.message}`);
      if (error.params) {
        console.log('   Params:', JSON.stringify(error.params));
      }
    });
    
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
