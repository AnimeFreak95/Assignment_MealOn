import json

with open("section_6_to_insert.txt") as f:
    s = f.read()

print("Section 6 length:", len(s))
print("Zomato Everyday count:", s.count("Zomato Everyday"))
