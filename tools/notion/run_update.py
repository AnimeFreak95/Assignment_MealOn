import json

with open("formatted_tool_args.json") as f:
    args = json.load(f)

print("Args loaded successfully.")
