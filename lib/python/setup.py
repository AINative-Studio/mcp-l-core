"""
MCP-L Python Client Library Setup
"""

from setuptools import setup, find_packages
import os

# Read the contents of the README file
with open('README.md', 'r', encoding='utf-8') as f:
    long_description = f.read()

setup(
    name="mcpl",
    version="0.1.0",
    author="AINative Studio",
    author_email="info@ainative.studio",
    description="MCP-L: Model Context Protocol - Listening Layer client library",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/AINative-Studio/mcp-l-core",
    packages=find_packages(),
    package_data={
        'mcpl': ['schema/*.json', 'schema/*.yaml'],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules"
    ],
    python_requires=">=3.7",
    install_requires=[
        "jsonschema>=4.0.0",
    ],
)
