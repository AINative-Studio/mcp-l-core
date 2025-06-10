# Contributing to MCP-L Core

We love your input! We want to make contributing to MCP-L Core as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We follow the [Semantic Seed Coding Standards](https://semanticseed.com/standards) using GitHub to host code, track issues and feature requests, and accept pull requests.

### Semantic Seed Coding Standards

This project adheres to specific coding standards:

#### Branch Naming Convention
- `feature/{id}` for new features
- `bug/{id}` for bug fixes
- `chore/{id}` for maintenance tasks

#### TDD Workflow
1. Write failing tests (**WIP: Red Tests**)
2. Implement code to make them pass (**WIP: Green Tests**)
3. Refactor and commit (**Refactor complete**)

#### Commit Messages
Commit messages follow the format:
```
[WIP/Feature/Bug/Chore] #{id}: Brief description

- Detailed bullet points about changes
- Second point if needed
```

## Pull Requests

1. Update the README.md and documentation with details of changes if needed
2. Update the tests following the TDD (Test-Driven Development) approach
3. The PR should work for all supported platforms
4. All tests must pass before merging

## Testing Standards

We follow Behavior-Driven Development (BDD) style testing:

```javascript
describe('Calculator', () => {
  describe('addition', () => {
    it('should correctly add two positive numbers', () => {
      expect(add(5, 7)).to.equal(12);
    });
  });
});
```

## Coding Style

* Use 4-space indentation
* Keep lines under 80 characters
* Use camelCase for variable names and functions
* Use PascalCase for class names
* Write meaningful comments
* Document all public APIs

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## References

This document was adapted from the open-source contribution guidelines template, aligned with Semantic Seed Coding Standards.
