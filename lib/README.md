# MCP-L Client Libraries

This directory contains client libraries for the MCP-L protocol in multiple programming languages.

## Overview

MCP-L (Model Context Protocol - Listening Layer) client libraries help developers easily integrate empathetic AI agent behaviors into their applications. These libraries follow the Semantic Seed Coding Standards and are built using Test-Driven Development principles.

## Available Libraries

### Python

```python
from mcpl import MessageBuilder

# Create a new message
builder = MessageBuilder()
message = builder.add_sentiment("frustrated", 0.9) \
                 .add_mirror_intent("I understand you want to implement a new feature without breaking existing functionality.") \
                 .add_clarify_before_execute(True, "Would you like me to modify all files or just the main module?") \
                 .add_suggested_tone("empathetic", "User seems frustrated with the current implementation.") \
                 .build()

# Validate a message
from mcpl import validate_message
is_valid = validate_message(message)
```

### JavaScript

```javascript
const { MessageBuilder, Validator } = require('mcpl-client');

// Create a new message
const builder = new MessageBuilder();
const message = builder
  .addSentiment("frustrated", 0.9)
  .addMirrorIntent("I understand you want to implement a new feature without breaking existing functionality.")
  .addClarifyBeforeExecute(true, "Would you like me to modify all files or just the main module?")
  .addSuggestedTone("empathetic", "User seems frustrated with the current implementation.")
  .build();

// Validate a message
const validator = new Validator();
const isValid = validator.validate(message);
```

## Installation

### Python

```bash
cd lib/python
pip install -e .
```

### JavaScript

```bash
cd lib/javascript
npm install
```

## Library Features

Each library includes:

1. **Message Building** - Fluent API for creating valid MCP-L messages
2. **Schema Validation** - Validate messages against the MCP-L schema
3. **Error Reporting** - Detailed error messages for invalid messages
4. **Behavior Tag Support** - All core MCP-L behavior tags:
   - Sentiment Analysis
   - Mirror Intent
   - Clarify Before Execute
   - Follow-up Required
   - Suggested Tone

## Testing

Tests are written following BDD-style and can be run with:

### Python

```bash
cd lib/python
pytest
```

### JavaScript

```bash
cd lib/javascript
npm test
```

## SSCS Compliance

These libraries follow Semantic Seed Coding Standards:
- TDD approach with Red-Green-Refactor cycles
- Consistent naming conventions
- Comprehensive documentation
- Fluent interfaces for better developer experience

## Version

Current client library version: 0.1.0
