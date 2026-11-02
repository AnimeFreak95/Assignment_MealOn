import json
import re

with open('docs/specs/pilot_notion_clean.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace < and > in tables to avoid HTML tag interpretation
text = text.replace('< 65%', 'Under 65%')
text = text.replace('< 92.0%', 'Under 92.0%')
text = text.replace('> 2.0%', 'Over 2.0%')
text = text.replace('> ₹35.00', 'Over ₹35.00')
text = text.replace('< 50%', 'Under 50%')

with open('docs/specs/pilot_notion_clean.md', 'w', encoding='utf-8') as f:
    f.write(text)

payload = {
    'page_id': '40c80bcd-a129-8104-a60c-c794296c090c',
    'replace_content': {
        'allow_deleting_content': True,
        'new_str': text
    }
}

with open('tools/notion/update_subpage9_replace.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

tags = re.findall(r'<[^>]+>', text)
print('Remaining HTML tags:', tags)
print('Done!')
