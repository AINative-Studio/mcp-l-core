# MCP-L Schema

## Overview

The Model Context Protocol Listening Layer (MCP-L) schema defines the structure of messages that enable AI agents to implement active listening, empathy, and tone-awareness. This schema extends Anthropic's MCP protocol with behavioral extensions.

## Schema Components

The schema consists of several behavior tags:

### Sentiment Analysis
Detects and classifies the emotional tone of user messages:
- `neutral`, `frustrated`, `excited`, `positive`, `negative`, `confused`, `urgent`, `relaxed`

### Mirror Intent
Provides a mechanism for agents to reflect back their understanding of user intent:
```json
{
  "mirrored_text": "I understand you want to implement a new feature without breaking existing functionality.",
  "confidence": 0.9
}
```

### Clarify Before Execute
Indicates when an agent should seek clarification before taking action:
```json
{
  "required": true,
  "clarification_prompt": "Would you like me to modify all files or just the main module?"
}
```

### Follow-up Required
Specifies when follow-up actions or questions are recommended:
```json
{
  "required": true,
  "follow_up_items": ["Confirm test coverage", "Update documentation"]
}
```

### Suggested Tone
Recommends a tone for the agent response:
```json
{
  "tone": "empathetic",
  "explanation": "User seems frustrated with the current implementation."
}
```

## Usage

### Validating Messages

```javascript
const MCPLValidator = require('./validator');
const validator = new MCPLValidator();

const message = {
  behavior_tags: {
    sentiment: {
      detected: 'frustrated',
      confidence: 0.8
    },
    // Add other tags as needed
  }
};

const isValid = validator.validateMessage(message);
if (!isValid) {
  console.log(validator.getErrorMessages());
}
```

## Schema Formats

The schema is available in both JSON and YAML formats:
- `mcp-l-schema.json` - JSON Schema format
- `mcp-l-schema.yaml` - YAML format (equivalent)

## Version

Current schema version: 0.1.0

## SSCS Compliance

This schema follows the Semantic Seed Coding Standards:
- Test-Driven Development (TDD) with BDD-style tests
- Comprehensive documentation
- Clear naming conventions
