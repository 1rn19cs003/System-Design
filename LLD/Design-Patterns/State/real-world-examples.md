# State — Real-World Examples

- **Document/content workflows** — Draft → In Review → Published, where allowed actions differ at each stage.
- **Order lifecycle in e-commerce** — Placed → Shipped → Delivered → Returned, each with different valid operations (cancel is only valid before shipping, for instance).
- **Media player controls** — Playing, Paused, and Stopped states each interpret the same "press play" button press differently.
- **TCP connection state machine** — Closed, Listen, SYN-Sent, Established, and so on, each handling incoming packets differently per the protocol spec.
- **Traffic light controllers** — Red, Yellow, Green states each defining their own duration and next-state transition.
