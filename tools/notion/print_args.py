import json

with open("formatted_tool_args.json") as f:
    args = json.load(f)

# Inspect content
print("Target match:", repr(args["update_content"]["content_updates"][0]["old_str"]))
print("New text starts with:", repr(args["update_content"]["content_updates"][0]["new_str"][:80]))
