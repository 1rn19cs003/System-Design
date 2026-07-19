# When to Use Abstract Factory

## Reach for it when
- Your app needs to create families of related objects, and mixing objects from different families would cause real bugs or visual/behavioral inconsistency (UI themes, database driver sets, OS-specific implementations).
- You want to swap an entire family of implementations by changing one thing (which factory instance you're holding), without touching the rest of the codebase.

## Don't reach for it when
- You only have one product type — that's plain Factory Method, no need for the extra interface layer.
- The family of products is unstable and keeps changing shape — every new product means editing the abstract interface and every concrete factory, which gets expensive fast.

## What interviewers are actually listening for
Being able to state, precisely, the difference from Factory Method: Abstract Factory exists to guarantee that a *set* of created objects are compatible with each other. If you can't name why mixing two products from different factories would be a bug in your example, you're probably describing Factory Method, not Abstract Factory.
