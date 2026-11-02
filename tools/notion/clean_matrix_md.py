import re
import json

with open('docs/FEATURE_PRIORITISATION_MATRIX.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace math latex display with clean plain text or inline katex acceptable in Notion
text = text.replace('$$\\text{RICE Score} = \\frac{\\text{Reach} \\times \\text{Impact} \\times \\text{Confidence}}{\\text{Effort}}$$', '**RICE Score = (Reach × Impact × Confidence) / Effort**')

# Ensure no angle brackets in tables
text = text.replace('<', 'Under ').replace('>', 'Over ')

with open('docs/specs/matrix_notion_clean.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned matrix markdown ready! Length:', len(text))
