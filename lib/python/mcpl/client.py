"""
MCP-L Client Implementation
Following Semantic Seed Coding Standards with TDD approach
"""

import json
import os
import pkg_resources
from typing import List, Dict, Union, Optional, Any
import jsonschema


class MessageBuilder:
    """
    Builder class for creating MCP-L protocol messages.
    Follows the fluent interface pattern for method chaining.
    """
    
    def __init__(self):
        """Initialize a new MCP-L message builder."""
        self.message = {"behavior_tags": {}}
    
    def add_sentiment(self, sentiment: str, confidence: Optional[float] = None) -> 'MessageBuilder':
        """
        Add sentiment analysis data to the message.
        
        Args:
            sentiment: Detected sentiment (e.g., 'frustrated', 'excited', 'neutral')
            confidence: Optional confidence score (0.0 to 1.0)
            
        Returns:
            Self reference for method chaining
        """
        sentiment_data = {"detected": sentiment}
        if confidence is not None:
            sentiment_data["confidence"] = confidence
            
        self.message["behavior_tags"]["sentiment"] = sentiment_data
        return self
    
    def add_mirror_intent(self, mirrored_text: str, confidence: Optional[float] = None) -> 'MessageBuilder':
        """
        Add mirroring of user intent to confirm understanding.
        
        Args:
            mirrored_text: A rephrasing of the user's intent
            confidence: Optional confidence score (0.0 to 1.0)
            
        Returns:
            Self reference for method chaining
        """
        mirror_data = {"mirrored_text": mirrored_text}
        if confidence is not None:
            mirror_data["confidence"] = confidence
            
        self.message["behavior_tags"]["mirror_intent"] = mirror_data
        return self
    
    def add_clarify_before_execute(self, required: bool, 
                                clarification_prompt: Optional[str] = None,
                                options: Optional[List[str]] = None) -> 'MessageBuilder':
        """
        Add clarification requirements before execution.
        
        Args:
            required: Whether clarification is required
            clarification_prompt: Optional prompt to ask for clarification
            options: Optional list of clarification options
            
        Returns:
            Self reference for method chaining
        """
        clarify_data = {"required": required}
        if clarification_prompt:
            clarify_data["clarification_prompt"] = clarification_prompt
        if options:
            clarify_data["options"] = options
            
        self.message["behavior_tags"]["clarify_before_execute"] = clarify_data
        return self
    
    def add_follow_up_required(self, required: bool, 
                            follow_up_items: Optional[List[str]] = None) -> 'MessageBuilder':
        """
        Add follow-up requirements after execution.
        
        Args:
            required: Whether follow-up is required
            follow_up_items: Optional list of follow-up items or questions
            
        Returns:
            Self reference for method chaining
        """
        follow_up_data = {"required": required}
        if follow_up_items:
            follow_up_data["follow_up_items"] = follow_up_items
            
        self.message["behavior_tags"]["follow_up_required"] = follow_up_data
        return self
    
    def add_suggested_tone(self, tone: str, explanation: Optional[str] = None) -> 'MessageBuilder':
        """
        Add suggested tone for agent responses.
        
        Args:
            tone: Suggested tone (e.g., 'empathetic', 'technical')
            explanation: Optional explanation for the suggested tone
            
        Returns:
            Self reference for method chaining
        """
        tone_data = {"tone": tone}
        if explanation:
            tone_data["explanation"] = explanation
            
        self.message["behavior_tags"]["suggested_tone"] = tone_data
        return self
    
    def add_agent_feedback(self, context_update: Optional[str] = None,
                        user_preferences: Optional[Dict[str, Any]] = None) -> 'MessageBuilder':
        """
        Add agent feedback about the interaction.
        
        Args:
            context_update: Optional context updates for future interactions
            user_preferences: Optional learned user preferences
            
        Returns:
            Self reference for method chaining
        """
        feedback_data = {}
        if context_update:
            feedback_data["context_update"] = context_update
        if user_preferences:
            feedback_data["user_preferences"] = user_preferences
            
        if feedback_data:
            self.message["behavior_tags"]["agent_feedback"] = feedback_data
        
        return self
    
    def add_sscs_compliance(self, story_type: Optional[str] = None,
                        tdd_phase: Optional[str] = None,
                        workflow_step: Optional[str] = None) -> 'MessageBuilder':
        """
        Add Semantic Seed Coding Standards compliance information.
        
        Args:
            story_type: Optional story type ('feature', 'bug', 'chore')
            tdd_phase: Optional TDD phase ('red', 'green', 'refactor')
            workflow_step: Optional workflow step
            
        Returns:
            Self reference for method chaining
        """
        compliance_data = {}
        if story_type:
            compliance_data["story_type"] = story_type
        if tdd_phase:
            compliance_data["tdd_phase"] = tdd_phase
        if workflow_step:
            compliance_data["workflow_step"] = workflow_step
            
        if compliance_data:
            self.message["sscs_compliance"] = compliance_data
        
        return self
    
    def build(self) -> Dict[str, Any]:
        """
        Build and return the complete MCP-L message.
        
        Returns:
            The constructed MCP-L message as a dictionary
        """
        return self.message


def validate_message(message: Dict[str, Any]) -> bool:
    """
    Validate an MCP-L message against the schema.
    
    Args:
        message: The message to validate
        
    Returns:
        True if the message is valid, False otherwise
    """
    schema_path = os.path.join(os.path.dirname(__file__), 'schema', 'mcp-l-schema.json')
    
    # Try to find the schema in the package resources if not found locally
    if not os.path.exists(schema_path):
        try:
            schema_data = pkg_resources.resource_string('mcpl', 'schema/mcp-l-schema.json')
            schema = json.loads(schema_data)
        except (pkg_resources.DistributionNotFound, FileNotFoundError):
            raise ValueError("Could not find MCP-L schema. Please ensure the package is correctly installed.")
    else:
        with open(schema_path, 'r') as f:
            schema = json.load(f)
    
    try:
        jsonschema.validate(instance=message, schema=schema)
        return True
    except jsonschema.exceptions.ValidationError:
        return False


def get_validation_errors(message: Dict[str, Any]) -> List[str]:
    """
    Get validation error messages for an MCP-L message.
    
    Args:
        message: The message to validate
        
    Returns:
        List of validation error messages
    """
    schema_path = os.path.join(os.path.dirname(__file__), 'schema', 'mcp-l-schema.json')
    
    # Try to find the schema in the package resources if not found locally
    if not os.path.exists(schema_path):
        try:
            schema_data = pkg_resources.resource_string('mcpl', 'schema/mcp-l-schema.json')
            schema = json.loads(schema_data)
        except (pkg_resources.DistributionNotFound, FileNotFoundError):
            raise ValueError("Could not find MCP-L schema. Please ensure the package is correctly installed.")
    else:
        with open(schema_path, 'r') as f:
            schema = json.load(f)
    
    validator = jsonschema.Draft7Validator(schema)
    errors = []
    
    for error in validator.iter_errors(message):
        path = ".".join(str(p) for p in error.path) if error.path else "/"
        errors.append(f"{path}: {error.message}")
    
    return errors
