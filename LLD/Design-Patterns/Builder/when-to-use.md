# When to Use Builder

## Reach for it when
- An object has many fields, most of them optional, and a constructor would need multiple overloads or a long, error-prone parameter list.
- The object should be immutable once constructed, and you want to avoid it ever existing in a partially-configured state.
- Different valid configurations of the object exist and it helps to name common ones (a `Director` building a "gaming PC" vs. an "office PC" from the same builder).

## Don't reach for it when
- The object has two or three fields with no optional combinations — a plain constructor communicates the same thing with less code.
- Your language has named/default parameters and the construction logic has no real validation or ordering rules — just call the constructor with keyword arguments.

## What interviewers are actually listening for
Knowing when *not* to use Builder is as important as knowing the pattern. A candidate who reaches for Builder on a 2-field class is showing pattern-matching without judgment. A strong answer explains the actual trigger: long parameter lists, optional fields, and the value of immutability — not "it's a well-known pattern so I'll use it."
