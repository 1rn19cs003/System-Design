# Microservices — Real-World Examples

- **Amazon** — famously split its monolith into hundreds of independently deployable services, each owned by a small team, communicating over well-defined APIs.
- **Netflix** — one of the most cited microservices adopters, with separate services for recommendations, playback, billing, and more, fronted by an API gateway (Zuul).
- **Uber** — decomposed its original monolith into thousands of microservices as it scaled, handling trips, payments, and maps as separate systems.
- **API gateways in practice** — Kong, AWS API Gateway, and Netflix's Zuul all serve as the single entry point that routes client requests to the right backend microservice.
