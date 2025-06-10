/**
 * MCP-L Python Client Library Tests
 * Following Semantic Seed Coding Standards with BDD-style testing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Python Client Library', () => {
  
  const pythonLibPath = path.join(__dirname, '../../lib/python');
  const mainPyPath = path.join(pythonLibPath, 'mcpl/client.py');
  
  it('should have the main client module file', () => {
    expect(fs.existsSync(mainPyPath)).toBe(true);
  });
  
  it('should have a proper package structure', () => {
    expect(fs.existsSync(path.join(pythonLibPath, 'mcpl/__init__.py'))).toBe(true);
    expect(fs.existsSync(path.join(pythonLibPath, 'setup.py'))).toBe(true);
  });
  
  it('should have a MessageBuilder class', () => {
    const content = fs.readFileSync(mainPyPath, 'utf8');
    expect(content).toContain('class MessageBuilder');
  });
  
  it('should have schema validation capabilities', () => {
    const content = fs.readFileSync(mainPyPath, 'utf8');
    expect(content).toContain('validate_message');
  });
  
  it('should provide methods for all behavior tags', () => {
    const content = fs.readFileSync(mainPyPath, 'utf8');
    expect(content).toContain('add_sentiment');
    expect(content).toContain('add_mirror_intent');
    expect(content).toContain('add_clarify_before_execute');
    expect(content).toContain('add_follow_up_required');
    expect(content).toContain('add_suggested_tone');
  });
});
