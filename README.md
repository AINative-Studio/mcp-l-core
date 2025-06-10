# MCP-L Core

## Model Context Protocol - Listening Layer

MCP-L is an open behavioral extension to Anthropic's Model Context Protocol (MCP), designed to add active listening, empathy, and tone-awareness to AI coding agents.

## Overview

This repository contains the open source components of the MCP-L project, providing:

1. **Protocol Schema Definition** - JSON/YAML schema for MCP-L messages
2. **Client Libraries** - Official libraries for Python and JavaScript
3. **Middleware Components** - Basic sentiment analysis and behavioral extensions
4. **Streamlit Dashboards** - Visualization tools for agent interactions

## Project Structure

```
mcp-l-core/
├── schema/                # Protocol schema definition
│   ├── mcp-l-schema.json  # JSON schema
│   ├── mcp-l-schema.yaml  # YAML schema
│   └── validator.js       # Schema validation utility
├── lib/                   # Client libraries
│   ├── python/            # Python client library
│   └── javascript/        # JavaScript client library
├── tests/                 # Test suites
│   ├── schema/            # Schema tests
│   └── lib/               # Client library tests
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- Python 3.7 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AINative-Studio/mcp-l-core.git
cd mcp-l-core

# Install JavaScript dependencies
npm install

# Install Python client library
cd lib/python
pip install -e .
cd ../..
```

### Running Tests

Following the Semantic Seed Coding Standards, all code is developed using Test-Driven Development (TDD):

```bash
# Run all tests
npm test
```

## Protocol Features

MCP-L extends AI agents with:

- **Sentiment Analysis** - Detect user frustration, excitement, and other emotions
- **Intent Mirroring** - Confirm understanding before executing actions
- **Clarification Prompts** - Ask for clarification when needed
- **Follow-up Management** - Track items requiring follow-up
- **Tone Awareness** - Respond with appropriate tone based on user sentiment

## Development Workflow

This project follows the [Semantic Seed Coding Standards](https://semibermanticseed.com/standards):

### Branch Naming Convention
- `feature/{id}` for new features
- `bug/{id}` for bug fixes
- `chore/{id}` for maintenance tasks

### TDD Workflow
1. Write failing tests (**WIP: Red Tests**)
2. Implement code to make them pass (**WIP: Green Tests**)
3. Refactor and commit (**Refactor complete**)

### Story Types & Estimation
- **Features**: New functionality (points: 1, 2, 3, 5, 8)
- **Bugs**: Fixing issues (points: 1, 2, 3)
- **Chores**: Maintenance tasks (points: 0, 1, 2)

### Commit Messages
Commit messages follow the format:
```
[WIP/Feature/Bug/Chore] #{id}: Brief description

- Detailed bullet points about changes
- Second point if needed
```

### Testing Strategy
- **Unit Tests**: BDD-style using Jest/Mocha
- **Integration Tests**: Ensuring components work together
- **Functional Tests**: API testing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning.
