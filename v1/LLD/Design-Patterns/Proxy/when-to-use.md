# When to Use Proxy

## Reach for it when
- Creating or accessing the real object is expensive, and you want to defer that cost until it's actually needed (virtual proxy).
- You need to add access control/permission checks in front of an object without changing the object itself (protection proxy).
- The real object lives elsewhere (another process, service, or machine) and you want calling code to interact with it as if it were local (remote proxy).
- You want to cache results of expensive operations transparently to the caller (caching proxy).

## Don't reach for it when
- Access to the real object is cheap and unrestricted — there's nothing to control or defer, so a proxy is pure overhead.
- What you actually want is to *add new behavior/responsibility* rather than control access — that's Decorator, and usually implies you want stacking, which Proxy typically doesn't.

## What interviewers are actually listening for
Naming the specific proxy variant relevant to the scenario (virtual, protection, remote, caching) rather than a vague "it controls access." Also, being able to clearly separate Proxy from Decorator by intent (access control vs. behavior addition) even though the class structure looks nearly identical — this is one of the most commonly confused pattern pairs in interviews.
